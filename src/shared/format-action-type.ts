/**
 * Build a conventional Redux action type string.
 * e.g. formatActionType('user', 'create', 'REQUESTED') => 'CREATE_USER_REQUESTED'
 */
export function formatActionType(
  entity: string,
  actionType: string,
  state: string
): string {
  return `${actionType.toUpperCase()}_${entity.toUpperCase()}_${state.toUpperCase()}`
}
