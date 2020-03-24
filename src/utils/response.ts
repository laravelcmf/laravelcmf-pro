// get item.
export function GetItem(result: any) {
  return result;
}

// get collection.
export function GetCollection(result: any | Response): any {
  const {
    data: { data },
  } = result;
  return data;
}

// get paginator.
export function GetPaginator(result: any | Response): any {
  const { data } = result;
  return data;
}
