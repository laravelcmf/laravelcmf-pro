export interface Collection {
  data: any;
}

export interface Paginator {
  data: any;
  meta: Meta;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links?: any;
}

// get item.
export function GetItem(result: any) {
  return result;
}

// get collection.
export function GetCollection(result: any | Response): Collection {
  const { data } = result;
  return data;
}

// get paginator.
export function GetPaginator(result: any | Response): Paginator {
  const { data } = result;
  return data;
}
