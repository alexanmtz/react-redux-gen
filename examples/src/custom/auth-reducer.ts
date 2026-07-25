import type { AnyAction } from 'redux'
import { loginActionNames } from './auth-actions'

export interface AuthState {
  completed: boolean
  data: Record<string, unknown>
  error: unknown | false
}

const initialState: AuthState = {
  completed: true,
  data: {},
  error: false,
}

/**
 * Hand-written reducer using named action type strings
 * (loginActionNames.logged.requested instead of [0]).
 */
export function authReducer(
  state: AuthState = initialState,
  action: AnyAction
): AuthState {
  switch (action.type) {
    case loginActionNames.logged.requested:
      return { ...state, completed: action.completed }
    case loginActionNames.logged.success:
      return {
        ...state,
        completed: action.completed,
        data: action.data as Record<string, unknown>,
        error: false,
      }
    case loginActionNames.logged.error:
      return { ...state, completed: action.completed, error: action.error }

    case loginActionNames.login.requested:
      return { ...state, completed: action.completed, error: false }
    case loginActionNames.login.success:
      return {
        ...state,
        completed: action.completed,
        data: action.data as Record<string, unknown>,
        error: false,
      }
    case loginActionNames.login.error:
      return { ...state, completed: action.completed, error: action.error }

    case loginActionNames.logout.requested:
      return { ...state, completed: action.completed, error: action.error }
    case loginActionNames.logout.success:
      return {
        ...state,
        completed: action.completed,
        error: action.error,
        data: action.data as Record<string, unknown>,
      }
    case loginActionNames.logout.error:
      return { ...state, completed: action.completed, error: action.error }

    case loginActionNames.register.requested:
      return { ...state, completed: action.completed }
    case loginActionNames.register.success:
      return {
        ...state,
        completed: action.completed,
        data: action.data as Record<string, unknown>,
        error: false,
      }
    case loginActionNames.register.error:
      return { ...state, completed: action.completed, error: action.error }

    default:
      return state
  }
}
