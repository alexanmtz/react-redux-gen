import { createClient } from '../src/adapters/create-client'
import { RestAdapter } from '../src/adapters/rest/rest-adapter'
import { GraphQLAdapter } from '../src/adapters/graphql/graphql-adapter'
import { WebSocketAdapter } from '../src/adapters/websocket/websocket-adapter'

describe('createClient', () => {
  test('returns RestAdapter', () => {
    const c = createClient({ protocol: 'REST', baseUrl: '/api' })
    expect(c).toBeInstanceOf(RestAdapter)
    expect(c.protocol).toBe('REST')
  })

  test('returns GraphQLAdapter', () => {
    const c = createClient({ protocol: 'GRAPHQL', endpoint: '/gql' })
    expect(c).toBeInstanceOf(GraphQLAdapter)
    expect(c.protocol).toBe('GRAPHQL')
  })

  test('returns WebSocketAdapter', () => {
    const c = createClient({ protocol: 'WEBSOCKET', url: 'wss://x' })
    expect(c).toBeInstanceOf(WebSocketAdapter)
    expect(c.protocol).toBe('WEBSOCKET')
  })

  test('throws on unsupported protocol', () => {
    expect(() =>
      createClient({ protocol: 'FTP' as 'REST', baseUrl: '/' })
    ).toThrow(/Unsupported protocol/)
  })
})
