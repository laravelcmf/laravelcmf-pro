import request from '@/utils/request';

const router = 'menus';

// 分页
export async function query(params: any) {
  return request(`/api/${router}`, {
    method: 'GET',
    params,
  });
}

// 获取 tree 菜单
export async function queryTree(params: any) {
  return request(`/api/${router}/tree`, {
    method: 'GET',
    params,
  });
}

// 查看菜单
export async function get({ id }: any) {
  return request(`/api/${router}/${id}`);
}

// 新增菜单
export async function create(params: any) {
  return request(`/api/${router}`, {
    method: 'POST',
    body: params,
  });
}

// 更新菜单
export async function update(params: any) {
  return request(`/api/${router}/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

// 删除菜单
export async function del(params: any) {
  return request(`/api/${router}/${params.id}`, {
    method: 'DELETE',
  });
}
