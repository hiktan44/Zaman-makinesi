declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      password_hash?: string;
      google_id?: string;
      is_admin: boolean;
      credits: number;
      created_at: Date;
      updated_at: Date;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
