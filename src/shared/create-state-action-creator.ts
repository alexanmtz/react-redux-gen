import { createRequestedAction } from './create-requested-action'
import { createSuccessAction } from './create-success-action'
import { createErrorAction } from './create-error-action'
import type { GenAction } from '../types'

/**
 * Build a single action creator for a named state key and action type string.
 * Index 0 / "requested" → no payload; index 1 / "success" → data; index 2 / "error" → error.
 * Custom states use a generic payload-aware creator after the first three.
 */
export function createStateActionCreator(
  actionTypeString: string,
  stateIndex: number,
  namedKey: string
): (payload?: unknown) => GenAction {
  if (stateIndex === 0 || namedKey === 'requested') {
    return () => createRequestedAction(actionTypeString)
  }
  if (stateIndex === 1 || namedKey === 'success') {
    return (data?: unknown) => createSuccessAction(actionTypeString, data)
  }
  if (stateIndex === 2 || namedKey === 'error') {
    return (error?: unknown) => createErrorAction(actionTypeString, error)
  }
  return (payload?: unknown) => ({
    type: actionTypeString,
    completed: true,
    data: payload,
  })
}
