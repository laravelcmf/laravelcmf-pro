import { AnyAction } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { StateType } from './login';
import { AdminModelState } from '@/models/admin';
import { MenuModelState } from '@/models/menu';
import { RoleModeState } from '@/models/role';

export { GlobalModelState, SettingModelState, AdminModelState, MenuModelState, RoleModeState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    admin?: boolean;
    login?: boolean;
    role?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  login: StateType;
  admin: AdminModelState;
  menu: MenuModelState;
  role: RoleModeState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
