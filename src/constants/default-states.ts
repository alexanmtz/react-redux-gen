import type { DefaultState } from '../types'

export const DEFAULT_STATES: readonly DefaultState[] = [
  'REQUESTED',
  'SUCCESS',
  'ERROR',
] as const
