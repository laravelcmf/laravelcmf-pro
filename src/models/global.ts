import { Reducer } from 'redux';
import { Subscription, Effect } from 'dva';

import { GetCollection, GetItem } from '@/utils/response';
import { queryCurrent, queryMenuTree } from '@/services/admin';

// 分页
export interface Pagination {
  current?: number; // 当前页数
  pageSize?: number; // 每页条数
  pageSizeOptions?: string[]; // 指定每页可以显示多少条
  total?: number; // 数据总数
}

export interface CurrentUser {
  id?: number;
  name?: string;
  email?: string;
  portrait?: string;
  login_count?: number;
  last_login_ip?: string;
  status?: number;
  role?: {
    id: number;
    name: string;
    sequence: number;
    memo: string;
    created_at: string;
    updated_at: string;
  };
  role_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuAction {
  id?: number;
  code?: string;
  name?: string;
  menu_id?: number;
}

export interface MenuResource {
  id?: number;
  code?: string;
  name?: string;
  method?: string;
  path?: string;
  menu_id?: number;
}

export interface MenuParam {
  id?: number;
  name?: string;
  parent_id?: number;
  parent_path?: string;
  sequence?: number;
  icon?: string;
  path?: string;
  hidden?: number;
  created_at?: string;
  updated_at?: string;
  actions?: MenuAction[];
  resources?: MenuResource[];
}

export interface GlobalModelState {
  title?: string;
  copyRight?: string;
  collapsed?: boolean;
  defaultURL?: string;
  openKeys?: [];
  selectedKeys?: [];
  user?: CurrentUser;
  menuPaths?: { [key: string]: MenuParam };
  menuMap?: { [key: string]: MenuParam };
  menus?: MenuParam[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    menuEvent: Effect;
    fetchUser: Effect;
    fetchMenuTree: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    changeOpenKeys: Reducer<GlobalModelState>;
    changeSelectedKeys: Reducer<GlobalModelState>;
    saveUser: Reducer<GlobalModelState>;
    saveMenuPaths: Reducer<GlobalModelState>;
    saveMenuMap: Reducer<GlobalModelState>;
    saveMenus: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    title: '权限管理脚手架',
    copyRight: '2019 LaravelCmf',
    defaultURL: '/dashboard',
    openKeys: [],
    selectedKeys: [],
    user: {
      name: 'Admin',
    },
    menuPaths: {},
    menuMap: {},
    menus: [],
  },

  effects: {
    *menuEvent({ pathname }, { put, select }) {
      let p = pathname;
      if (p === '/') {
        p = yield select((state: { global: { defaultURL: string } }) => state.global.defaultURL);
      }

      const menuPaths = yield select(
        (state: { global: { menuPaths: any } }) => state.global.menuPaths,
      );
      const item = menuPaths[p];
      if (!item) {
        return;
      }

      if (item.parent_path && item.parent_path !== '') {
        yield put({
          type: 'changeOpenKeys',
          payload: item.parent_path.split('/'),
        });
      }

      yield put({
        type: 'changeSelectedKeys',
        payload: [item.record_id],
      });
    },

    // 获取我的信息
    *fetchUser({ success }, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveUser',
        payload: GetItem(response),
      });
      if (success) success();
    },

    // 获取我的树形菜单
    *fetchMenuTree({ pathname }, { call, put }) {
      const response = yield call(queryMenuTree);
      const menuData = GetCollection(response) || [];
      yield put({
        type: 'saveMenus',
        payload: menuData,
      });

      const menuPaths = {};
      const menuMap = {};

      function fillData(data: any) {
        for (let i = 0; i < data.length; i += 1) {
          menuMap[data[i].id] = data[i];
          if (data[i].path !== '') {
            menuPaths[data[i].path] = data[i];
          }
          if (data[i].children && data[i].children.length > 0) {
            fillData(data[i].children);
          }
        }
      }

      fillData(menuData);

      yield [
        put({
          type: 'saveMenuPaths',
          payload: menuPaths,
        }),
        put({
          type: 'saveMenuMap',
          payload: menuMap,
        }),
        put({
          type: 'menuEvent',
          pathname,
        }),
      ];
    },
  },

  reducers: {
    changeLayoutCollapsed(state = { collapsed: true }, { payload }) {
      return { ...state, collapsed: payload };
    },
    changeOpenKeys(state, { payload }) {
      return {
        ...state,
        openKeys: payload,
      };
    },
    changeSelectedKeys(state, { payload }) {
      return {
        ...state,
        selectedKeys: payload,
      };
    },
    saveUser(state, { payload }) {
      return { ...state, user: payload.data ? payload.data : payload };
    },
    saveMenuPaths(state, { payload }) {
      return { ...state, menuPaths: payload };
    },
    saveMenuMap(state, { payload }) {
      return { ...state, menuMap: payload };
    },
    saveMenus(state, { payload }) {
      return { ...state, menus: payload };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
