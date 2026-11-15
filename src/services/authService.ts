import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';
import type { CustomResponse } from '../types/api';
import type { LoginResult, User } from '../types/auth';

export const authService = {
  /** Trade the Google popup's authorization code for our access token. */
  async googleLogin(code: string): Promise<LoginResult> {
    const { data } = await apiClient.post<CustomResponse<LoginResult>>(API_ENDPOINTS.GOOGLE_LOGIN, { code });
    return data.result;
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<CustomResponse<User>>(API_ENDPOINTS.ME);
    return data.result;
  },
};
