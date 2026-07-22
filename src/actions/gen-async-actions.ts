import { RestAdapter } from '../adapters/rest/rest-adapter'
import type { AsyncActionsMap, HeadersMap } from '../types'

/**
 * Generate REST async thunks (convenience wrapper, same as createClient({ protocol: 'REST' }).genAsyncActions).
 *
 * @example
 * const userAsync = genAsyncActions('user', 'https://api.example.com/users', headers)
 * dispatch(userAsync.create({ name: 'Ada' }))
 */
export function genAsyncActions(
  entity: string,
  url: string,
  headers?: HeadersMap,
  types?: readonly string[],
  states?: readonly string[]
): AsyncActionsMap {
  const adapter = new RestAdapter({
    protocol: 'REST',
    baseUrl: url,
    headers,
    types,
    states,
  })
  return adapter.genAsyncActions(entity)
}
