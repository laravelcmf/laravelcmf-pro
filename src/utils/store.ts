const accessTokenKey = 'access_token';

export interface TokenParamsType {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export default class store {
  static active = false;

  // 设定访问令牌
  static setAccessToken(paramsType: TokenParamsType): void {
    this.active = true;
    sessionStorage.setItem(accessTokenKey, JSON.stringify(paramsType));
  }

  // 获取访问令牌
  static getAccessToken(): any {
    if (!this.active) return '';
    const token = sessionStorage.getItem(accessTokenKey);
    if (!token || token === '') {
      return null;
    }
    return JSON.parse(token);
  }

  // 清空访问令牌
  static clearAccessToken(): void {
    this.active = false;
    sessionStorage.removeItem(accessTokenKey);
  }
}
