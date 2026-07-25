import { DEFAULT_ACTION_TYPES } from '../constants/default-types'
import { DEFAULT_STATES } from '../constants/default-states'
import { genActionNames } from './gen-action-names'
import { createStateActionCreator } from '../shared/create-state-action-creator'
import { buildNamedStateMap } from '../shared/build-named-state-map'
import type { NamedStateActionCreators, PlainActionsMap } from '../types'

/**
 * Generate plain (sync) action creators as a named object.
 * Access lifecycle creators via `.requested`, `.success`, `.error`.
 *
 * @example
 * const actions = genPlainActions('user', ['action'])
 * dispatch(actions.action.requested())
 * dispatch(actions.action.success(data))
 * dispatch(actions.action.error(err))
 */
export function genPlainActions(
  entity: string,
  types: readonly string[] = DEFAULT_ACTION_TYPES,
  states: readonly string[] = DEFAULT_STATES
): PlainActionsMap {
  const actionNames = genActionNames(entity, types, states)
  const actionCreators: PlainActionsMap = {}

  Object.keys(actionNames).forEach((key) => {
    const namesForType = actionNames[key]

    actionCreators[key] = buildNamedStateMap(
      states,
      (_state, index, namedKey) => {
        const typeString = namesForType[namedKey]
        return createStateActionCreator(typeString, index, namedKey)
      }
    ) as NamedStateActionCreators
  })

  return actionCreators
}
