import type { WebSocketMessage } from './types'

/**
 * Parse an incoming WebSocket data payload into a message object.
 */
export function parseSocketData(raw: unknown): WebSocketMessage {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as WebSocketMessage
    } catch {
      return { type: 'unknown', payload: raw }
    }
  }
  if (raw && typeof raw === 'object') {
    return raw as WebSocketMessage
  }
  return { type: 'unknown', payload: raw }
}
