/**
 * WebSocket example
 *
 * createClient({ protocol: 'WEBSOCKET' }) generates thunks that
 * send JSON envelopes and wait for correlated responses.
 */
import { createDemoStore, type AppDispatch } from '../shared/store'
import {
  messageAsyncActions,
  messageReducer,
  messageActionNames,
} from './chat-actions'

async function main() {
  console.log('WebSocket example — action names:')
  console.log(JSON.stringify(messageActionNames, null, 2))

  const store = createDemoStore({ message: messageReducer })
  const dispatch = store.dispatch as AppDispatch

  const run = async (label: string, thunk: unknown) => {
    await dispatch(thunk as never)
    console.log(`\n--- ${label} ---`)
    console.log('state:', JSON.stringify(store.getState(), null, 2))
  }

  await run('LIST messages', messageAsyncActions.list({ room: 'general' }))
  await run('CREATE message', messageAsyncActions.create({ text: 'Hello WS' }))
  await run('FETCH message', messageAsyncActions.fetch('msg-1'))
  await run(
    'UPDATE message',
    messageAsyncActions.update('msg-1', { text: 'Updated' })
  )
  await run('DELETE message', messageAsyncActions.delete('msg-1'))

  console.log('\nWebSocket example finished successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
