import { genActionNames } from '../actions/gen-action-names'
import { genPlainActions } from '../actions/gen-plain-actions'
import { genReducer } from '../reducers/gen-reducer'
import type {
  ActionNamesMap,
  AsyncActionsMap,
  EntityReducer,
  EntityState,
  PlainActionsMap,
  Protocol,
} from '../types'
import type { Adapter, BaseAdapterOptions } from './types'

/**
 * Abstract base for protocol adapters (REST, GraphQL, WebSocket, …).
 * Provides shared action/reducer generators; subclasses implement async I/O.
 */
export abstract class BaseAdapter implements Adapter {
  abstract readonly protocol: Protocol

  protected readonly headers: Record<string, string>
  protected readonly types?: readonly string[]
  protected readonly states?: readonly string[]

  constructor(options: BaseAdapterOptions = {}) {
    this.headers = options.headers ?? {}
    this.types = options.types
    this.states = options.states
  }

  genActionNames(
    entity: string,
    types?: readonly string[],
    states?: readonly string[]
  ): ActionNamesMap {
    return genActionNames(
      entity,
      types ?? this.types,
      states ?? this.states
    )
  }

  genPlainActions(
    entity: string,
    types?: readonly string[],
    states?: readonly string[]
  ): PlainActionsMap {
    return genPlainActions(
      entity,
      types ?? this.types,
      states ?? this.states
    )
  }

  genReducer<T = unknown, E = unknown>(
    entity: string,
    initialState: EntityState<T, E>
  ): EntityReducer<T, E> {
    return genReducer<T, E>(entity, initialState)
  }

  /**
   * Generate protocol-specific async thunk actions for an entity.
   * Subclasses must implement this.
   */
  abstract genAsyncActions(entity: string, options?: unknown): AsyncActionsMap
}
