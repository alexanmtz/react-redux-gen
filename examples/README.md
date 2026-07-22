# react-redux-gen examples

This folder demonstrates every major way to use **react-redux-gen** v1:

| Demo | Protocol | What it shows |
|------|----------|----------------|
| [`src/rest`](./src/rest) | REST | Full CRUD thunks + generated reducer |
| [`src/graphql`](./src/graphql) | GraphQL | List/get queries + create/update/delete mutations |
| [`src/websocket`](./src/websocket) | WebSocket | Message-based CRUD with correlated responses |
| [`src/custom`](./src/custom) | Custom | Plain actions only + hand-written auth thunks/reducer |

All demos run **offline** with local mocks ([nock](https://github.com/nock/nock) for HTTP, in-process echo socket for WebSocket) so you can explore the Redux action flow without a real backend.

## Setup

From the repository root, build the library first, then install example deps:

```bash
npm install
npm run build

cd examples
npm install
```

Requires **Node.js 18+**.

## Run demos

```bash
# Individual demos
npm run rest
npm run graphql
npm run websocket
npm run custom

# All demos in sequence
npm run all
```

Each script prints:

1. Generated **named** action type strings  
2. State after each dispatch (`requested` → `success` / `error`)

---

## Shared concepts

### Named lifecycle (v1 breaking change)

Action names and plain creators are **objects**, not arrays:

```ts
// Before (v0)
actions.login[0]()
actions.login[1](data)
actions.login[2](error)

// After (v1)
actions.login.requested()
actions.login.success(data)
actions.login.error(error)
```

Action type strings follow the same shape:

```ts
actionNames.login.requested // 'LOGIN_USER_REQUESTED'
actionNames.login.success   // 'LOGIN_USER_SUCCESS'
actionNames.login.error     // 'LOGIN_USER_ERROR'
```

### Protocol initialization

Pick **one** protocol for your app (or module) via `createClient`:

```ts
import { createClient } from 'react-redux-gen'

const client = createClient({
  protocol: 'REST', // or 'GRAPHQL' | 'WEBSOCKET'
  // protocol-specific options...
})
```

Every client exposes:

| Method | Description |
|--------|-------------|
| `genActionNames(entity)` | Named action type strings |
| `genPlainActions(entity)` | Named plain action creators |
| `genAsyncActions(entity)` | Protocol-specific async thunks |
| `genReducer(entity, initialState)` | Standard CRUD reducer |

---

## 1. REST CRUD (`src/rest`)

### Initialize

```ts
import { createClient } from 'react-redux-gen'

const restClient = createClient({
  protocol: 'REST',
  baseUrl: 'https://api.example.com/users',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer demo-token',
  },
})
```

### Generate actions & reducer

```ts
export const userActionNames = restClient.genActionNames('user')
export const userAsyncActions = restClient.genAsyncActions('user')
export const userReducer = restClient.genReducer('user', {
  data: null,
  error: false,
  completed: true,
})
```

### Dispatch CRUD

```ts
dispatch(userAsyncActions.list())
dispatch(userAsyncActions.fetch(1))
dispatch(userAsyncActions.create({ name: 'Ada', email: 'ada@example.com' }))
dispatch(userAsyncActions.update(1, { name: 'Ada L.' }))
dispatch(userAsyncActions.delete(2))
```

### HTTP conventions

| Operation | Method | URL | Body / params |
|-----------|--------|-----|----------------|
| `list` | GET | `baseUrl` | query via first arg |
| `fetch` | GET | `baseUrl/:id` | id as first arg |
| `create` | POST | `baseUrl` | body as first arg |
| `update` | PUT | `baseUrl/:id` | id, then body |
| `delete` | DELETE | `baseUrl/:id` | id as first arg |

### Files

- `src/rest/user-actions.ts` — client + exports  
- `src/rest/index.ts` — mock API + demo runner  

### Convenience without `createClient`

```ts
import { genAsyncActions } from 'react-redux-gen'

const userAsync = genAsyncActions('user', 'https://api.example.com/users', headers)
// Same as REST adapter under the hood
```

---

## 2. GraphQL CRUD (`src/graphql`)

### Initialize

```ts
const gqlClient = createClient({
  protocol: 'GRAPHQL',
  endpoint: 'https://api.example.com/graphql',
  headers: { Authorization: 'Bearer demo-token' },
  selection: 'id name price', // fields used in default documents
})
```

### Default operations

For entity `product`, defaults look like:

```graphql
query ListProducts { products { id name price } }
query GetProduct($id: ID!) { product(id: $id) { id name price } }
mutation CreateProduct($input: ProductInput!) { createProduct(input: $input) { id name price } }
mutation UpdateProduct($id: ID!, $input: ProductInput!) { updateProduct(id: $id, input: $input) { id name price } }
mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) { id name price } }
```

### Override documents

```ts
gqlClient.genAsyncActions('product', {
  operations: {
    list: `query ListProducts { products { id name price } }`,
    fetch: `query GetProduct($id: ID!) { product(id: $id) { id name price description } }`,
  },
})
```

### Variable mapping

| Operation | Call | Variables |
|-----------|------|-----------|
| `list` | `list(filters?)` | filters object or `{}` |
| `fetch` | `fetch(id)` | `{ id }` |
| `create` | `create(input)` | `{ input }` |
| `update` | `update(id, input)` | `{ id, input }` |
| `delete` | `delete(id)` | `{ id }` |

### Files

- `src/graphql/product-actions.ts`  
- `src/graphql/index.ts`  

---

## 3. WebSocket (`src/websocket`)

### Initialize

```ts
const wsClient = createClient({
  protocol: 'WEBSOCKET',
  url: 'wss://api.example.com/ws',
  // Optional: inject a socket (required in Node without a WebSocket global)
  createSocket: (url) => new WebSocket(url),
  messageTypePrefix: 'app', // messages become app.entity.operation
})
```

### Message envelope

Outgoing:

```json
{
  "type": "app.message.create",
  "payload": { "text": "Hello WS" },
  "requestId": "message:create:..."
}
```

Expected response (any of):

- Same `requestId` / `id`  
- Matching `type` or `type.success` / `type.error`  
- `status: "error"` or `error` field for failures  

### Demo socket

`src/websocket/chat-actions.ts` includes an **in-process echo socket** so the demo works without a real server. Swap `createSocket` for a real `WebSocket` (or `ws` package) in production.

### Files

- `src/websocket/chat-actions.ts`  
- `src/websocket/index.ts`  

---

## 4. Custom usage (`src/custom`)

When you only need conventional action names/creators and want full control over async I/O (auth, multi-step flows, non-CRUD APIs):

```ts
import { genActionNames, genPlainActions } from 'react-redux-gen'

const loginActionNames = genActionNames('user', ['logged', 'login', 'logout', 'register'])
const loginActions = genPlainActions('user', ['logged', 'login', 'logout', 'register'])

const login = (user) => (dispatch) => {
  dispatch(loginActions.login.requested())
  return axios
    .post('/authorize/local', user)
    .then((res) => dispatch(loginActions.login.success(res.data)))
    .catch((err) => dispatch(loginActions.login.error(err)))
}
```

Reducer using named types:

```ts
switch (action.type) {
  case loginActionNames.login.requested:
    return { ...state, completed: action.completed }
  case loginActionNames.login.success:
    return { ...state, completed: action.completed, data: action.data, error: false }
  case loginActionNames.login.error:
    return { ...state, completed: action.completed, error: action.error }
  // ...
}
```

### Files

- `src/custom/auth-actions.ts` — plain actions + custom thunks  
- `src/custom/auth-reducer.ts` — hand-written reducer  
- `src/custom/index.ts` — demo runner  

This mirrors the original library README auth example, updated for **named** lifecycle access.

---

## Wiring into a real React app

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit' // or createStore + thunk
import { userReducer } from './rest/user-actions'

export const store = configureStore({
  reducer: { user: userReducer },
})
```

```tsx
// UserList.tsx
import { useDispatch, useSelector } from 'react-redux'
import { userAsyncActions } from './rest/user-actions'
import { useEffect } from 'react'

export function UserList() {
  const dispatch = useDispatch()
  const { data, completed, error } = useSelector((s) => s.user)

  useEffect(() => {
    dispatch(userAsyncActions.list() as never)
  }, [dispatch])

  if (!completed) return <p>Loading…</p>
  if (error) return <p>Error</p>
  return <ul>{/* map data */}</ul>
}
```

---

## Project layout

```
examples/
  package.json
  README.md                 ← this file
  src/
    shared/
      store.ts              ← demo Redux store helper
    rest/
      user-actions.ts
      index.ts              ← nock mock + runner
    graphql/
      product-actions.ts
      index.ts
    websocket/
      chat-actions.ts
      index.ts
    custom/
      auth-actions.ts
      auth-reducer.ts
      index.ts
    run-all.ts
```

Offline HTTP demos use [nock](https://github.com/nock/nock) so requests from the library’s axios never hit the network.

---

## Tips

1. **One protocol per client** — create separate clients if a monorepo mixes REST and GraphQL.  
2. **Prefer named access** — `actions.create.success(data)` is clearer in reviews and refactors.  
3. **Custom types/states** — pass `types` / `states` into `createClient` options or generator functions.  
4. **Headers** — set once on the client; REST/GraphQL attach them to every request.  
5. **Testing** — inject `createSocket` for WebSocket and mock `axios` for REST/GraphQL (see library `tests/`).  

For library API details and how to add a new adapter, see the root [README.md](../README.md).
