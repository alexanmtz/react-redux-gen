import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios'
import { genActionNames, genPlainActions, genAsyncActions } from '../src/gen-actions'

describe('Gen', () => {
  describe('Action names', () => {
    test('Get default actions from gen', () => {
      expect(genActionNames('user')).toEqual({
        'create': ['CREATE_USER_REQUESTED', 'CREATE_USER_SUCCESS', 'CREATE_USER_ERROR'],
        'update': ['UPDATE_USER_REQUESTED', 'UPDATE_USER_SUCCESS', 'UPDATE_USER_ERROR'],
        'delete': ['DELETE_USER_REQUESTED', 'DELETE_USER_SUCCESS', 'DELETE_USER_ERROR'],
        'list': ['LIST_USER_REQUESTED', 'LIST_USER_SUCCESS', 'LIST_USER_ERROR'],
        'fetch': ['FETCH_USER_REQUESTED', 'FETCH_USER_SUCCESS', 'FETCH_USER_ERROR'],
      });
    });
    test('Get custom actions from gen', () => {
      expect(genActionNames('user', ['login'])).toEqual({
        'login': ['LOGIN_USER_REQUESTED', 'LOGIN_USER_SUCCESS', 'LOGIN_USER_ERROR']
      });
    });
    test('Get custom states from gen', () => {
      expect(genActionNames('user', ['login'], ['started', 'ready', 'error'])).toEqual({
        'login': ['LOGIN_USER_STARTED', 'LOGIN_USER_READY', 'LOGIN_USER_ERROR']
      });
    });
  });
  describe('Action generators', () => {
    test('Get actions from gen user create', () => {
      expect(genPlainActions('user')['create'][0]()).toEqual({ type: 'CREATE_USER_REQUESTED', completed: false });
      expect(genPlainActions('user')['create'][1]({})).toEqual({ type: 'CREATE_USER_SUCCESS', error: false, completed: true, data: {} });
      expect(genPlainActions('user')['create'][2]({})).toEqual({ type: 'CREATE_USER_ERROR', error: {}, completed: true });
    });
    test('Get actions from gen user update', () => {
      expect(genPlainActions('user')['update'][0]()).toEqual({ type: 'UPDATE_USER_REQUESTED', completed: false });
      expect(genPlainActions('user')['update'][1]({})).toEqual({ type: 'UPDATE_USER_SUCCESS', error: false, completed: true, data: {} });
      expect(genPlainActions('user')['update'][2]({})).toEqual({ type: 'UPDATE_USER_ERROR', error: {}, completed: true });
    });
    test('Get actions from gen user delete', () => {
      expect(genPlainActions('user')['delete'][0]()).toEqual({ type: 'DELETE_USER_REQUESTED', completed: false });
      expect(genPlainActions('user')['delete'][1]({})).toEqual({ type: 'DELETE_USER_SUCCESS', error: false, completed: true, data: {} });
      expect(genPlainActions('user')['delete'][2]({})).toEqual({ type: 'DELETE_USER_ERROR', error: {}, completed: true });
    });
    test('Get actions from gen user list', () => {
      expect(genPlainActions('user')['list'][0]()).toEqual({ type: 'LIST_USER_REQUESTED', completed: false });
      expect(genPlainActions('user')['list'][1]({})).toEqual({ type: 'LIST_USER_SUCCESS', error: false, completed: true, data: {} });
      expect(genPlainActions('user')['list'][2]({})).toEqual({ type: 'LIST_USER_ERROR', error: {}, completed: true });
    });
    test('Get actions from gen user fetch', () => {
      expect(genPlainActions('user')['fetch'][0]()).toEqual({ type: 'FETCH_USER_REQUESTED', completed: false });
      expect(genPlainActions('user')['fetch'][1]({})).toEqual({ type: 'FETCH_USER_SUCCESS', error: false, completed: true, data: {} });
      expect(genPlainActions('user')['fetch'][2]({})).toEqual({ type: 'FETCH_USER_ERROR', error: {}, completed: true });
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
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {
            'id': 1,
            'name': 'John Doe'
          }
        })
      })
      const expectedActions = [
        { type: 'CREATE_USER_REQUESTED', completed: false },
        { type: 'CREATE_USER_SUCCESS', completed: true, error: false, data: { id: 1, name: 'John Doe' } }
      ]
      const store = mockStore({user: {name: 'Jonh Doe'}})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['create']({name: 'jonh doe'})).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
    test('Get thunks from gen in a error response for user create', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 500,
          response: {}
        })
      })
      const expectedActions = [
        { type: 'CREATE_USER_REQUESTED', completed: false },
        { type: 'CREATE_USER_ERROR', completed: true, error: new Error('Request failed with status code 500') }
      ]
      const store = mockStore({user: {name: 'Jonh Doe'}})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['create']({name: 'jonh doe'})).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
  });
  describe('Thunk action generators for update', () => {
    beforeEach(() => {
      moxios.install()
    })
    afterEach(() => {
      moxios.uninstall()
    })
    test('Get thunks from gen in a success response for user update', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {
            'id': 1,
            'name': 'John Doe 2'
          }
        })
      })
      const expectedActions = [
        { type: 'UPDATE_USER_REQUESTED', completed: false },
        { type: 'UPDATE_USER_SUCCESS', completed: true, error: false, data: {id: 1, name: 'John Doe 2'} }
      ]
      const store = mockStore({user: {name: 'Jonh Doe'}})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['update'](1, {name: 'jonh doe 2'})).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
    test('Get thunks from gen in a error response for user update', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 500,
          response: {}
        })
      })
      const expectedActions = [
        { type: 'UPDATE_USER_REQUESTED', completed: false },
        { type: 'UPDATE_USER_ERROR', completed: true, error: new Error('Request failed with status code 500') }
      ]
      const store = mockStore({user: {name: 'Jonh Doe'}})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['update'](1, {name: 'jonh doe'})).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
  });
  describe('Thunk action generators for delete', () => {
    beforeEach(() => {
      moxios.install()
    })
    afterEach(() => {
      moxios.uninstall()
    })
    test('Get thunks from gen in a success response for user delete', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {
            id: 2,
            name: 'John Doe'
          }
        })
      })
      const expectedActions = [
        { type: 'DELETE_USER_REQUESTED', completed: false },
        { type: 'DELETE_USER_SUCCESS', completed: true, error: false, data: {id: 2, name: 'John Doe'} }
      ]
      const store = mockStore({user: {name: 'Jonh Doe'}})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['delete'](2)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
    test('Get thunks from gen in a error response for user delete', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 500,
          response: new Error('Request failed with status code 500')
        })
      })
      const expectedActions = [
        { type: 'DELETE_USER_REQUESTED', completed: false },
        { type: 'DELETE_USER_ERROR', completed: true, error: new Error('Request failed with status code 500') }
      ]
      const store = mockStore({user: {id: 2}})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['delete'](1))
    });
  });
  describe('Thunk action generators for user list', () => {
    beforeEach(() => {
      moxios.install()
    })
    afterEach(() => {
      moxios.uninstall()
    })
    test('Get thunks from gen in a success response for user list', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: [{
            'name': 'John Doe'
          }]
        })
      })
      const expectedActions = [
        { type: 'LIST_USER_REQUESTED', completed: false },
        { type: 'LIST_USER_SUCCESS', completed: true, error: false, data: [{name: 'John Doe'}] }
      ]
      const store = mockStore({users: [{name: 'Jonh Doe'}]})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['list']({id: 2})).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
    test('Get thunks from gen in a error response for user list', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.stubRequest('http://example.com/user/', {
        status: 500
      })
      const expectedActions = [
        { type: 'LIST_USER_REQUESTED', completed: false },
        { type: 'LIST_USER_ERROR', completed: true, error: new Error('Request failed with status code 500') }
      ]
      const store = mockStore({user: {id: 2}})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['list']()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
  });
  describe('Thunk action generators for user fetch', () => {
    beforeEach(() => {
      moxios.install()
    })
    afterEach(() => {
      moxios.uninstall()
    })
    test('Get thunks from gen in a success response for user fetch', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: { id: 2, name: 'John Doe'}
        })
      })
      const expectedActions = [
        { type: 'FETCH_USER_REQUESTED', completed: false },
        { type: 'FETCH_USER_SUCCESS', completed: true, error: false, data: {id: 2, name: 'John Doe'} }
      ]
      const store = mockStore({users: [{name: 'Jonh Doe'}]})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['fetch'](2)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
    test('Get thunks from gen in a error response for user fetch', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 500,
          response: new Error('Request failed with status code 500')
        })
      })
      const expectedActions = [
        { type: 'FETCH_USER_REQUESTED', completed: false },
        { type: 'FETCH_USER_ERROR', completed: true, error: new Error('Request failed with status code 500') }
      ]
      const store = mockStore({user: {id: 2}})
      return store.dispatch(genAsyncActions('user', 'http://example.com/user/')['fetch'](32)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    });
  });
})
