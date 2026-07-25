import type { RestMethodMap } from './types'

/** Default HTTP method for each CRUD operation type */
export const REST_METHOD_MAP: RestMethodMap = {
  create: 'post',
  update: 'put',
  delete: 'delete',
  list: 'get',
  fetch: 'get',
}
