/**
 * Custom usage example (auth / login)
 *
 * Uses genPlainActions + genActionNames only, with hand-written
 * async thunks and a hand-written reducer — matching the classic
 * README pattern, updated for named lifecycle access.
 */
import nock from 'nock'
import { createDemoStore, type AppDispatch } from '../shared/store'
import { logged, login, logout, register, loginActionNames } from './auth-actions'
import { authReducer } from './auth-reducer'

const host = 'https://api.example.com'

nock(host)
  .persist()
  .get('/authenticated')
  .reply(200, { id: 1, email: 'ada@example.com', name: 'Ada' })
  .post('/authorize/local')
  .reply(200, (_uri, body) => {
    const b = body as { email?: string }
    return { token: 'jwt-demo', user: { email: b.email } }
  })
  .post('/auth/register')
  .reply(200, (_uri, body) => ({ id: 2, ...(body as object) }))

async function main() {
  console.log('Custom auth example — action names:')
  console.log(JSON.stringify(loginActionNames, null, 2))

  console.log('\nNamed access (no more [0]/[1]/[2]):')
  console.log('  loginActionNames.login.requested =>', loginActionNames.login.requested)
  console.log('  loginActionNames.login.success   =>', loginActionNames.login.success)
  console.log('  loginActionNames.login.error     =>', loginActionNames.login.error)

  const store = createDemoStore({ auth: authReducer })
  const dispatch = store.dispatch as AppDispatch

  const run = async (label: string, thunk: unknown) => {
    await dispatch(thunk as never)
    console.log(`\n--- ${label} ---`)
    console.log('state:', JSON.stringify(store.getState(), null, 2))
  }

  await run('logged()', logged())
  await run('login()', login({ email: 'ada@example.com', password: 'secret' }))
  await run(
    'register()',
    register({ email: 'grace@example.com', password: 'secret', name: 'Grace' })
  )
  await run('logout()', logout())

  nock.cleanAll()
  console.log('\nCustom example finished successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
