import genieActions from '../src/genie-actions'

describe('basic actions', () => {
  test('Get default actions from genie', () => {
    expect(genieActions('user')).toEqual({
      'create': ['CREATE_USER_REQUESTED', 'CREATE_USER_SUCCESS', 'CREATE_USER_ERROR'],
      'update': ['UPDATE_USER_REQUESTED', 'UPDATE_USER_SUCCESS', 'UPDATE_USER_ERROR'],
      'delete': ['DELETE_USER_REQUESTED', 'DELETE_USER_SUCCESS', 'DELETE_USER_ERROR'],
      'list': ['LIST_USER_REQUESTED', 'LIST_USER_SUCCESS', 'LIST_USER_ERROR'],
      'fetch': ['FETCH_USER_REQUESTED', 'FETCH_USER_SUCCESS', 'FETCH_USER_ERROR'],
    });
  });
  test('Get custom actions from genie', () => {
    expect(genieActions('user', ['login'])).toEqual({
      'login': ['LOGIN_USER_REQUESTED', 'LOGIN_USER_SUCCESS', 'LOGIN_USER_ERROR']
    });
  });
  test('Get custom states from genie', () => {
    expect(genieActions('user', ['login'], ['started', 'ready', 'error'])).toEqual({
      'login': ['LOGIN_USER_STARTED', 'LOGIN_USER_READY', 'LOGIN_USER_ERROR']
    });
  });
})
