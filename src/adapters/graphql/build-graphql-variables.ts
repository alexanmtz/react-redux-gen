/**
 * Map CRUD call arguments to GraphQL variables for each operation.
 *
 * - list(filters?)       → filters as variables (or {})
 * - fetch(id)            → { id }
 * - create(input)        → { input }
 * - update(id, input)    → { id, input }
 * - delete(id)           → { id }
 */
export function buildGraphQLVariables(
  key: string,
  data?: unknown,
  params?: unknown
): Record<string, unknown> {
  switch (key) {
    case 'list':
      return (data as Record<string, unknown>) ?? {}
    case 'fetch':
    case 'delete':
      return { id: data }
    case 'create':
      return { input: data }
    case 'update':
      return { id: data, input: params }
    default:
      return {
        ...(typeof data === 'object' && data !== null
          ? (data as Record<string, unknown>)
          : { data }),
        ...(typeof params === 'object' && params !== null
          ? (params as Record<string, unknown>)
          : {}),
      }
  }
}
