let counter = 0

/**
 * Create a unique request id for correlating WS request/response pairs.
 */
export function createRequestId(entity: string, operation: string): string {
  counter += 1
  return `${entity}:${operation}:${Date.now()}:${counter}`
}

/** Test helper to reset the counter */
export function resetRequestIdCounter(): void {
  counter = 0
}
