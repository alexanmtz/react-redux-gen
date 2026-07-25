import type { ErrorAction } from '../types'

/**
 * Create an ERROR lifecycle action object.
 */
export function createErrorAction<E = unknown>(
  type: string,
  error?: E
): ErrorAction<E> {
  return {
    type,
    completed: true,
    error: error as E,
  }
}
