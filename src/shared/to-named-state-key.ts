/**
 * Convert a state label to a stable camelCase-friendly key.
 * REQUESTED -> requested, SUCCESS -> success, ERROR -> error
 */
export function toNamedStateKey(state: string): string {
  return state.toLowerCase()
}
