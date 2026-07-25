import { REST_METHOD_MAP } from './rest-method-map'
import type { HeadersMap } from '../../types'
import type { RestRequestConfig } from './types'

/**
 * Build an axios-compatible request config for a CRUD operation.
 *
 * Conventions:
 * - create(body)           → POST   baseUrl
 * - list(query?)           → GET    baseUrl?query
 * - fetch(id)              → GET    baseUrl/id
 * - update(id, body)       → PUT    baseUrl/id  body
 * - delete(id)             → DELETE baseUrl/id
 */
export function buildRequestConfig(
  key: string,
  baseUrl: string,
  headers: HeadersMap,
  data?: unknown,
  params?: unknown
): RestRequestConfig {
  const method = REST_METHOD_MAP[key] ?? 'get'
  const needsIdInPath = key === 'fetch' || key === 'update' || key === 'delete'
  const url = needsIdInPath ? `${baseUrl.replace(/\/$/, '')}/${data}` : baseUrl

  if (key === 'create') {
    return { method, url, headers, data }
  }

  if (key === 'update') {
    return { method, url, headers, data: params, params: undefined }
  }

  if (key === 'list') {
    return { method, url, headers, params: data }
  }

  // fetch / delete — id is in the path; no body
  return { method, url, headers }
}
