import Stripe from 'stripe';
import { getClient, query } from '../config/database';

export const PAYMENT_TRANSITION = 'checkout-credits-v2';

export async function requirePaymentTransition() {
  const result = await query('SELECT key FROM payment_financial_transition WHERE key = $1', [PAYMENT_TRANSITION]);
  if (result.rowCount !== 1) throw new Error('Ödeme geçişi tamamlanmadı');
}

function paymentId(value: string | undefined): number {
  if (!value || !/^[1-9]\d*$/.test(value)) throw new Error('Ödeme kimliği geçersiz');
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id > 2147483647) throw new Error('Ödeme kimliği geçersiz');
  return id;
}

/** İmzası doğrulanmış Checkout bildiriminin finansal yazımlarını tek işlemde yapar. */
export async function processCheckout(event: Stripe.Event, expired = false): Promise<boolean> {
  await requirePaymentTransition();
  const session = event.data.object as Stripe.Checkout.Session;
  const id = paymentId(session.metadata?.payment_id);
  if (!/^cs_[A-Za-z0-9_]+$/.test(session.id) || !/^evt_[A-Za-z0-9_]+$/.test(event.id)) {
    throw new Error('Ödeme bildirimi kimliği geçersiz');
  }
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const selected = await client.query('SELECT * FROM payments WHERE id = $1 FOR UPDATE', [id]);
    const payment = selected.rows[0];
    if (!payment || payment.fulfillment_version !== 2) throw new Error('Ödeme mutabakatı gerekli');
    if (session.mode !== 'payment' || session.metadata?.user_id !== String(payment.user_id) ||
        session.metadata?.payment_protocol !== PAYMENT_TRANSITION ||
        session.metadata?.payment_binding !== payment.checkout_binding || !payment.checkout_binding ||
        (payment.stripe_session_id && payment.stripe_session_id !== session.id) ||
        session.currency !== payment.currency || !Number.isSafeInteger(session.amount_total) ||
        String(session.amount_total) !== String(payment.amount_eur_cents)) {
      throw new Error('Ödeme bildirimi kayıtla eşleşmiyor');
    }
    const receipt = await client.query('SELECT * FROM payment_credit_receipts WHERE payment_id = $1', [id]);
    if (receipt.rowCount) {
      const prior = receipt.rows[0];
      if (prior.stripe_session_id !== session.id || prior.user_id !== payment.user_id ||
          prior.credits !== payment.credits_snapshot || String(prior.amount_eur_cents) !== String(payment.amount_eur_cents) ||
          prior.currency !== payment.currency || payment.status !== 'completed') {
        throw new Error('Ödeme makbuzu eşleşmiyor');
      }
      await client.query('COMMIT');
      return false;
    }
    if (payment.status === 'completed') throw new Error('Ödeme makbuzu eksik; mutabakat gerekli');
    // Session kaydı aksasa da imzalı ve gizli bağlama değeri eşleşen bildirim
    // aynı ödemeye bağlanabilir. Bu değer kullanıcı yanıtına veya loga yazılmaz.
    await client.query('UPDATE payments SET stripe_session_id = $1 WHERE id = $2', [session.id, id]);
    if (expired) {
      if (session.status !== 'expired') throw new Error('Süre dolma bildirimi geçersiz');
      await client.query("UPDATE payments SET status = 'failed' WHERE id = $1 AND status = 'pending'", [id]);
      await client.query('COMMIT');
      return false;
    }
    if (session.payment_status !== 'paid') {
      await client.query('COMMIT');
      return false;
    }
    if (session.status !== 'complete') throw new Error('Ödeme oturumu tamamlanmadı');
    const credited = await client.query(
      'UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING credits',
      [payment.credits_snapshot, payment.user_id]
    );
    if (credited.rowCount !== 1) throw new Error('Ödeme kullanıcısı bulunamadı');
    const activity = await client.query(
      `INSERT INTO user_activities (user_id, action_type, credits_used, description, metadata)
       VALUES ($1, 'credit_purchase', 0, $2, $3) RETURNING id`,
      [payment.user_id, `${payment.credits_snapshot} kredi paketi satın alındı`, JSON.stringify({
        paymentId: String(id), sessionId: session.id, eventId: event.id,
        credits: payment.credits_snapshot, amountEur: payment.amount_eur, amountTry: payment.amount_try,
      })]
    );
    await client.query(
      `INSERT INTO payment_credit_receipts
       (payment_id, stripe_session_id, event_id, user_id, credits, amount_eur_cents, currency, activity_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, session.id, event.id, payment.user_id, payment.credits_snapshot,
        payment.amount_eur_cents, payment.currency, activity.rows[0].id]
    );
    const intent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    await client.query(
      "UPDATE payments SET status = 'completed', stripe_payment_intent_id = COALESCE(stripe_payment_intent_id, $1) WHERE id = $2",
      [intent || null, id]
    );
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
