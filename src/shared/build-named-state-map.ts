import { toNamedStateKey } from './to-named-state-key'

/**
 * Map state labels to values using named keys.
 * e.g. ['REQUESTED','SUCCESS','ERROR'] + mapFn => { requested: ..., success: ..., error: ... }
 */
export function buildNamedStateMap<T>(
  states: readonly string[],
  mapFn: (state: string, index: number, namedKey: string) => T
): Record<string, T> {
  const result: Record<string, T> = {}
  states.forEach((state, index) => {
    const namedKey = toNamedStateKey(state)
    result[namedKey] = mapFn(state, index, namedKey)
  })
  return result
}
