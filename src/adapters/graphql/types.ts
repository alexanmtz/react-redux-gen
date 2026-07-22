export interface GraphQLOperationMap {
  list?: string
  fetch?: string
  create?: string
  update?: string
  delete?: string
  [key: string]: string | undefined
}

export interface GraphQLRequestBody {
  query: string
  variables?: Record<string, unknown>
}

export interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: Array<{ message: string }>
}
