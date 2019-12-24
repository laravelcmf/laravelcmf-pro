import { setStore, getStore, removeItem } from './storage';

const accessTokenKey = 'access_token';

export interface TokenParamsType {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export default class store {
  // 设定访问令牌
  static setAccessToken(paramsType: TokenParamsType): void {
    setStore(accessTokenKey, paramsType);
  }

  // 获取访问令牌
  static getAccessToken(): TokenParamsType | '' {
    const tokenParm = getStore(accessTokenKey);
    if (!tokenParm || tokenParm === '') {
      return '';
    }
    return tokenParm;
  }

  // 清空访问令牌
  static clearAccessToken(): void {
    removeItem(accessTokenKey);
  }
}
