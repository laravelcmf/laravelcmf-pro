import request from '@/utils/request';
import { stringify } from 'qs';

const router = 'menus';

export async function query(params: any) {
  return request(`/api/${router}?${stringify(params)}`);
}

export async function queryTree(params: any) {
  return request(`/api/${router}/tree?${stringify(params)}`);
}

export async function get(params: any) {
  return request(`/api/${router}/${params.id}`);
}

export async function create(params: any) {
  return request(`/api/${router}`, {
    method: 'POST',
    body: params,
  });
}

export async function update(params: any) {
  return request(`/api/${router}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function del(params: any) {
  return request(`/api/${router}/${params.record_id}`, {
    method: 'DELETE',
  });
}
