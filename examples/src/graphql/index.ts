/**
 * GraphQL CRUD example
 *
 * createClient({ protocol: 'GRAPHQL' }) generates:
 * - list  → query
 * - fetch → query by id
 * - create / update / delete → mutations
 */
import nock from 'nock'
import { createDemoStore, type AppDispatch } from '../shared/store'
import {
  productAsyncActions,
  productReducer,
  productActionNames,
} from './product-actions'

const host = 'https://api.example.com'

nock(host)
  .persist()
  .post('/graphql')
  .reply(200, (_uri, requestBody) => {
    const body = requestBody as {
      query?: string
      variables?: Record<string, unknown>
    }
    const query = body.query ?? ''
    const variables = (body.variables ?? {}) as {
      id?: string
      input?: { name?: string; price?: number }
    }

    let data: unknown
    if (query.includes('ListProduct')) {
      data = { products: [{ id: '1', name: 'Keyboard', price: 99 }] }
    } else if (query.includes('GetProduct')) {
      data = { product: { id: variables.id, name: 'Keyboard', price: 99 } }
    } else if (query.includes('CreateProduct')) {
      data = {
        createProduct: {
          id: '2',
          name: variables.input?.name,
          price: variables.input?.price,
        },
      }
    } else if (query.includes('UpdateProduct')) {
      data = {
        updateProduct: {
          id: variables.id,
          name: variables.input?.name,
          price: variables.input?.price,
        },
      }
    } else if (query.includes('DeleteProduct')) {
      data = { deleteProduct: { id: variables.id, name: 'Keyboard', price: 99 } }
    } else {
      data = {}
    }

    return { data }
  })

async function main() {
  console.log('GraphQL example — default action names:')
  console.log(JSON.stringify(productActionNames, null, 2))

  const store = createDemoStore({ product: productReducer })
  const dispatch = store.dispatch as AppDispatch

  const run = async (label: string, thunk: unknown) => {
    await dispatch(thunk as never)
    console.log(`\n--- ${label} ---`)
    console.log('state:', JSON.stringify(store.getState(), null, 2))
  }

  await run('LIST products (query)', productAsyncActions.list())
  await run('FETCH product (query)', productAsyncActions.fetch('1'))
  await run(
    'CREATE product (mutation)',
    productAsyncActions.create({ name: 'Mouse', price: 49 })
  )
  await run(
    'UPDATE product (mutation)',
    productAsyncActions.update('1', { name: 'Mechanical Keyboard', price: 129 })
  )
  await run('DELETE product (mutation)', productAsyncActions.delete('1'))

  nock.cleanAll()
  console.log('\nGraphQL example finished successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
