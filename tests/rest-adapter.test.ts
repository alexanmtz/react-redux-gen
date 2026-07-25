import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import axios from 'axios'
import { genAsyncActions } from '../src/actions/gen-async-actions'
import { createClient } from '../src/adapters/create-client'
import { RestAdapter } from '../src/adapters/rest/rest-adapter'
import { buildRequestConfig } from '../src/adapters/rest/build-request-config'
import { REST_METHOD_MAP } from '../src/adapters/rest/rest-method-map'

jest.mock('axios')
const mockedAxios = axios as jest.MockedFunction<typeof axios>

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares as never)

describe('REST_METHOD_MAP', () => {
  test('maps CRUD to HTTP methods', () => {
    expect(REST_METHOD_MAP.create).toBe('post')
    expect(REST_METHOD_MAP.update).toBe('put')
    expect(REST_METHOD_MAP.delete).toBe('delete')
    expect(REST_METHOD_MAP.list).toBe('get')
    expect(REST_METHOD_MAP.fetch).toBe('get')
  })
})

describe('buildRequestConfig', () => {
  const headers = { Authorization: 'Bearer x' }

  test('create', () => {
    expect(buildRequestConfig('create', 'http://api/users', headers, { name: 'a' })).toEqual({
      method: 'post',
      url: 'http://api/users',
      headers,
      data: { name: 'a' },
    })
  })

  test('update', () => {
    expect(
      buildRequestConfig('update', 'http://api/users/', headers, 1, { name: 'b' })
    ).toEqual({
      method: 'put',
      url: 'http://api/users/1',
      headers,
      data: { name: 'b' },
      params: undefined,
    })
  })

  test('delete', () => {
    expect(buildRequestConfig('delete', 'http://api/users', headers, 2)).toEqual({
      method: 'delete',
      url: 'http://api/users/2',
      headers,
    })
  })

  test('list', () => {
    expect(buildRequestConfig('list', 'http://api/users', headers, { page: 1 })).toEqual({
      method: 'get',
      url: 'http://api/users',
      headers,
      params: { page: 1 },
    })
  })

  test('fetch', () => {
    expect(buildRequestConfig('fetch', 'http://api/users', headers, 9)).toEqual({
      method: 'get',
      url: 'http://api/users/9',
      headers,
    })
  })

  test('unknown key defaults to get', () => {
    expect(buildRequestConfig('custom', 'http://api/x', headers)).toMatchObject({
      method: 'get',
      url: 'http://api/x',
    })
  })
})

describe('RestAdapter / genAsyncActions', () => {
  beforeEach(() => {
    mockedAxios.mockReset()
  })

  const cases: Array<{
    op: string
    args: unknown[]
    response: unknown
    successType: string
  }> = [
    {
      op: 'create',
      args: [{ name: 'jonh doe' }],
      response: { id: 1, name: 'John Doe' },
      successType: 'CREATE_USER_SUCCESS',
    },
    {
      op: 'update',
      args: [1, { name: 'jonh doe 2' }],
      response: { id: 1, name: 'John Doe 2' },
      successType: 'UPDATE_USER_SUCCESS',
    },
    {
      op: 'delete',
      args: [2],
      response: { id: 2, name: 'John Doe' },
      successType: 'DELETE_USER_SUCCESS',
    },
    {
      op: 'list',
      args: [{ id: 2 }],
      response: [{ name: 'John Doe' }],
      successType: 'LIST_USER_SUCCESS',
    },
    {
      op: 'fetch',
      args: [2],
      response: { id: 2, name: 'John Doe' },
      successType: 'FETCH_USER_SUCCESS',
    },
  ]

  cases.forEach(({ op, args, response, successType }) => {
    test(`${op} success via genAsyncActions`, async () => {
      mockedAxios.mockResolvedValueOnce({ data: response })
      const store = mockStore({})
      const asyncActions = genAsyncActions('user', 'http://example.com/user/')
      await store.dispatch(asyncActions[op](...args) as never)
      const actions = store.getActions()
      expect(actions[0].type).toBe(`${op.toUpperCase()}_USER_REQUESTED`)
      expect(actions[1]).toMatchObject({
        type: successType,
        completed: true,
        error: false,
        data: response,
      })
    })

    test(`${op} error via RestAdapter`, async () => {
      const err = new Error('Request failed with status code 500')
      mockedAxios.mockRejectedValueOnce(err)
      const store = mockStore({})
      const adapter = new RestAdapter({
        protocol: 'REST',
        baseUrl: 'http://example.com/user/',
      })
      await store.dispatch(adapter.genAsyncActions('user')[op](...args) as never)
      const actions = store.getActions()
      expect(actions[0].type).toContain('REQUESTED')
      expect(actions[1]).toMatchObject({
        type: `${op.toUpperCase()}_USER_ERROR`,
        completed: true,
        error: err,
      })
    })
  })

  test('createClient REST with headers and resource override', async () => {
    mockedAxios.mockResolvedValueOnce({ data: { ok: true } })
    const client = createClient({
      protocol: 'REST',
      baseUrl: 'http://default',
      headers: { 'X-Test': '1' },
    })
    const store = mockStore({})
    await store.dispatch(
      client.genAsyncActions('item', 'http://override/items')['create']({ a: 1 }) as never
    )
    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'http://override/items',
        headers: { 'X-Test': '1' },
      })
    )
  })

  test('adapter exposes genActionNames / genPlainActions / genReducer', () => {
    const client = createClient({ protocol: 'REST', baseUrl: '/u' })
    expect(client.protocol).toBe('REST')
    expect(client.genActionNames('user').create.requested).toBe('CREATE_USER_REQUESTED')
    expect(client.genPlainActions('user').create.requested().type).toBe('CREATE_USER_REQUESTED')
    const reducer = client.genReducer('user', { data: {}, error: false, completed: true })
    expect(reducer(undefined, { type: 'NOPE' })).toEqual({
      data: {},
      error: false,
      completed: true,
    })
  })
})
