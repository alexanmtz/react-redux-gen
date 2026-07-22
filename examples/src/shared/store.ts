import { createStore, applyMiddleware, combineReducers, type AnyAction } from 'redux'
import { thunk, type ThunkDispatch } from 'redux-thunk'
import type { EntityReducer } from 'react-redux-gen'

export type AppDispatch = ThunkDispatch<unknown, unknown, AnyAction>

/**
 * Build a minimal Redux store for demos (no React UI).
 */
export function createDemoStore(
  reducers: Record<string, EntityReducer | ((state: unknown, action: AnyAction) => unknown)>
) {
  return createStore(combineReducers(reducers), applyMiddleware(thunk))
}

/** Pretty-print dispatched actions for demos */
export function logActions(label: string, actions: AnyAction[]): void {
  console.log(`\n=== ${label} ===`)
  actions.forEach((action, i) => {
    console.log(`[${i}]`, JSON.stringify(action, null, 2))
  })
}
