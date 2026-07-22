/**
 * Build a conventional WebSocket message type string.
 * e.g. buildMessageType('user', 'create') => 'user.create'
 */
export function buildMessageType(
  entity: string,
  operation: string,
  prefix?: string
): string {
  const base = prefix ? `${prefix}.${entity}` : entity
  return `${base}.${operation}`
}
