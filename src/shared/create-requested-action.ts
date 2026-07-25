import type { RequestedAction } from '../types'

/**
 * Create a REQUESTED lifecycle action object.
 */
export function createRequestedAction(type: string): RequestedAction {
  return {
    type,
    completed: false,
  }
}
