import { genActionNames } from '../src/actions/gen-action-names'

describe('genActionNames', () => {
  test('returns default named actions for an entity', () => {
    expect(genActionNames('user')).toEqual({
      create: {
        requested: 'CREATE_USER_REQUESTED',
        success: 'CREATE_USER_SUCCESS',
        error: 'CREATE_USER_ERROR',
      },
      update: {
        requested: 'UPDATE_USER_REQUESTED',
        success: 'UPDATE_USER_SUCCESS',
        error: 'UPDATE_USER_ERROR',
      },
      delete: {
        requested: 'DELETE_USER_REQUESTED',
        success: 'DELETE_USER_SUCCESS',
        error: 'DELETE_USER_ERROR',
      },
      list: {
        requested: 'LIST_USER_REQUESTED',
        success: 'LIST_USER_SUCCESS',
        error: 'LIST_USER_ERROR',
      },
      fetch: {
        requested: 'FETCH_USER_REQUESTED',
        success: 'FETCH_USER_SUCCESS',
        error: 'FETCH_USER_ERROR',
      },
    })
  })

  test('supports custom action types', () => {
    expect(genActionNames('user', ['login'])).toEqual({
      login: {
        requested: 'LOGIN_USER_REQUESTED',
        success: 'LOGIN_USER_SUCCESS',
        error: 'LOGIN_USER_ERROR',
      },
    })
  })

  test('supports custom states', () => {
    expect(genActionNames('user', ['login'], ['started', 'ready', 'error'])).toEqual({
      login: {
        started: 'LOGIN_USER_STARTED',
        ready: 'LOGIN_USER_READY',
        error: 'LOGIN_USER_ERROR',
      },
    })
  })
})
