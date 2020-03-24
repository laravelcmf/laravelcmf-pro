import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import * as adminService from '@/services/admin';
import { Pagination } from '@/models/global';
import { GetItem, GetPaginator } from '@/utils/response';

export interface AdminModelState {
  search?: any;
  data?: {
    list: any;
    pagination?: Pagination;
  };
  submitting?: boolean;
  formType?: any;
  formTitle?: string;
  formID?: string;
  formVisible?: boolean;
  formData?: any;
}

export interface AdminModelType {
  namespace: string;
  state: AdminModelState;
  effects: {
    fetch: Effect;
    loadForm: Effect;
    fetchForm: Effect;
    submit: Effect;
    del: Effect;
    changeStatus: Effect;
  };
  reducers: {
    saveData: Reducer<AdminModelState>;
    saveSearch: Reducer<AdminModelState>;
    changeFormVisible: Reducer<AdminModelState>;
    saveFormTitle: Reducer<AdminModelState>;
    saveFormType: Reducer<AdminModelState>;
    saveFormID: Reducer<AdminModelState>;
    saveFormData: Reducer<AdminModelState>;
    changeSubmitting: Reducer<AdminModelState>;
  };
}

const UserModel: AdminModelType = {
  namespace: 'admin',
  state: {
    search: {},
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
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select((state: any) => state.admin.search);
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
        const p = yield select((state: any) => state.admin.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(adminService.query, params);
      yield put({
        type: 'saveData',
        payload: GetPaginator(response) || {},
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
          payload: '新建用户',
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
            payload: '编辑用户',
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
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(adminService.get, payload);
      yield put({
        type: 'saveFormData',
        payload: GetItem(response) || {},
      });
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select((state: any) => state.admin.formType);
      let response;
      if (formType === 'E') {
        params.id = yield select((state: any) => state.admin.formID);
        response = yield call(adminService.update, params);
      } else {
        response = yield call(adminService.create, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.data.id !== '') {
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
    *del({ payload }, { call, put }) {
      const { response } = yield call(adminService.del, payload.id);
      if (response.status === 204) {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    *changeStatus({ payload }, { call, select }) {
      let response;
      if (payload.status === 1) {
        response = yield call(adminService.enable, payload.id);
      } else {
        response = yield call(adminService.disable, payload.id);
      }

      if (response.response.status === 204) {
        let msg = '';
        if (payload.status === 1) {
          msg = '启用成功';
        } else if (payload.status === 2) {
          msg = '停用成功';
        }
        message.success(msg);
        const data = yield select((state: any) => state.admin.data);
        const newData = { list: new Array(0), pagination: data.pagination };
        for (let i = 0; i < data.list.length; i += 1) {
          const item = data.list[i];
          if (item.id === payload.id) {
            item.status = payload.status;
          }
          newData.list.push(item);
        }
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      const {
        data,
        meta: { pagination },
      } = payload;
      return {
        ...state,
        data: {
          list: data,
          pagination: {
            current: parseInt(pagination.current_page, 10),
            pageSize: parseInt(pagination.per_page, 10),
            total: parseInt(pagination.total, 10),
          },
        },
      };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
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

export default UserModel;
