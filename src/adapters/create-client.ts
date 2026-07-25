import { RestAdapter } from './rest/rest-adapter'
import { GraphQLAdapter } from './graphql/graphql-adapter'
import { WebSocketAdapter } from './websocket/websocket-adapter'
import type { Adapter, CreateClientOptions } from './types'

/**
 * Initialize a protocol-specific client/adapter.
 *
 * Projects typically pick one protocol for the app:
 *
 * @example
 * const client = createClient({ protocol: 'REST', baseUrl: 'https://api.example.com/users' })
 * const asyncActions = client.genAsyncActions('user')
 *
 * @example
 * const gql = createClient({ protocol: 'GRAPHQL', endpoint: 'https://api.example.com/graphql' })
 *
 * @example
 * const ws = createClient({ protocol: 'WEBSOCKET', url: 'wss://api.example.com/ws' })
 */
export function createClient(options: CreateClientOptions): Adapter {
  switch (options.protocol) {
    case 'REST':
      return new RestAdapter(options)
    case 'GRAPHQL':
      return new GraphQLAdapter(options)
    case 'WEBSOCKET':
      return new WebSocketAdapter(options)
    default: {
      const exhaustive: never = options
      throw new Error(`Unsupported protocol: ${(exhaustive as { protocol: string }).protocol}`)
    }
  }
}
