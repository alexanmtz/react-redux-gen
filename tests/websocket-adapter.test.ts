import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import { createClient } from '../src/adapters/create-client'
import { WebSocketAdapter } from '../src/adapters/websocket/websocket-adapter'
import { buildMessageType } from '../src/adapters/websocket/build-message-type'
import {
  createRequestId,
  resetRequestIdCounter,
} from '../src/adapters/websocket/create-request-id'
import { parseSocketData } from '../src/adapters/websocket/parse-socket-data'
import type { WebSocketLike } from '../src/adapters/types'

const mockStore = configureMockStore([thunk] as never)

function createMockSocket(): WebSocketLike & {
  listeners: Array<(e: { data: unknown }) => void>
  sent: string[]
  trigger: (data: unknown) => void
} {
  const listeners: Array<(e: { data: unknown }) => void> = []
  const sent: string[] = []
  return {
    readyState: 1,
    sent,
    listeners,
    send(data: string) {
      sent.push(data)
    },
    addEventListener(_type: string, listener: (e: { data: unknown }) => void) {
      listeners.push(listener)
    },
    removeEventListener(_type: string, listener: (e: { data: unknown }) => void) {
      const i = listeners.indexOf(listener)
      if (i >= 0) listeners.splice(i, 1)
    },
    trigger(data: unknown) {
      listeners.forEach((l) => l({ data }))
    },
  }
}

describe('websocket helpers', () => {
  test('buildMessageType', () => {
    expect(buildMessageType('user', 'create')).toBe('user.create')
    expect(buildMessageType('user', 'create', 'app')).toBe('app.user.create')
  })

  test('createRequestId uniqueness', () => {
    resetRequestIdCounter()
    const a = createRequestId('user', 'list')
    const b = createRequestId('user', 'list')
    expect(a).not.toBe(b)
    expect(a).toContain('user:list:')
  })

  test('parseSocketData', () => {
    expect(parseSocketData('{"type":"a","payload":1}')).toEqual({
      type: 'a',
      payload: 1,
    })
    expect(parseSocketData('not-json')).toEqual({
      type: 'unknown',
      payload: 'not-json',
    })
    expect(parseSocketData({ type: 'x' })).toEqual({ type: 'x' })
    expect(parseSocketData(42)).toEqual({ type: 'unknown', payload: 42 })
  })
})

