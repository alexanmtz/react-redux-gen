import { createClient, type WebSocketLike } from 'react-redux-gen'

/**
 * Create a demo WebSocket-like connection with an in-process echo server.
 * Real apps would pass `url` only and use the browser/Node WebSocket.
 */
export function createEchoSocket(_url: string): WebSocketLike {
  const listeners: Array<(event: { data: unknown }) => void> = []

  return {
    readyState: 1,
    send(raw: string) {
      const message = JSON.parse(raw) as {
        type: string
        payload?: unknown
        requestId: string
      }
      // Simulate async server response
      setTimeout(() => {
        const reply = {
          type: `${message.type}.success`,
          requestId: message.requestId,
          status: 'ok',
          payload: {
            echo: true,
            operation: message.type,
            data: message.payload,
          },
        }
        listeners.forEach((l) => l({ data: JSON.stringify(reply) }))
      }, 10)
    },
    addEventListener(_type: string, listener: (event: { data: unknown }) => void) {
      listeners.push(listener)
    },
    removeEventListener(_type: string, listener: (event: { data: unknown }) => void) {
      const i = listeners.indexOf(listener)
      if (i >= 0) listeners.splice(i, 1)
    },
  }
}

const wsClient = createClient({
  protocol: 'WEBSOCKET',
  url: 'wss://api.example.com/ws',
  createSocket: createEchoSocket,
  messageTypePrefix: 'app',
})

export const messageActionNames = wsClient.genActionNames('message')
export const messageAsyncActions = wsClient.genAsyncActions('message')
export const messageReducer = wsClient.genReducer('message', {
  data: null as unknown,
  error: false as false | unknown,
  completed: true,
})
