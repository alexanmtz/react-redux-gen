import type {
  AsyncActionsMap,
  HeadersMap,
  PlainActionsMap,
  ActionNamesMap,
  EntityReducer,
  EntityState,
  Protocol,
} from '../types'

/** Shared options accepted by every adapter */
export interface BaseAdapterOptions {
  headers?: HeadersMap
  /** Override default CRUD operation types */
  types?: readonly string[]
  /** Override default lifecycle states */
  states?: readonly string[]
}

export interface RestAdapterOptions extends BaseAdapterOptions {
  protocol: 'REST'
  /** Base URL for REST resources, e.g. https://api.example.com/users */
  baseUrl: string
}

export interface GraphQLAdapterOptions extends BaseAdapterOptions {
  protocol: 'GRAPHQL'
  /** GraphQL HTTP endpoint */
  endpoint: string
  /**
   * Optional custom operation documents keyed by action type.
   * Defaults generate list/get/create/update/delete for the entity.
   */
  operations?: Partial<Record<string, string>>
  /** Optional field selection used when building default operations */
  selection?: string
}

export interface WebSocketAdapterOptions extends BaseAdapterOptions {
  protocol: 'WEBSOCKET'
  /** WebSocket URL, e.g. wss://api.example.com/ws */
  url: string
  /**
   * Optional factory that returns (or reuses) a WebSocket-like connection.
   * Useful for tests and custom clients.
   */
  createSocket?: (url: string) => WebSocketLike
  /** Optional message type prefix, defaults to entity name */
  messageTypePrefix?: string
}

export type CreateClientOptions =
  | RestAdapterOptions
  | GraphQLAdapterOptions
  | WebSocketAdapterOptions

/** Minimal WebSocket interface used by the adapter (browser or ws package) */
export interface WebSocketLike {
  readyState: number
  send: (data: string) => void
  addEventListener?: (
    type: string,
    listener: (event: { data: unknown }) => void
  ) => void
  removeEventListener?: (
    type: string,
    listener: (event: { data: unknown }) => void
  ) => void
  onmessage?: ((event: { data: unknown }) => void) | null
  onerror?: ((event: unknown) => void) | null
  onopen?: ((event: unknown) => void) | null
  close?: () => void
}

export const WEBSOCKET_OPEN = 1

/** Contract every protocol adapter must implement */
export interface Adapter {
  readonly protocol: Protocol
  genActionNames(entity: string, types?: readonly string[], states?: readonly string[]): ActionNamesMap
  genPlainActions(entity: string, types?: readonly string[], states?: readonly string[]): PlainActionsMap
  genAsyncActions(entity: string, options?: unknown): AsyncActionsMap
  genReducer<T = unknown, E = unknown>(
    entity: string,
    initialState: EntityState<T, E>
  ): EntityReducer<T, E>
}
