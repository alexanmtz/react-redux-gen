import type { AnyAction } from 'redux'
import type { NamedStateActionCreators } from '../../types'
import type { WebSocketLike } from '../types'
import { WEBSOCKET_OPEN } from '../types'
import { buildMessageType } from './build-message-type'
import { createRequestId } from './create-request-id'
import { parseSocketData } from './parse-socket-data'
import type { WebSocketRequestEnvelope } from './types'

const RESPONSE_TIMEOUT_MS = 30000

/**
 * Create a single WebSocket async thunk for one operation key.
 * Sends a JSON message and waits for a correlated response (by requestId or matching type).
 */
export function createWebSocketThunk(
  key: string,
  entity: string,
  getSocket: () => WebSocketLike,
  plainActions: NamedStateActionCreators,
  messageTypePrefix?: string
) {
  return (data?: unknown, params?: unknown) => {
    return (dispatch: (action: AnyAction) => unknown): Promise<unknown> => {
      dispatch(plainActions.requested())

      const socket = getSocket()
      const requestId = createRequestId(entity, key)
      const messageType = buildMessageType(entity, key, messageTypePrefix)

      const payload =
        key === 'update'
          ? { id: data, input: params }
          : key === 'create'
            ? data
            : key === 'list'
              ? data
              : data

      const envelope: WebSocketRequestEnvelope = {
        type: messageType,
        payload,
        requestId,
      }

      return new Promise((resolve) => {
        let settled = false

        const cleanup = (listener: (event: { data: unknown }) => void) => {
          if (socket.removeEventListener) {
            socket.removeEventListener('message', listener)
          } else if (socket.onmessage === listener) {
            socket.onmessage = null
          }
        }

        const finish = (action: AnyAction) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          cleanup(onMessage)
          resolve(dispatch(action))
        }

        const onMessage = (event: { data: unknown }) => {
          const message = parseSocketData(event.data)
          const matchesRequest =
            message.id === requestId ||
            (message as { requestId?: string }).requestId === requestId
          const matchesType =
            message.type === messageType ||
            message.type === `${messageType}.success` ||
            message.type === `${messageType}.error`

          if (!matchesRequest && !matchesType) {
            return
          }

          const isError =
            message.status === 'error' ||
            message.type.endsWith('.error') ||
            message.error !== undefined

          if (isError) {
            finish(plainActions.error(message.error ?? message.payload ?? message))
          } else {
            finish(plainActions.success(message.payload ?? message))
          }
        }

        const timer = setTimeout(() => {
          finish(
            plainActions.error(
              new Error(`WebSocket response timeout for ${messageType}`)
            )
          )
        }, RESPONSE_TIMEOUT_MS)

        if (socket.addEventListener) {
          socket.addEventListener('message', onMessage)
        } else {
          const previous = socket.onmessage
          socket.onmessage = (event: { data: unknown }) => {
            if (previous) previous(event)
            onMessage(event)
          }
        }

        try {
          if (socket.readyState !== undefined && socket.readyState !== WEBSOCKET_OPEN) {
            // Still attempt send; some mocks are always "open"
          }
          socket.send(JSON.stringify(envelope))
        } catch (error) {
          finish(plainActions.error(error))
        }
      })
    }
  }
}
