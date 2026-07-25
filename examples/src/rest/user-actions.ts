import { createClient, genPlainActions, type AsyncActionsMap } from 'react-redux-gen'

/**
 * REST CRUD for a User resource.
 * Initialize once with createClient({ protocol: 'REST', ... }).
 */
const restClient = createClient({
  protocol: 'REST',
  baseUrl: 'https://api.example.com/users',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer demo-token',
  },
})

export const userActionNames = restClient.genActionNames('user')
export const userPlainActions = genPlainActions('user')
export const userAsyncActions: AsyncActionsMap = restClient.genAsyncActions('user')
export const userReducer = restClient.genReducer('user', {
  data: null as Record<string, unknown> | null | unknown[],
  error: false as false | unknown,
  completed: true,
})
