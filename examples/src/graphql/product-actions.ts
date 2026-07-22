import { createClient } from 'react-redux-gen'

/**
 * GraphQL CRUD for a Product resource.
 * Defaults generate list query, get query, create/update/delete mutations.
 */
const gqlClient = createClient({
  protocol: 'GRAPHQL',
  endpoint: 'https://api.example.com/graphql',
  headers: {
    Authorization: 'Bearer demo-token',
  },
  selection: 'id name price',
})

export const productActionNames = gqlClient.genActionNames('product')
export const productAsyncActions = gqlClient.genAsyncActions('product')
export const productReducer = gqlClient.genReducer('product', {
  data: null as unknown,
  error: false as false | unknown,
  completed: true,
})

/**
 * Optional: override documents for a specific entity.
 */
export const productAsyncWithCustomOps = gqlClient.genAsyncActions('product', {
  operations: {
    list: `query ListProducts { products { id name price } }`,
    fetch: `query GetProduct($id: ID!) { product(id: $id) { id name price description } }`,
  },
  selection: 'id name price description',
})
