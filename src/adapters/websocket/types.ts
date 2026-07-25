export interface WebSocketMessage {
  type: string
  payload?: unknown
  id?: string | number
  error?: unknown
  status?: 'ok' | 'error' | 'success' | string
}

export interface WebSocketRequestEnvelope {
  type: string
  payload?: unknown
  requestId: string
}
