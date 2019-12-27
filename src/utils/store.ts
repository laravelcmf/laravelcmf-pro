import { setStore, getStore, removeItem } from './storage';

const accessTokenKey = 'access_token';

export default class store {
  // 设定访问令牌
  static setAccessToken(paramsType: any): void {
    setStore(accessTokenKey, paramsType);
  }

  // 获取访问令牌
  static getAccessToken() {
    const token = getStore(accessTokenKey);
    if (!token || token === '') {
      return false;
    }
    return token;
  }

  // 清空访问令牌
  static clearAccessToken() {
    removeItem(accessTokenKey);
  }
}
