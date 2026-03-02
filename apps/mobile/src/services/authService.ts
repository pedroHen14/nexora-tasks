import { AuthResponse, LoginRequest, RegisterRequest } from '@nexora/shared';
import { apiRequest } from './api';

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const res = await apiRequest<{ data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return res.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await apiRequest<{ data: AuthResponse }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}
