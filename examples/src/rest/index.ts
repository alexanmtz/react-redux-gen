/**
 * REST CRUD example
 *
 * Demonstrates createClient({ protocol: 'REST' }) generating
 * list / fetch / create / update / delete async thunks + reducer.
 */
import nock from 'nock'
import { createDemoStore, type AppDispatch } from '../shared/store'
import { userAsyncActions, userReducer, userActionNames } from './user-actions'

// --- Offline mock API (HTTP level — works with library's axios) -------------
const host = 'https://api.example.com'
const db = new Map<number, { id: number; name: string; email: string }>()
db.set(1, { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' })

nock(host)
  .persist()
  .get('/users')
  .reply(200, () => Array.from(db.values()))
  .get(/\/users\/(\d+)/)
  .reply(200, (uri) => {
    const id = Number(uri.split('/').pop())
    const row = db.get(id)
    if (!row) return [404, { message: 'Not found' }]
    return row
  })
  .post('/users')
  .reply(201, (_uri, body) => {
    const input = body as { name: string; email: string }
    const id = Math.max(0, ...db.keys()) + 1
    const row = { id, ...input }
    db.set(id, row)
    return row
  })
  .put(/\/users\/(\d+)/)
  .reply(200, (uri, body) => {
    const id = Number(uri.split('/').pop())
    const existing = db.get(id)
    if (!existing) return [404, { message: 'Not found' }]
    const updated = { ...existing, ...(body as object) }
    db.set(id, updated)
    return updated
  })
  .delete(/\/users\/(\d+)/)
  .reply(200, (uri) => {
    const id = Number(uri.split('/').pop())
    const existing = db.get(id)
    if (!existing) return [404, { message: 'Not found' }]
    db.delete(id)
    return existing
  })

async function main() {
  console.log('REST CRUD example — action names:')
  console.log(JSON.stringify(userActionNames, null, 2))

  const store = createDemoStore({ user: userReducer })
  const dispatch = store.dispatch as AppDispatch

  const run = async (label: string, thunk: unknown) => {
    await dispatch(thunk as never)
    console.log(`\n--- ${label} ---`)
    console.log('state:', JSON.stringify(store.getState(), null, 2))
  }

  await run('LIST users', userAsyncActions.list())
  await run('FETCH user 1', userAsyncActions.fetch(1))
  await run(
    'CREATE user',
    userAsyncActions.create({ name: 'Grace Hopper', email: 'grace@example.com' })
  )
  await run('UPDATE user 1', userAsyncActions.update(1, { name: 'Ada L.' }))
  await run('DELETE user 2', userAsyncActions.delete(2))

  console.log('\nNamed plain action sample:')
  console.log('  CREATE_USER_REQUESTED =>', userActionNames.create.requested)

  nock.cleanAll()
  console.log('\nREST example finished successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