describe('WebSocketAdapter', () => {
  beforeEach(() => {
    resetRequestIdCounter()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('create success via matching requestId', async () => {
    const socket = createMockSocket()
    const adapter = new WebSocketAdapter({
      protocol: 'WEBSOCKET',
      url: 'wss://example/ws',
      createSocket: () => socket,
    })
    const store = mockStore({})
    const promise = store.dispatch(
      adapter.genAsyncActions('user').create({ name: 'Ada' }) as never
    ) as Promise<unknown>

    expect(socket.sent).toHaveLength(1)
    const sent = JSON.parse(socket.sent[0])
    expect(sent.type).toBe('user.create')
    expect(sent.payload).toEqual({ name: 'Ada' })

    socket.trigger({
      type: 'user.create',
      requestId: sent.requestId,
      payload: { id: 1, name: 'Ada' },
    })

    await promise
    expect(store.getActions()[1]).toMatchObject({
      type: 'CREATE_USER_SUCCESS',
      data: { id: 1, name: 'Ada' },
    })
  })

  test('error response and update payload shape', async () => {
    const socket = createMockSocket()
    const client = createClient({
      protocol: 'WEBSOCKET',
      url: 'wss://x',
      createSocket: () => socket,
      messageTypePrefix: 'api',
    })
    const store = mockStore({})
    const p = store.dispatch(
      client.genAsyncActions('user').update(1, { name: 'B' }) as never
    ) as Promise<unknown>

    const sent = JSON.parse(socket.sent[0])
    expect(sent.type).toBe('api.user.update')
    expect(sent.payload).toEqual({ id: 1, input: { name: 'B' } })

    socket.trigger({
      type: 'api.user.update.error',
      id: sent.requestId,
      error: { message: 'nope' },
    })
    await p
    expect(store.getActions()[1].type).toBe('UPDATE_USER_ERROR')
  })

  test('list/fetch/delete and ignore unrelated messages', async () => {
    const socket = createMockSocket()
    const adapter = new WebSocketAdapter({
      protocol: 'WEBSOCKET',
      url: 'wss://x',
      createSocket: () => socket,
    })

    const store = mockStore({})
    const p = store.dispatch(
      adapter.genAsyncActions('user').list({ page: 1 }) as never
    ) as Promise<unknown>

    socket.trigger({ type: 'other.event', payload: {} })
    const sent = JSON.parse(socket.sent[0])
    socket.trigger({
      type: 'user.list.success',
      requestId: sent.requestId,
      payload: [{ id: 1 }],
      status: 'ok',
    })
    await p
    expect(store.getActions()[1].data).toEqual([{ id: 1 }])

    const store2 = mockStore({})
    const p2 = store2.dispatch(
      adapter.genAsyncActions('user').fetch(5) as never
    ) as Promise<unknown>
    const sent2 = JSON.parse(socket.sent[1])
    socket.trigger({
      type: 'user.fetch',
      requestId: sent2.requestId,
      payload: { id: 5 },
    })
    await p2
    expect(store2.getActions()[1].data).toEqual({ id: 5 })

    const store3 = mockStore({})
    const p3 = store3.dispatch(
      adapter.genAsyncActions('user').delete(5) as never
    ) as Promise<unknown>
    const sent3 = JSON.parse(socket.sent[2])
    socket.trigger({
      type: 'user.delete',
      requestId: sent3.requestId,
      status: 'error',
      payload: 'fail',
    })
    await p3
    expect(store3.getActions()[1].type).toBe('DELETE_USER_ERROR')
  })

  test('timeout and send failure', async () => {
    const socket = createMockSocket()
    const adapter = new WebSocketAdapter({
      protocol: 'WEBSOCKET',
      url: 'wss://x',
      createSocket: () => socket,
    })

    const store = mockStore({})
    const p = store.dispatch(
      adapter.genAsyncActions('user').list() as never
    ) as Promise<unknown>
    jest.advanceTimersByTime(30001)
    await p
    expect(store.getActions()[1].type).toBe('LIST_USER_ERROR')
    expect(String(store.getActions()[1].error)).toContain('timeout')

    const badSocket: WebSocketLike = {
      readyState: 1,
      send() {
        throw new Error('closed')
      },
      addEventListener() {},
      removeEventListener() {},
    }
    adapter.setSocket(badSocket)
    const store2 = mockStore({})
    await store2.dispatch(adapter.genAsyncActions('user').list() as never)
    expect(store2.getActions()[1].error).toEqual(new Error('closed'))
  })

  test('onmessage fallback without addEventListener', async () => {
    let handler: ((e: { data: unknown }) => void) | null = null
    const socket: WebSocketLike & { sent: string[] } = {
      readyState: 1,
      sent: [],
      send(data: string) {
        this.sent.push(data)
      },
      set onmessage(fn: ((e: { data: unknown }) => void) | null) {
        handler = fn
      },
      get onmessage() {
        return handler
      },
    }
    const adapter = new WebSocketAdapter({
      protocol: 'WEBSOCKET',
      url: 'wss://x',
      createSocket: () => socket,
    })
    const store = mockStore({})
    const p = store.dispatch(
      adapter.genAsyncActions('user').create({ a: 1 }) as never
    ) as Promise<unknown>
    const sent = JSON.parse(socket.sent[0])
    handler?.({
      data: JSON.stringify({
        type: 'user.create',
        requestId: sent.requestId,
        payload: { ok: true },
      }),
    })
    await p
    expect(store.getActions()[1].data).toEqual({ ok: true })
  })

  test('throws when WebSocket unavailable and no factory', () => {
    const adapter = new WebSocketAdapter({
      protocol: 'WEBSOCKET',
      url: 'wss://x',
    })
    // Ensure no global WebSocket in node
    const original = (global as { WebSocket?: unknown }).WebSocket
    // @ts-expect-error force undefined
    delete (global as { WebSocket?: unknown }).WebSocket
    expect(() => adapter.getSocket()).toThrow('WebSocket is not available')
    if (original) {
      ;(global as { WebSocket?: unknown }).WebSocket = original
    }
  })

  test('reuses socket instance', () => {
    const socket = createMockSocket()
    const adapter = new WebSocketAdapter({
      protocol: 'WEBSOCKET',
      url: 'wss://x',
      createSocket: () => socket,
    })
    expect(adapter.getSocket()).toBe(socket)
    expect(adapter.getSocket()).toBe(socket)
  })
})
