import { BaseAdapter } from '../base-adapter'
import { createRestThunk } from './create-rest-thunk'
import type { AsyncActionsMap } from '../../types'
import type { RestAdapterOptions } from '../types'

/**
 * REST protocol adapter.
 * Generates axios-backed async thunks for standard CRUD operations.
 */
export class RestAdapter extends BaseAdapter {
  readonly protocol = 'REST' as const
  private readonly baseUrl: string

  constructor(options: RestAdapterOptions) {
    super(options)
    this.baseUrl = options.baseUrl
  }

  /**
   * @param entity Entity name used in action type strings
   * @param resourceUrl Optional override of the resource base URL
   */
  genAsyncActions(entity: string, resourceUrl?: string): AsyncActionsMap {
    const url = resourceUrl ?? this.baseUrl
    const plain = this.genPlainActions(entity)
    const actions: AsyncActionsMap = {}

    Object.keys(plain).forEach((key) => {
      actions[key] = createRestThunk(key, url, this.headers, plain[key]) as AsyncActionsMap[string]
    })

    return actions
  }
}
