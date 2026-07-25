import axios from 'axios'
import type { AnyAction } from 'redux'
import type { HeadersMap, NamedStateActionCreators } from '../../types'
import { buildGraphQLVariables } from './build-graphql-variables'
import { extractGraphQLData } from './extract-graphql-data'
import type { GraphQLResponse } from './types'

/**
 * Create a single GraphQL async thunk for one operation key.
 */
export function createGraphQLThunk(
  key: string,
  endpoint: string,
  headers: HeadersMap,
  query: string,
  plainActions: NamedStateActionCreators
) {
  return (data?: unknown, params?: unknown) => {
    return (dispatch: (action: AnyAction) => unknown): Promise<unknown> => {
      dispatch(plainActions.requested())
      const variables = buildGraphQLVariables(key, data, params)

      return axios
        .post(
          endpoint,
          { query, variables },
          {
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
          }
        )
        .then((response) => {
          const payload = extractGraphQLData(
            response.data as GraphQLResponse<Record<string, unknown>>
          )
          return dispatch(plainActions.success(payload))
        })
        .catch((error: unknown) => dispatch(plainActions.error(error)))
    }
  }
}
