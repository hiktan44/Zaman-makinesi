export interface User {
  id: number;
  email: string;
  password_hash?: string;
  google_id?: string;
  is_admin: boolean;
  credits: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreditPackage {
  id: number;
  credits: number;
  price_try: number;
  stripe_price_id?: string;
  is_active: boolean;
  created_at: Date;
}

export interface Payment {
  id: number;
  user_id: number;
  package_id: number;
  amount_eur?: number;
  amount_try: number;
  stripe_payment_intent_id?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

export interface UserActivity {
  id: number;
  user_id: number;
  action_type: 'image_generation' | 'credit_purchase' | 'admin_action' | 'registration' | 'login';
  credits_used: number;
  description: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface SystemSetting {
  key: string;
  value: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  is_admin: boolean;
}

export interface GoogleProfile {
  id: string;
  emails: [{ value: string; verified: boolean }];
  displayName?: string;
  photos?: [{ value: string }];
}
