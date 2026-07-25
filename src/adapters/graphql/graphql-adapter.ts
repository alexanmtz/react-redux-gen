import { BaseAdapter } from '../base-adapter'
import { buildDefaultOperations } from './default-operations'
import { createGraphQLThunk } from './create-graphql-thunk'
import type { AsyncActionsMap } from '../../types'
import type { GraphQLAdapterOptions } from '../types'
import type { GraphQLOperationMap } from './types'

export interface GraphQLGenOptions {
  operations?: GraphQLOperationMap
  selection?: string
}

/**
 * GraphQL protocol adapter.
 * Generates async thunks for list (query), fetch (query), create/update/delete (mutations).
 */
export class GraphQLAdapter extends BaseAdapter {
  readonly protocol = 'GRAPHQL' as const
  private readonly endpoint: string
  private readonly operations?: Partial<Record<string, string>>
  private readonly selection?: string

  constructor(options: GraphQLAdapterOptions) {
    super(options)
    this.endpoint = options.endpoint
    this.operations = options.operations
    this.selection = options.selection
  }

  genAsyncActions(entity: string, options: GraphQLGenOptions = {}): AsyncActionsMap {
    const defaults = buildDefaultOperations(
      entity,
      options.selection ?? this.selection
    )
    const operations: GraphQLOperationMap = {
      ...defaults,
      ...this.operations,
      ...options.operations,
    }

    const plain = this.genPlainActions(entity)
    const actions: AsyncActionsMap = {}

    Object.keys(plain).forEach((key) => {
      const document = operations[key]
      if (!document) {
        return
      }
      actions[key] = createGraphQLThunk(
        key,
        this.endpoint,
        this.headers,
        document,
        plain[key]
      ) as AsyncActionsMap[string]
    })

    return actions
  }
}
