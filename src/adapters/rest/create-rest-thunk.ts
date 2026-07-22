import axios from 'axios'
import type { AnyAction } from 'redux'
import type { NamedStateActionCreators } from '../../types'
import { buildRequestConfig } from './build-request-config'
import type { HeadersMap } from '../../types'

/**
 * Create a single REST async thunk for one operation key.
 */
export function createRestThunk(
  key: string,
  baseUrl: string,
  headers: HeadersMap,
  plainActions: NamedStateActionCreators
) {
  return (data?: unknown, params?: unknown) => {
    return (dispatch: (action: AnyAction) => unknown): Promise<unknown> => {
      dispatch(plainActions.requested())
      const config = buildRequestConfig(key, baseUrl, headers, data, params)

      return axios(config)
        .then((response) => dispatch(plainActions.success(response.data)))
        .catch((error: unknown) => dispatch(plainActions.error(error)))
    }
  }
}
