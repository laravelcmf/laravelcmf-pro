import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { Pagination } from '@/models/global';
import * as roleService from '@/services/role';

export interface RoleModeState {
  search?: any;
  pagination?: Pagination;
  data?: {
    list?: any;
    pagination?: Pagination;
  };
  submitting?: boolean;
  formTitle?: string;
  formType?: string;
  formID?: string;
  formVisible?: boolean;
  formData?: any;
}

export interface RoleModeType {
  namespace: string;
  state: RoleModeState;
  effects: {
    fetch: Effect;
    loadForm: Effect;
    fetchForm: Effect;
    submit: Effect;
    del: Effect;
  };
  reducers: {
    saveData: Reducer<RoleModeState>;
    saveSearch: Reducer<RoleModeState>;
    savePagination: Reducer<RoleModeState>;
    changeFormVisible: Reducer<RoleModeState>;
    saveFormTitle: Reducer<RoleModeState>;
    saveFormType: Reducer<RoleModeState>;
    saveFormID: Reducer<RoleModeState>;
    saveFormData: Reducer<RoleModeState>;
    changeSubmitting: Reducer<RoleModeState>;
  };
}

const Role: RoleModeType = {
  namespace: 'role',
  state: {
    search: {},
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: ['15', '30', '45', '60'],
      total: 0,
    },
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
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
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
        const s = yield select((state: any) => state.role.search);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        const { current, pageSize } = pagination;
        const page = { page: current, per_page: pageSize };
        params = { ...params, ...page };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select((state: any) => state.role.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(roleService.query, params);
      yield put({
        type: 'saveData',
        payload: response.data || {},
      });
    },
    *loadForm({ payload }, { put }) {
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
          payload: '新建角色',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑角色',
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
      }
    },
    *fetchForm({ payload: { id } }, { call, put }) {
      const response = yield call(roleService.get, id);
      yield [
        put({
          type: 'saveFormData',
          payload: response.data || {},
        }),
      ];
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select((state: any) => state.role.formType);

      let response;
      if (formType === 'E') {
        params.id = yield select((state: any) => state.role.formID);
        response = yield call(roleService.update, params);
      } else {
        response = yield call(roleService.create, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      response = response.data || {};
      if (response.id && response.id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }
    },
    *del({ payload: { id } }, { call, put }) {
      const { response } = yield call(roleService.del, id);
      if (response.status === 204) {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
  },

  reducers: {
    saveData(
      state,
      {
        payload: {
          data,
          meta: { current_page: current = 1, per_page: pageSize = 15, total = 0 },
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
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
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
  },
};

export default Role;
