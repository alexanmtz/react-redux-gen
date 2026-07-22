import { DEFAULT_ACTION_TYPES } from '../constants/default-types'
import { DEFAULT_STATES } from '../constants/default-states'
import { formatActionType } from '../shared/format-action-type'
import { buildNamedStateMap } from '../shared/build-named-state-map'
import type { ActionNamesMap, NamedStateActionNames } from '../types'

/**
 * Generate conventional Redux action type name strings as a named object.
 *
 * @example
 * genActionNames('user')
 * // {
 * //   create: { requested: 'CREATE_USER_REQUESTED', success: 'CREATE_USER_SUCCESS', error: 'CREATE_USER_ERROR' },
 * //   ...
 * // }
 */
export function genActionNames(
  entity: string,
  types: readonly string[] = DEFAULT_ACTION_TYPES,
  states: readonly string[] = DEFAULT_STATES
): ActionNamesMap {
  const actions: ActionNamesMap = {}

  types.forEach((actionType) => {
    const named = buildNamedStateMap(states, (state) =>
      formatActionType(entity, actionType, state)
    ) as NamedStateActionNames
    actions[actionType] = named
  })

  return actions
}
