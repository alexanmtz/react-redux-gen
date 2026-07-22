import type { DefaultActionType } from '../types'

export const DEFAULT_ACTION_TYPES: readonly DefaultActionType[] = [
  'create',
  'update',
  'delete',
  'list',
  'fetch',
] as const
