import request from '@/utils/request';

// 获取用户信息
export async function queryCurrent(): Promise<any> {
  return request('/api/admins/me');
}

// 查询当前用户菜单树
export async function queryMenuTree(): Promise<any> {
  return request('/api/admins/menus');
}
