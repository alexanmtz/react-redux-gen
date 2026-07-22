import type { AnyAction } from 'redux'

/** Default CRUD operation keys */
export type DefaultActionType = 'create' | 'update' | 'delete' | 'list' | 'fetch'

/** Default request lifecycle states */
export type DefaultState = 'REQUESTED' | 'SUCCESS' | 'ERROR'

/** Named keys derived from default states (lowercase) */
export type DefaultNamedState = 'requested' | 'success' | 'error'

/** A Redux action with the library's standard shape */
export interface GenAction<T = unknown, E = unknown> extends AnyAction {
  type: string
  completed: boolean
  data?: T
  error?: E | false
}

export interface RequestedAction extends GenAction {
  completed: false
}

export interface SuccessAction<T = unknown> extends GenAction<T> {
  completed: true
  error: false
  data: T
}

export interface ErrorAction<E = unknown> extends GenAction<never, E> {
  completed: true
  error: E
}

/** Action creator for the REQUESTED lifecycle */
export type RequestedActionCreator = () => RequestedAction

/** Action creator for the SUCCESS lifecycle */
export type SuccessActionCreator<T = unknown> = (data?: T) => SuccessAction<T>

/** Action creator for the ERROR lifecycle */
export type ErrorActionCreator<E = unknown> = (error?: E) => ErrorAction<E>

/**
 * Named state action creators for a single operation type.
 * Prefer `.requested`, `.success`, `.error` over array indices.
 */
export type NamedStateActionCreators<T = unknown, E = unknown> = {
  requested: RequestedActionCreator
  success: SuccessActionCreator<T>
  error: ErrorActionCreator<E>
} & Record<string, (payload?: unknown) => GenAction>

/**
 * Named state action type strings for a single operation type.
 */
export interface NamedStateActionNames {
  requested: string
  success: string
  error: string
  [state: string]: string
}

/** Map of operation type -> named state action names */
export type ActionNamesMap = Record<string, NamedStateActionNames>

/** Map of operation type -> named state action creators */
export type PlainActionsMap = Record<string, NamedStateActionCreators>

/** Async thunk-style action returned by adapters */
export type AsyncThunkAction = (
  ...args: unknown[]
) => (dispatch: (action: AnyAction) => unknown) => Promise<unknown>

/** Map of operation type -> async thunk */
export type AsyncActionsMap = Record<string, AsyncThunkAction>

/** Standard entity reducer state shape */
export interface EntityState<T = unknown, E = unknown> {
  data: T
  error: E | false
  completed: boolean
}

export type EntityReducer<T = unknown, E = unknown> = (
  state: EntityState<T, E> | undefined,
  action: AnyAction
) => EntityState<T, E>

/** Supported communication protocols */
export type Protocol = 'REST' | 'GRAPHQL' | 'WEBSOCKET'

/** HTTP method names used by REST */
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

/** Headers bag */
export type HeadersMap = Record<string, string>
