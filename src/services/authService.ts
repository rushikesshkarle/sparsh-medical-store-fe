import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';
import type { CustomResponse } from '../types/api';
import type { Admin, LoginResult } from '../types/auth';

export const authService = {
  async login(username: string, password: string): Promise<LoginResult> {
    const { data } = await apiClient.post<CustomResponse<LoginResult>>(API_ENDPOINTS.LOGIN, { username, password });
    return data.result;
  },

  async me(): Promise<Admin> {
    const { data } = await apiClient.get<CustomResponse<Admin>>(API_ENDPOINTS.ME);
    return data.result;
  },
};
