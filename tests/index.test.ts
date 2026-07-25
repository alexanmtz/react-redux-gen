import * as lib from '../src/index'

describe('public API exports', () => {
  test('exports generators and client', () => {
    expect(typeof lib.genActionNames).toBe('function')
    expect(typeof lib.genPlainActions).toBe('function')
    expect(typeof lib.genAsyncActions).toBe('function')
    expect(typeof lib.genReducer).toBe('function')
    expect(typeof lib.createClient).toBe('function')
    expect(lib.DEFAULT_ACTION_TYPES).toContain('create')
    expect(lib.DEFAULT_STATES).toContain('REQUESTED')
    expect(lib.BaseAdapter).toBeDefined()
    expect(lib.RestAdapter).toBeDefined()
    expect(lib.GraphQLAdapter).toBeDefined()
    expect(lib.WebSocketAdapter).toBeDefined()
  })
})
