import { Request, Response } from 'express';
import Stripe from 'stripe';
import { query } from '../config/database';
import { convertTRYtoEUR } from '../services/exchangeRateService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

/**
 * Kredi paketlerini getir
 */
export const getPackages = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM credit_packages WHERE is_active = TRUE ORDER BY credits',
      []
    );

    res.json({ packages: result.rows });
  } catch (error) {
    console.error('Paketleri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Stripe checkout session oluştur
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { packageId } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
    }

    console.log('Checkout session oluşturuluyor:', { userId, packageId });

    if (!packageId) {
      return res.status(400).json({ error: 'Paket ID gereklidir' });
    }

    // Paketi getir
    const packageResult = await query(
      'SELECT * FROM credit_packages WHERE id = $1 AND is_active = TRUE',
      [packageId]
    );

    if (packageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Paket bulunamadı' });
    }

    const pkg = packageResult.rows[0];
    console.log('Paket bulundu:', pkg);

    // TRY → EUR dönüşümü
    let eurAmount: number;
    try {
      eurAmount = await convertTRYtoEUR(pkg.price_try);
      console.log('EUR dönüştürme:', { try: pkg.price_try, eur: eurAmount });
    } catch (err) {
      console.error('EUR dönüştürme hatası:', err);
      return res.status(500).json({ error: 'Kur dönüştürme hatası' });
    }

    // Ödeme kaydı oluştur (pending)
    const paymentResult = await query(
      `INSERT INTO payments (user_id, package_id, amount_eur, amount_try, status) 
       VALUES ($1, $2, $3, $4, 'pending') 
       RETURNING id`,
      [userId, packageId, eurAmount, pkg.price_try]
    );

    const paymentId = paymentResult.rows[0].id;
    console.log('Ödeme kaydı oluşturuldu:', paymentId);

    // Stripe checkout session oluştur
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Zaman Makinesi App Credit',
                description: `${pkg.credits} Kredi`,
                metadata: {
                  packageId: packageId.toString(),
                  credits: pkg.credits.toString(),
                },
              },
              unit_amount: Math.round(eurAmount * 100), // cents
            },
            quantity:1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment/success?payment_id=${paymentId}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?payment_id=${paymentId}`,
        metadata: {
          payment_id: paymentId.toString(),
          user_id: userId.toString(),
        },
      });
      console.log('Stripe session oluşturuldu:', session.id);
    } catch (stripeErr) {
      console.error('Stripe session oluşturma hatası:', stripeErr);
      return res.status(500).json({ error: 'Stripe session oluşturma hatası' });
    }

    // Stripe payment intent ID'yi kaydet
    if (session.payment_intent) {
      await query(
        'UPDATE payments SET stripe_payment_intent_id = $1 WHERE id = $2',
        [session.payment_intent, paymentId]
      );
    }

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout session hatası (genel):', error);
    res.status(500).json({ error: 'Ödeme oluşturma hatası: ' + (error.message || 'Bilinmeyen hata') });
  }
};

/**
 * Stripe webhook handler
 */
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  // Raw body'yi kullan (webhook middleware'i bunu req.rawBody'e koyar)
  const rawBody = (req as any).rawBody;
  
  if (!rawBody) {
    console.error('Raw body bulunamadı!');
    return res.status(400).json({ error: 'Raw body gerekli' });
  }

  if (!sig) {
    console.error('Stripe signature bulunamadı!');
    return res.status(400).json({ error: 'Stripe signature gerekli' });
  }

  if (!webhookSecret || webhookSecret === 'whsec_your-webhook-secret') {
    console.error('STRIPE_WEBHOOK_SECRET doğru ayarlanmamış!');
    return res.status(500).json({ error: 'Webhook secret yapılandırma hatası' });
  }
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature hatası:', error);
    console.error('Sig:', sig ? sig.substring(0, 20) + '...' : 'Yok');
    console.error('Webhook Secret:', webhookSecret ? webhookSecret.substring(0, 20) + '...' : 'Yok');
    return res.status(400).json({ error: 'Geçersiz webhook signature' });
  }

  try {
    console.log(`📩 Webhook event alındı: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentId = session.metadata?.payment_id;

        if (paymentId) {
          // Ödemeyi güncelle
          const paymentResult = await query(
            'SELECT * FROM payments WHERE id = $1',
            [parseInt(paymentId)]
          );

          if (paymentResult.rows.length > 0) {
            const payment = paymentResult.rows[0];

            if (payment.status !== 'completed') {
              // Ödemeyi tamamlanmış olarak işaretle
              await query(
                `UPDATE payments SET status = 'completed' WHERE id = $1`,
                [parseInt(paymentId)]
              );

              // Paket bilgisini al
              const packageResult = await query(
                'SELECT credits FROM credit_packages WHERE id = $1',
                [payment.package_id]
              );

              if (packageResult.rows.length > 0) {
                const credits = packageResult.rows[0].credits;

                // Kullanıcıya kredi ekle
                await query(
                  'UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING credits',
                  [credits, payment.user_id]
                );

                // Aktivite kaydı
                await query(
                  `INSERT INTO user_activities (user_id, action_type, credits_used, description, metadata) 
                   VALUES ($1, 'credit_purchase', 0, $2, $3)`,
                  [
                    payment.user_id,
                    `${credits} kredi paketi satın alındı`,
                    JSON.stringify({
                      paymentId: paymentId,
                      amountEur: payment.amount_eur,
                      amountTry: payment.amount_try,
                    }),
                  ]
                );

                console.log(`✅ Checkout session tamamlandı. ${credits} kredi eklendi. User ID: ${payment.user_id}`);
              }
            }
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentId = session.metadata?.payment_id;

        if (paymentId) {
          await query(
            "UPDATE payments SET status = 'failed' WHERE id = $1",
            [parseInt(paymentId)]
          );
          console.log(`⏰ Checkout session expir edildi. Payment ID: ${paymentId}`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        // Payment intent succeeded - bu event'i log'la ama işlem yapma
        // Checkout session.completed event'i işlenecek
        console.log(`💳 Payment intent succeeded (checkout session tarafından işlenecek)`);
        break;
      }

      default:
        console.log(`İşlenmeyen event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook işleme hatası:', error);
    res.status(500).json({ error: 'Webhook işleme hatası' });
  }
};

/**
 * Kullanıcının ödemelerini getir
 */
export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
    }

    const result = await query(
      `SELECT p.*, cp.credits, cp.price_try 
       FROM payments p 
       JOIN credit_packages cp ON p.package_id = cp.id 
       WHERE p.user_id = $1 
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({ payments: result.rows });
  } catch (error) {
    console.error('Ödemeleri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
