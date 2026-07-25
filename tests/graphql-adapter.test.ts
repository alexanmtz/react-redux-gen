import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import axios from 'axios'
import { createClient } from '../src/adapters/create-client'
import { GraphQLAdapter } from '../src/adapters/graphql/graphql-adapter'
import { buildDefaultOperations } from '../src/adapters/graphql/default-operations'
import { buildGraphQLVariables } from '../src/adapters/graphql/build-graphql-variables'
import { extractGraphQLData } from '../src/adapters/graphql/extract-graphql-data'

jest.mock('axios')
const mockedAxios = axios as jest.MockedFunction<typeof axios>
// GraphQL uses axios.post
const mockedPost = jest.fn()
;(axios as unknown as { post: jest.Mock }).post = mockedPost

const mockStore = configureMockStore([thunk] as never)

describe('buildDefaultOperations', () => {
  test('builds standard documents', () => {
    const ops = buildDefaultOperations('user', 'id name')
    expect(ops.list).toContain('query ListUsers')
    expect(ops.list).toContain('users { id name }')
    expect(ops.fetch).toContain('GetUser')
    expect(ops.create).toContain('mutation CreateUser')
    expect(ops.update).toContain('UpdateUser')
    expect(ops.delete).toContain('DeleteUser')
  })
})

describe('buildGraphQLVariables', () => {
  test('maps each operation', () => {
    expect(buildGraphQLVariables('list', { page: 1 })).toEqual({ page: 1 })
    expect(buildGraphQLVariables('list')).toEqual({})
    expect(buildGraphQLVariables('fetch', 3)).toEqual({ id: 3 })
    expect(buildGraphQLVariables('delete', 3)).toEqual({ id: 3 })
    expect(buildGraphQLVariables('create', { name: 'a' })).toEqual({
      input: { name: 'a' },
    })
    expect(buildGraphQLVariables('update', 1, { name: 'b' })).toEqual({
      id: 1,
      input: { name: 'b' },
    })
    expect(buildGraphQLVariables('custom', { x: 1 }, { y: 2 })).toEqual({ x: 1, y: 2 })
    expect(buildGraphQLVariables('custom', 'raw')).toEqual({ data: 'raw' })
  })
})

describe('extractGraphQLData', () => {
  test('returns first field', () => {
    expect(extractGraphQLData({ data: { user: { id: 1 } } })).toEqual({ id: 1 })
  })

  test('throws on errors', () => {
    expect(() =>
      extractGraphQLData({ errors: [{ message: 'boom' }, { message: 'two' }] })
    ).toThrow('boom, two')
  })

  test('handles empty data', () => {
    expect(extractGraphQLData({ data: undefined })).toBeUndefined()
    expect(extractGraphQLData({ data: {} })).toEqual({})
  })
})

describe('GraphQLAdapter', () => {
  beforeEach(() => {
    mockedPost.mockReset()
  })

  test('list success', async () => {
    mockedPost.mockResolvedValueOnce({
      data: { data: { users: [{ id: 1 }] } },
    })
    const adapter = new GraphQLAdapter({
      protocol: 'GRAPHQL',
      endpoint: 'http://api/graphql',
    })
    const store = mockStore({})
    await store.dispatch(adapter.genAsyncActions('user').list() as never)
    expect(store.getActions()[0].type).toBe('LIST_USER_REQUESTED')
    expect(store.getActions()[1]).toMatchObject({
      type: 'LIST_USER_SUCCESS',
      data: [{ id: 1 }],
    })
    expect(mockedPost).toHaveBeenCalledWith(
      'http://api/graphql',
      expect.objectContaining({
        query: expect.stringContaining('ListUsers'),
        variables: {},
      }),
      expect.any(Object)
    )
  })

  test('create success and fetch error', async () => {
    mockedPost.mockResolvedValueOnce({
      data: { data: { createUser: { id: 1, name: 'Ada' } } },
    })
    const client = createClient({
      protocol: 'GRAPHQL',
      endpoint: 'http://api/graphql',
      headers: { Authorization: 't' },
      selection: 'id name',
    })
    const store = mockStore({})
    await store.dispatch(
      client.genAsyncActions('user').create({ name: 'Ada' }) as never
    )
    expect(store.getActions()[1].data).toEqual({ id: 1, name: 'Ada' })

    mockedPost.mockRejectedValueOnce(new Error('network'))
    const store2 = mockStore({})
    await store2.dispatch(client.genAsyncActions('user').fetch(9) as never)
    expect(store2.getActions()[1].type).toBe('FETCH_USER_ERROR')
  })

  test('update and delete and GraphQL field errors', async () => {
    const adapter = new GraphQLAdapter({
      protocol: 'GRAPHQL',
      endpoint: 'http://gql',
      operations: {
        list: 'query Custom { all { id } }',
      },
    })

    mockedPost.mockResolvedValueOnce({
      data: { data: { updateUser: { id: 1 } } },
    })
    const s1 = mockStore({})
    await s1.dispatch(adapter.genAsyncActions('user').update(1, { n: 1 }) as never)
    expect(s1.getActions()[1].type).toBe('UPDATE_USER_SUCCESS')

    mockedPost.mockResolvedValueOnce({
      data: { data: { deleteUser: { id: 1 } } },
    })
    const s2 = mockStore({})
    await s2.dispatch(adapter.genAsyncActions('user').delete(1) as never)
    expect(s2.getActions()[1].type).toBe('DELETE_USER_SUCCESS')

    mockedPost.mockResolvedValueOnce({
      data: { errors: [{ message: 'nope' }] },
    })
    const s3 = mockStore({})
    await s3.dispatch(adapter.genAsyncActions('user').list() as never)
    expect(s3.getActions()[1].type).toBe('LIST_USER_ERROR')
  })

  test('skips operations without documents', () => {
    const adapter = new GraphQLAdapter({
      protocol: 'GRAPHQL',
      endpoint: 'http://gql',
      types: ['create', 'mystery'],
      operations: { create: 'mutation { x }' },
    })
    // mystery has no default and no custom document → omitted
    // but buildDefaultOperations only has create/list/fetch/update/delete
    const actions = adapter.genAsyncActions('thing', {
      operations: { create: 'mutation { x }' },
    })
    expect(actions.create).toBeDefined()
    // mystery won't be in defaults
  })
})
