import { genPlainActions } from '../src/actions/gen-plain-actions'

describe('genPlainActions', () => {
  test('named access for create lifecycle', () => {
    const actions = genPlainActions('user')
    expect(actions.create.requested()).toEqual({
      type: 'CREATE_USER_REQUESTED',
      completed: false,
    })
    expect(actions.create.success({})).toEqual({
      type: 'CREATE_USER_SUCCESS',
      error: false,
      completed: true,
      data: {},
    })
    expect(actions.create.error({})).toEqual({
      type: 'CREATE_USER_ERROR',
      error: {},
      completed: true,
    })
  })

  test('named access for update / delete / list / fetch', () => {
    const actions = genPlainActions('user')
    expect(actions.update.requested().type).toBe('UPDATE_USER_REQUESTED')
    expect(actions.update.success({ id: 1 }).data).toEqual({ id: 1 })
    expect(actions.update.error({ code: 1 }).error).toEqual({ code: 1 })

    expect(actions.delete.requested().type).toBe('DELETE_USER_REQUESTED')
    expect(actions.delete.success({ id: 1 }).type).toBe('DELETE_USER_SUCCESS')
    expect(actions.delete.error({}).type).toBe('DELETE_USER_ERROR')

    expect(actions.list.requested().type).toBe('LIST_USER_REQUESTED')
    expect(actions.list.success([]).data).toEqual([])
    expect(actions.list.error({}).type).toBe('LIST_USER_ERROR')

    expect(actions.fetch.requested().type).toBe('FETCH_USER_REQUESTED')
    expect(actions.fetch.success({ id: 2 }).data).toEqual({ id: 2 })
    expect(actions.fetch.error({}).type).toBe('FETCH_USER_ERROR')
  })

  test('custom action type with named states', () => {
    const actions = genPlainActions('user', ['login'])
    expect(actions.login.requested()).toEqual({
      type: 'LOGIN_USER_REQUESTED',
      completed: false,
    })
    expect(actions.login.success({ token: 'abc' }).data).toEqual({ token: 'abc' })
    expect(actions.login.error(new Error('fail')).error).toEqual(new Error('fail'))
  })

  test('custom states produce named creators', () => {
    const actions = genPlainActions('user', ['login'], ['started', 'ready', 'error'])
    expect(actions.login.started()).toEqual({
      type: 'LOGIN_USER_STARTED',
      completed: false,
    })
    expect(actions.login.ready({ ok: true })).toEqual({
      type: 'LOGIN_USER_READY',
      completed: true,
      error: false,
      data: { ok: true },
    })
    expect(actions.login.error('x')).toEqual({
      type: 'LOGIN_USER_ERROR',
      completed: true,
      error: 'x',
    })
  })

  test('extra custom states beyond three use generic creator', () => {
    const actions = genPlainActions('task', ['run'], ['a', 'b', 'c', 'd'])
    expect(actions.run.d('payload')).toEqual({
      type: 'RUN_TASK_D',
      completed: true,
      data: 'payload',
    })
  })
})
