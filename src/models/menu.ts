import * as menuService from '@/services/menu';

import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { Pagination } from '@/models/global';

export interface MenuModelState {
  search?: any;
  pagination?: any;
  data?: {
    list: any;
    pagination: Pagination;
  };
  submitting?: boolean;
  formType?: string;
  formTitle?: string;
  formID?: string;
  formVisible?: boolean;
  formData?: any;
  treeData?: any;
  expandedKeys?: any;
}

export interface MenuModelType {
  namespace: 'menu';
  state: MenuModelState;
  effects: {
    fetch: Effect;
    loadForm: Effect;
    fetchForm: Effect;
    submit: Effect;
    del: Effect;
    fetchTree: Effect;
  };
  reducers: {
    saveMenu: Reducer<MenuModelState>;
    saveSearch: Reducer<MenuModelState>;
    savePagination: Reducer<MenuModelState>;
    changeFormVisible: Reducer<MenuModelState>;
    saveFormType: Reducer<MenuModelState>;
    saveFormTitle: Reducer<MenuModelState>;
    saveFormID: Reducer<MenuModelState>;
    saveFormData: Reducer<MenuModelState>;
    changeSubmitting: Reducer<MenuModelState>;
    saveTreeData: Reducer<MenuModelState>;
    saveExpandedKeys: Reducer<MenuModelState>;
  };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',
  state: {
    search: {},
    pagination: {},
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['15', '30', '45', '60'],
        total: 0,
      },
    },
    submitting: false,
    formType: '',
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
    treeData: [],
    expandedKeys: [],
  },
  effects: {
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {};
      // 搜索条件
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select((state: any) => state.menu.search);
        if (s) {
          params = { ...params, ...s };
        }
      }

      // 分页
      if (pagination) {
        const { current, pageSize } = pagination;
        const page = { page: current, per_page: pageSize };
        params = { ...params, ...page };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select((state: any) => state.menu.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(menuService.query, params);
      yield put({
        type: 'saveMenu',
        payload: response.data || {},
      });
    },
    *loadForm({ payload }, { put, select }) {
      yield put({
        type: 'changeFormVisible',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: '新建菜单',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
        put({ type: 'fetchTree' }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑菜单',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchForm',
            payload: { id: payload.id },
          }),
        ];
      } else {
        const search = yield select((state: any) => state.menu.search);
        yield put({
          type: 'saveFormData',
          payload: { parent_id: search.parentID ? search.parentID : '' },
        });
      }
    },
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(menuService.get, payload);
      yield put({
        type: 'saveFormData',
        payload: response.data || {},
      });
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select((state: any) => state.menu.formType);
      let success = false;
      let response;
      if (formType === 'E') {
        params.id = yield select((state: any) => state.menu.formID);
        response = yield call(menuService.update, params);
      } else {
        response = yield call(menuService.create, params);
      }
      response = response.data || {};
      if (response.id && response.id !== '') {
        success = true;
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (success) {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisible',
          payload: false,
        });

        yield put({ type: 'fetchTree' });
        yield put({ type: 'fetch' });
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(menuService.del, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchTree' });
        yield put({ type: 'fetch' });
      }
    },
    *fetchTree({ payload }, { call, put }) {
      let params = {};
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(menuService.queryTree, params);
      yield put({
        type: 'saveTreeData',
        payload: response.data || [],
      });
    },
  },
  reducers: {
    saveMenu(
      state,
      {
        payload: {
          data,
          meta: { current_page: current = 1, per_page: pageSize = 15, total: total = 0 },
        },
      },
    ) {
      return {
        ...state,
        data: {
          list: data,
          pagination: {
            current: parseInt(current, 10),
            pageSize: parseInt(pageSize, 10),
            total: parseInt(total, 10),
          },
        },
      };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    savePagination(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeFormVisible(state, { payload }) {
      return { ...state, formVisible: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    saveTreeData(state, { payload }) {
      return { ...state, treeData: payload };
    },
    saveExpandedKeys(state, { payload }) {
      return { ...state, expandedKeys: payload };
    },
  },
};

export default MenuModel;
