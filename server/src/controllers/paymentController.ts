import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import Stripe from 'stripe';
import { query } from '../config/database';
import { convertTRYtoEUR } from '../services/exchangeRateService';
import { PAYMENT_TRANSITION, processCheckout, requirePaymentTransition } from '../services/paymentFulfillment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export const getPackages = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM credit_packages WHERE is_active = TRUE ORDER BY credits', []);
    res.json({ packages: result.rows });
  } catch {
    res.status(500).json({ error: 'Paketler alınamadı' });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
    const packageId = Number(req.body.packageId);
    if (!Number.isSafeInteger(packageId) || packageId <= 0 || packageId > 2147483647) {
      return res.status(400).json({ error: 'Geçerli paket kimliği gereklidir' });
    }
    await requirePaymentTransition();
    const packages = await query('SELECT * FROM credit_packages WHERE id = $1 AND is_active = TRUE', [packageId]);
    const pkg = packages.rows[0];
    if (!pkg) return res.status(404).json({ error: 'Paket bulunamadı' });
    const priceTry = Number(pkg.price_try);
    if (!Number.isSafeInteger(pkg.credits) || pkg.credits <= 0 || pkg.credits > 2147483647 ||
        !Number.isFinite(priceTry) || priceTry <= 0) {
      return res.status(500).json({ error: 'Paket yapılandırması geçersiz' });
    }
    const eurAmount = await convertTRYtoEUR(priceTry);
    const cents = Math.round(eurAmount * 100);
    if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 99999999) {
      return res.status(500).json({ error: 'Ödeme tutarı geçersiz' });
    }
    const binding = randomBytes(32).toString('hex');
    const payment = await query(
      `INSERT INTO payments (user_id, package_id, amount_eur, amount_try, status,
       fulfillment_version, credits_snapshot, amount_eur_cents, currency, checkout_binding)
       VALUES ($1, $2, $3, $4, 'pending', 2, $5, $6, 'eur', $7) RETURNING id`,
      [userId, packageId, cents / 100, priceTry, pkg.credits, cents, binding]
    );
    const id = payment.rows[0].id;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: {
        currency: 'eur', product_data: { name: 'Zaman Makinesi kredi paketi', description: `${pkg.credits} kredi` },
        unit_amount: cents,
      }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?payment_id=${id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?payment_id=${id}`,
      metadata: { payment_id: String(id), user_id: String(userId),
        payment_protocol: PAYMENT_TRANSITION, payment_binding: binding },
    }, { idempotencyKey: `zaman-checkout-${id}-${binding}` });
    if (!/^cs_[A-Za-z0-9_]+$/.test(session.id)) throw new Error('Ödeme oturumu geçersiz');
    // Bildirim önce ulaştıysa aynı session değeri korunur; farklı session bağlanamaz.
    const saved = await query(
      `UPDATE payments SET stripe_session_id = $1 WHERE id = $2
       AND (stripe_session_id IS NULL OR stripe_session_id = $1) RETURNING id`, [session.id, id]
    );
    if (saved.rowCount !== 1) throw new Error('Ödeme oturumu eşleşmedi');
    res.json({ sessionId: session.id, url: session.url });
  } catch {
    console.error('Ödeme oturumu oluşturulamadı; finansal kayıt kontrol edilmelidir');
    res.status(500).json({ error: 'Ödeme başlatılamadı. Lütfen daha sonra tekrar deneyin.' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = (req as any).rawBody;
  if (!Buffer.isBuffer(rawBody) || typeof signature !== 'string') {
    return res.status(400).json({ error: 'Ödeme bildirimi gövdesi ve imzası gereklidir' });
  }
  if (!secret || secret === 'whsec_your-webhook-secret') {
    console.error('Ödeme bildirimi anahtarı yapılandırılmamış');
    return res.status(500).json({ error: 'Ödeme bildirimi yapılandırması eksik' });
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    console.error('Ödeme bildirimi imzası doğrulanamadı');
    return res.status(400).json({ error: 'Ödeme bildirimi imzası geçersiz' });
  }
  try {
    if (['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.expired'].includes(event.type)) {
      const session = event.data.object as Stripe.Checkout.Session;
      // Aynı Stripe hesabının bu uygulamaya ait olmayan oturumları işlenmez.
      if (session.metadata?.payment_id) await processCheckout(event, event.type === 'checkout.session.expired');
    }
    return res.json({ received: true });
  } catch {
    console.error('Ödeme bildirimi işlenemedi; tekrar gönderim veya mutabakat gerekli');
    return res.status(500).json({ error: 'Ödeme bildirimi işlenemedi' });
  }
};

export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
    const result = await query(
      `SELECT p.id, p.user_id, p.package_id, p.amount_eur, p.amount_try, p.status,
       p.stripe_payment_intent_id, p.created_at, COALESCE(p.credits_snapshot, cp.credits) AS credits, cp.price_try
       FROM payments p JOIN credit_packages cp ON p.package_id = cp.id
       WHERE p.user_id = $1 ORDER BY p.created_at DESC`, [userId]
    );
    res.json({ payments: result.rows });
  } catch {
    res.status(500).json({ error: 'Ödemeler alınamadı' });
  }
};
