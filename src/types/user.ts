export interface User {
  id: string;
  email: string;
  password: string;
  fullname: string;
  phone: string | null;
  is_verified: boolean;
  is_active: boolean;
  auth_provider: string;
  provider_user_id: string | null;
  created_at: Date;
  updated_at: Date;
}
