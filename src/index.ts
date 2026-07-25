// Core generators
export { genActionNames } from './actions/gen-action-names'
export { genPlainActions } from './actions/gen-plain-actions'
export { genAsyncActions } from './actions/gen-async-actions'
export { genReducer } from './reducers/gen-reducer'

// Client / adapters
export { createClient } from './adapters/create-client'
export { BaseAdapter } from './adapters/base-adapter'
export { RestAdapter } from './adapters/rest/rest-adapter'
export { GraphQLAdapter } from './adapters/graphql/graphql-adapter'
export { WebSocketAdapter } from './adapters/websocket/websocket-adapter'

// Constants
export { DEFAULT_ACTION_TYPES } from './constants/default-types'
export { DEFAULT_STATES } from './constants/default-states'

// Shared helpers (for custom adapters / extensions)
export { formatActionType } from './shared/format-action-type'
export { toNamedStateKey } from './shared/to-named-state-key'
export { buildNamedStateMap } from './shared/build-named-state-map'
export { createRequestedAction } from './shared/create-requested-action'
export { createSuccessAction } from './shared/create-success-action'
export { createErrorAction } from './shared/create-error-action'
export { createStateActionCreator } from './shared/create-state-action-creator'

// REST helpers
export { buildRequestConfig } from './adapters/rest/build-request-config'
export { REST_METHOD_MAP } from './adapters/rest/rest-method-map'

// GraphQL helpers
export { buildDefaultOperations } from './adapters/graphql/default-operations'
export { buildGraphQLVariables } from './adapters/graphql/build-graphql-variables'
export { extractGraphQLData } from './adapters/graphql/extract-graphql-data'

// WebSocket helpers
export { buildMessageType } from './adapters/websocket/build-message-type'
export { createRequestId } from './adapters/websocket/create-request-id'
export { parseSocketData } from './adapters/websocket/parse-socket-data'

// Types
export type {
  DefaultActionType,
  DefaultState,
  DefaultNamedState,
  GenAction,
  RequestedAction,
  SuccessAction,
  ErrorAction,
  RequestedActionCreator,
  SuccessActionCreator,
  ErrorActionCreator,
  NamedStateActionCreators,
  NamedStateActionNames,
  ActionNamesMap,
  PlainActionsMap,
  AsyncThunkAction,
  AsyncActionsMap,
  EntityState,
  EntityReducer,
  Protocol,
  HttpMethod,
  HeadersMap,
} from './types'

export type {
  Adapter,
  BaseAdapterOptions,
  RestAdapterOptions,
  GraphQLAdapterOptions,
  WebSocketAdapterOptions,
  CreateClientOptions,
  WebSocketLike,
} from './adapters/types'

export type {
  RestRequestConfig,
  RestMethodMap,
} from './adapters/rest/types'

export type {
  GraphQLOperationMap,
  GraphQLRequestBody,
  GraphQLResponse,
} from './adapters/graphql/types'

export type {
  WebSocketMessage,
  WebSocketRequestEnvelope,
} from './adapters/websocket/types'
