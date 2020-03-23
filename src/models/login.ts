import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import router from 'umi/router';

import store from '@/utils/store';
import { getPageQuery } from '@/utils/utils';
import { AccountLogin, Logout } from '@/services/login';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { response, data } = yield call(AccountLogin, payload);
      // Login successfully
      if (response.status === 201 && data.expires_in && data.expires_in > 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: data,
        });

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      }
    },

    *logout({ payload }, { call }) {
      const { response } = yield call(Logout, payload);
      if (response.status === 204) {
        store.clearAccessToken();
        const { redirect } = getPageQuery();
        // Note: There may be security issues, please note
        if (window.location.pathname !== '/user/login' && !redirect) {
          router.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      store.setAccessToken(payload);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
