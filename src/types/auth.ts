/** A signed-in user. `is_admin` comes from the backend's ALLOWED_ADMIN_EMAILS. */
export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  is_admin: boolean;
  created_at: string;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}
