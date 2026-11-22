-- Önce eski ödeme/kredi yazıcılarını durdurun. Bootstrap migrate komutu değildir.
-- Belirsiz eski ödemeler veya negatif bakiyeler otomatik düzeltilmez.
BEGIN;
LOCK TABLE users, payments, user_activities IN ACCESS EXCLUSIVE MODE;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE credits IS NULL OR credits < 0) THEN
    RAISE EXCEPTION 'Negatif veya eksik eski kredi bakiyesi: önce finansal mutabakat gerekli';
  END IF;
END $$;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS fulfillment_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS credits_snapshot INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS amount_eur_cents BIGINT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency VARCHAR(3);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS checkout_binding VARCHAR(64);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS payments_checkout_session_unique ON payments(stripe_session_id);
CREATE UNIQUE INDEX IF NOT EXISTS payments_checkout_binding_unique ON payments(checkout_binding);
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'users'::regclass AND conname = 'users_credits_nonnegative') THEN
    ALTER TABLE users ADD CONSTRAINT users_credits_nonnegative CHECK (credits IS NOT NULL AND credits >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'payments'::regclass AND conname = 'payments_v2_snapshot_valid') THEN
    ALTER TABLE payments ADD CONSTRAINT payments_v2_snapshot_valid CHECK (
      fulfillment_version = 1 OR (fulfillment_version = 2 AND credits_snapshot IS NOT NULL AND credits_snapshot > 0
      AND amount_eur_cents IS NOT NULL AND amount_eur_cents > 0 AND currency IS NOT NULL AND currency = 'eur'
      AND amount_eur IS NOT NULL AND amount_eur_cents = amount_eur * 100
      AND checkout_binding IS NOT NULL AND checkout_binding ~ '^[0-9a-f]{64}$')
    );
  END IF;
END $$;
CREATE TABLE IF NOT EXISTS payment_credit_receipts (
  payment_id INTEGER PRIMARY KEY REFERENCES payments(id),
  stripe_session_id VARCHAR(255) NOT NULL UNIQUE,
  event_id VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  credits INTEGER NOT NULL CHECK (credits > 0),
  amount_eur_cents BIGINT NOT NULL CHECK (amount_eur_cents > 0),
  currency VARCHAR(3) NOT NULL CHECK (currency = 'eur'),
  activity_id INTEGER NOT NULL UNIQUE REFERENCES user_activities(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION keep_payment_snapshot() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.fulfillment_version = 2 THEN
    IF ROW(NEW.fulfillment_version, NEW.user_id, NEW.package_id, NEW.credits_snapshot,
           NEW.amount_eur, NEW.amount_try, NEW.amount_eur_cents, NEW.currency, NEW.checkout_binding)
       IS DISTINCT FROM
       ROW(OLD.fulfillment_version, OLD.user_id, OLD.package_id, OLD.credits_snapshot,
           OLD.amount_eur, OLD.amount_try, OLD.amount_eur_cents, OLD.currency, OLD.checkout_binding)
       OR (OLD.stripe_session_id IS NOT NULL AND NEW.stripe_session_id IS DISTINCT FROM OLD.stripe_session_id)
       OR (OLD.status = 'completed' AND NEW.status IS DISTINCT FROM OLD.status) THEN
      RAISE EXCEPTION 'Tamamlanmış ödeme veya ödeme anlık kaydı değiştirilemez';
    END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS payments_snapshot_immutable ON payments;
CREATE TRIGGER payments_snapshot_immutable BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION keep_payment_snapshot();
CREATE TABLE IF NOT EXISTS payment_financial_transition (key TEXT PRIMARY KEY, completed_at TIMESTAMPTZ NOT NULL DEFAULT now());
REVOKE ALL ON payment_credit_receipts, payment_financial_transition FROM PUBLIC;
INSERT INTO payment_financial_transition(key) VALUES ('checkout-credits-v2') ON CONFLICT DO NOTHING;
COMMIT;
