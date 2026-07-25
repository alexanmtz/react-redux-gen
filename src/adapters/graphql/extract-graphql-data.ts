import type { GraphQLResponse } from './types'

/**
 * Pull the first field from a GraphQL data payload, or throw if errors exist.
 */
export function extractGraphQLData<T = unknown>(
  body: GraphQLResponse<Record<string, T>>
): T {
  if (body.errors && body.errors.length > 0) {
    throw new Error(body.errors.map((e) => e.message).join(', '))
  }
  const data = body.data
  if (data === undefined || data === null) {
    return undefined as T
  }
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return data as unknown as T
  }
  return data[keys[0]]
}
