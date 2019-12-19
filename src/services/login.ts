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

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
