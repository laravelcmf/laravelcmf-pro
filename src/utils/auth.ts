const accessTokenKey: string = 'access_token';

export default class Auth {
  static setAccessToken(token: string): void {
    sessionStorage.setItem(accessTokenKey, JSON.stringify(token));
  }

  // 获取访问令牌
  static getAccessToken(): any {
    const token = sessionStorage.getItem(accessTokenKey);
    if (!token || token === '') {
      return null;
    }
    return JSON.parse(token);
  }

  // 清空访问令牌
  static clearAccessToken(): void {
    sessionStorage.removeItem(accessTokenKey);
  }
}
