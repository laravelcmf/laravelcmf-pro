import request from '@/utils/request';

// 分页
export async function query(params: any): Promise<any> {
  const p = { include: 'role', ...params };
  return request('/api/admins', {
    method: 'GET',
    params: p,
  });
}

// 查看
export async function get({ id }: { id: number }): Promise<any> {
  return request(`/api/admins/${id}`);
}

// 新增
export async function create(params: any): Promise<any> {
  return request('/api/admins', {
    method: 'POST',
    data: params,
  });
}

// 更新
export async function update({ id, ...params }: any): Promise<any> {
  return request(`/api/admins/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 启用
export async function enable(id: number): Promise<any> {
  return request(`/api/admins/${id}/enable`, {
    method: 'patch',
  });
}

// 禁用
export async function disable(id: number): Promise<any> {
  return request(`/api/admins/${id}/disable`, {
    method: 'patch',
  });
}

// 删除
export async function del(id: number): Promise<any> {
  return request(`/api/admins/${id}`, {
    method: 'DELETE',
  });
}

// 获取用户信息
export async function queryCurrent(): Promise<any> {
  return request('/api/admins/me');
}

// 查询当前用户菜单树
export async function queryMenuTree(): Promise<any> {
  return request('/api/admins/menus');
}
