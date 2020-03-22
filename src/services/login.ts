import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
}

export async function AccountLogin(params: LoginParamsType) {
  return request('/api/oauth/token', {
    method: 'POST',
    data: params,
  });
}

export async function Logout(): Promise<any> {
  return request('/api/oauth/token', {
    method: 'DELETE',
  });
}
