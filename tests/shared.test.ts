import { formatActionType } from '../src/shared/format-action-type'
import { toNamedStateKey } from '../src/shared/to-named-state-key'
import { buildNamedStateMap } from '../src/shared/build-named-state-map'
import { createRequestedAction } from '../src/shared/create-requested-action'
import { createSuccessAction } from '../src/shared/create-success-action'
import { createErrorAction } from '../src/shared/create-error-action'
import { createStateActionCreator } from '../src/shared/create-state-action-creator'

describe('shared helpers', () => {
  test('formatActionType', () => {
    expect(formatActionType('user', 'create', 'REQUESTED')).toBe('CREATE_USER_REQUESTED')
  })

  test('toNamedStateKey', () => {
    expect(toNamedStateKey('REQUESTED')).toBe('requested')
    expect(toNamedStateKey('Success')).toBe('success')
  })

  test('buildNamedStateMap', () => {
    const map = buildNamedStateMap(['REQUESTED', 'SUCCESS'], (s, i, k) => `${k}-${i}`)
    expect(map).toEqual({ requested: 'requested-0', success: 'success-1' })
  })

  test('action factories', () => {
    expect(createRequestedAction('T')).toEqual({ type: 'T', completed: false })
    expect(createSuccessAction('T', 1)).toEqual({
      type: 'T',
      completed: true,
      error: false,
      data: 1,
    })
    expect(createErrorAction('T', 'e')).toEqual({
      type: 'T',
      completed: true,
      error: 'e',
    })
  })

  test('createStateActionCreator branches', () => {
    expect(createStateActionCreator('A', 0, 'requested')()).toMatchObject({
      type: 'A',
      completed: false,
    })
    expect(createStateActionCreator('B', 1, 'success')(9)).toMatchObject({
      type: 'B',
      data: 9,
    })
    expect(createStateActionCreator('C', 2, 'error')('x')).toMatchObject({
      type: 'C',
      error: 'x',
    })
    expect(createStateActionCreator('D', 3, 'custom')('p')).toEqual({
      type: 'D',
      completed: true,
      data: 'p',
    })
  })
})
