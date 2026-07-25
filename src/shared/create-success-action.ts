import type { SuccessAction } from '../types'

/**
 * Create a SUCCESS lifecycle action object.
 */
export function createSuccessAction<T = unknown>(
  type: string,
  data?: T
): SuccessAction<T> {
  return {
    type,
    completed: true,
    error: false,
    data: data as T,
  }
}
