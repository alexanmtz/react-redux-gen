import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios'
import { genieActionNames, genieActions, genThunks } from '../src/genie-actions'

describe('Genie', () => {
  describe('Action names', () => {
    test('Get default actions from genie', () => {
      expect(genieActionNames('user')).toEqual({
        'create': ['CREATE_USER_REQUESTED', 'CREATE_USER_SUCCESS', 'CREATE_USER_ERROR'],
        'update': ['UPDATE_USER_REQUESTED', 'UPDATE_USER_SUCCESS', 'UPDATE_USER_ERROR'],
        'delete': ['DELETE_USER_REQUESTED', 'DELETE_USER_SUCCESS', 'DELETE_USER_ERROR'],
        'list': ['LIST_USER_REQUESTED', 'LIST_USER_SUCCESS', 'LIST_USER_ERROR'],
        'fetch': ['FETCH_USER_REQUESTED', 'FETCH_USER_SUCCESS', 'FETCH_USER_ERROR'],
      });
    });
    test('Get custom actions from genie', () => {
      expect(genieActionNames('user', ['login'])).toEqual({
        'login': ['LOGIN_USER_REQUESTED', 'LOGIN_USER_SUCCESS', 'LOGIN_USER_ERROR']
      });
    });
    test('Get custom states from genie', () => {
      expect(genieActionNames('user', ['login'], ['started', 'ready', 'error'])).toEqual({
        'login': ['LOGIN_USER_STARTED', 'LOGIN_USER_READY', 'LOGIN_USER_ERROR']
      });
    });
  });
  describe('Action generators', () => {
    test('Get actions from genie', () => {
      expect(genieActions('user').map((r, index) => {
        if(index === 2) {
          return r({})
        } else if(index === 5) {
          return r({})
        } else if(index === 8) {
          return r({})
        } else if(index === 10) {
          return r([])
        } else if(index === 11) {
          return r({})
        } else if(index === 13) {
          return r({})
        } else if(index === 14) {
          return r({})
        } else {
          return r()
        }
      })).toEqual([
        { type: 'CREATE_USER_REQUESTED', completed: false },
        { type: 'CREATE_USER_SUCCESS', completed: true, error: false },
        { type: 'CREATE_USER_ERROR', completed: true, error: {} },
        { type: 'UPDATE_USER_REQUESTED', completed: false },
        { type: 'UPDATE_USER_SUCCESS', completed: true, error: false },
        { type: 'UPDATE_USER_ERROR', completed: true, error: {} },
        { type: 'DELETE_USER_REQUESTED', completed: false },
        { type: 'DELETE_USER_SUCCESS', completed: true, error: false },
        { type: 'DELETE_USER_ERROR', completed: true, error: {} },
        { type: 'LIST_USER_REQUESTED', completed: false },
        { type: 'LIST_USER_SUCCESS', completed: true, error: false, data: [] },
        { type: 'LIST_USER_ERROR', completed: true, error: {} },
        { type: 'FETCH_USER_REQUESTED', completed: false },
        { type: 'FETCH_USER_SUCCESS', completed: true, error: false, data: {} },
        { type: 'FETCH_USER_ERROR', completed: true, error: {} }
        
      ]);
    });
  });
  describe('Thunk action generators for create', () => {
    beforeEach(() => {
      moxios.install()
    })
    afterEach(() => {
      moxios.uninstall()
    })
    test('Get thunks from gen in a success response for user create', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.stubRequest('http://example.com/user/', {
        status: 200,
        data: {
          user: {
            id: 2,
            name: 'Jonh doe'
          }
        }
      })
      const expectedActions = [
        { type: 'CREATE_USER_REQUESTED', completed: false },
        { type: 'CREATE_USER_SUCCESS', completed: true, error: false }
      ]
      const store = mockStore({user: {name: 'Jonh Doe'}})
      return store.dispatch(genThunks('user', 'http://example.com/user/')['create']({name: 'jonh doe'})).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
    test('Get thunks from gen in a error response for user create', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.stubRequest('http://example.com/user/', {
        status: 500
      })
      const expectedActions = [
        { type: 'CREATE_USER_REQUESTED', completed: false },
        { type: 'CREATE_USER_ERROR', completed: true, error: new Error('Request failed with status code 500') }
      ]
      const store = mockStore({user: {name: 'Jonh Doe'}})
      return store.dispatch(genThunks('user', 'http://example.com/user/')['create']({name: 'jonh doe'})).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
  });
})
