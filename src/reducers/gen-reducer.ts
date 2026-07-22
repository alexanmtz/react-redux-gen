import { genActionNames } from '../actions/gen-action-names'
import type { AnyAction } from 'redux'
import type { EntityReducer, EntityState } from '../types'

/**
 * Generate a standard CRUD reducer for an entity.
 * Handles create/update/delete/list/fetch × requested/success/error.
 */
export function genReducer<T = unknown, E = unknown>(
  entity: string,
  initialState: EntityState<T, E>
): EntityReducer<T, E> {
  const actions = genActionNames(entity)

  return (
    state: EntityState<T, E> | undefined = initialState,
    action: AnyAction
  ): EntityState<T, E> => {
    const operationKeys = Object.keys(actions)

    for (const op of operationKeys) {
      const names = actions[op]
      if (action.type === names.requested) {
        return { ...state, error: false as E | false, completed: action.completed }
      }
      if (action.type === names.success) {
        return {
          ...state,
          error: false as E | false,
          completed: action.completed,
          data: action.data as T,
        }
      }
      if (action.type === names.error) {
        return {
          ...state,
          error: action.error as E,
          completed: action.completed,
        }
      }
    }

    return state
  }
}
