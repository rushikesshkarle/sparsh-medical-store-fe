/** The store admin (the only account; customers shop as guests). */
export interface Admin {
  username: string;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
  expires_in: number;
  admin: Admin;
}
