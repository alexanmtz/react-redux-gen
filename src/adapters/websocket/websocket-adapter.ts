import { BaseAdapter } from '../base-adapter'
import { createWebSocketThunk } from './create-websocket-thunk'
import type { AsyncActionsMap } from '../../types'
import type { WebSocketAdapterOptions, WebSocketLike } from '../types'

/**
 * WebSocket protocol adapter.
 * Generates async thunks that send JSON messages and await correlated responses.
 */
export class WebSocketAdapter extends BaseAdapter {
  readonly protocol = 'WEBSOCKET' as const
  private readonly url: string
  private readonly createSocketFn?: (url: string) => WebSocketLike
  private readonly messageTypePrefix?: string
  private socket: WebSocketLike | null = null

  constructor(options: WebSocketAdapterOptions) {
    super(options)
    this.url = options.url
    this.createSocketFn = options.createSocket
    this.messageTypePrefix = options.messageTypePrefix
  }

  /** Lazily open (or reuse) the underlying socket */
  getSocket(): WebSocketLike {
    if (this.socket) {
      return this.socket
    }
    if (this.createSocketFn) {
      this.socket = this.createSocketFn(this.url)
      return this.socket
    }
    if (typeof WebSocket !== 'undefined') {
      this.socket = new WebSocket(this.url) as unknown as WebSocketLike
      return this.socket
    }
    throw new Error(
      'WebSocket is not available. Provide createSocket in WebSocketAdapterOptions.'
    )
  }

  /** Allow tests / apps to inject a socket instance */
  setSocket(socket: WebSocketLike): void {
    this.socket = socket
  }

  genAsyncActions(entity: string): AsyncActionsMap {
    const plain = this.genPlainActions(entity)
    const actions: AsyncActionsMap = {}

    Object.keys(plain).forEach((key) => {
      actions[key] = createWebSocketThunk(
        key,
        entity,
        () => this.getSocket(),
        plain[key],
        this.messageTypePrefix
      ) as AsyncActionsMap[string]
    })

    return actions
  }
}
