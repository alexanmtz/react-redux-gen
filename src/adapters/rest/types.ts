import type { HeadersMap, HttpMethod } from '../../types'

export interface RestRequestConfig {
  method: HttpMethod
  url: string
  headers?: HeadersMap
  data?: unknown
  params?: unknown
}

export type RestMethodMap = Record<string, HttpMethod>
