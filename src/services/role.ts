import request from '@/utils/request';

// 分页
export async function query(params: any) {
  return request('/api/roles', {
    method: 'GET',
    params,
  });
}

// 列表
export async function list(params?: any) {
  return request('/api/roles/list', {
    method: 'GET',
    params,
  });
}

// 查看
export async function get(id: number) {
  return request(`/api/roles/${id}`, {
    method: 'GET',
  });
}

// 新增
export async function create(params: any) {
  return request('/api/roles', {
    method: 'POST',
    data: params,
  });
}

// 更新
export async function update({ id, ...params }: any) {
  return request(`/api/roles/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除
export async function del(id: number) {
  return request(`/api/roles/${id}`, {
    method: 'DELETE',
  });
}
