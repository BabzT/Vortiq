export interface RegisterUserInput {
  email: string;
  password: string;
  fullname: string;
  phone: string | null;
  auth_provider?: string;
  provider_user_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  email: string;
  code: string;
}
