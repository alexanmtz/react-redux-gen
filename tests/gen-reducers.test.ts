import { genPlainActions } from '../src/actions/gen-plain-actions'
import { genReducer } from '../src/reducers/gen-reducer'

const initial = { data: {} as Record<string, unknown> | unknown[], error: false as const, completed: true }

describe('genReducer', () => {
  const ops = ['create', 'update', 'delete', 'list', 'fetch'] as const

  test('returns initial state for unknown actions', () => {
    const reducer = genReducer('user', initial)
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initial)
  })

  ops.forEach((op) => {
    describe(`${op}`, () => {
      const actions = genPlainActions('user')
      const reducer = genReducer('user', initial)

      test('requested', () => {
        expect(reducer(undefined, actions[op].requested())).toEqual({
          data: {},
          error: false,
          completed: false,
        })
      })

      test('success', () => {
        const data = op === 'list' ? [{ name: 'John' }] : { name: 'John Doe' }
        expect(reducer(undefined, actions[op].success(data))).toEqual({
          data,
          error: false,
          completed: true,
        })
      })

      test('error', () => {
        expect(reducer(undefined, actions[op].error({ code: 100 }))).toEqual({
          data: {},
          error: { code: 100 },
          completed: true,
        })
      })
    })
  })
})
