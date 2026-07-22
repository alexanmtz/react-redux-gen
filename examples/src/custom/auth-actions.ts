import axios from 'axios'
import {
  genActionNames,
  genPlainActions,
  type NamedStateActionCreators,
} from 'react-redux-gen'

/**
 * Custom usage: only plain actions + hand-written thunks
 * (same pattern as the original login/auth README example).
 *
 * Named access (new API):
 *   actions.login.requested()
 *   actions.login.success(data)
 *   actions.login.error(err)
 *
 * Previously this was actions.login[0], [1], [2].
 */

const host = 'https://api.example.com'

export const loginActionNames = genActionNames('user', [
  'logged',
  'login',
  'logout',
  'register',
])

export const loginActions = genPlainActions('user', [
  'logged',
  'login',
  'logout',
  'register',
])

const getHeaders = () => ({
  Authorization: 'Bearer demo-token',
  'Content-Type': 'application/json',
})

type Thunk = (dispatch: (a: unknown) => unknown) => Promise<unknown>

function withLifecycle(
  creators: NamedStateActionCreators,
  run: () => Promise<unknown>
): Thunk {
  return (dispatch) => {
    dispatch(creators.requested())
    return run()
      .then((data) => dispatch(creators.success(data)))
      .catch((error: unknown) => dispatch(creators.error(error)))
  }
}

export const logged = (): Thunk =>
  withLifecycle(loginActions.logged, () =>
    axios.get(`${host}/authenticated`, { headers: getHeaders() }).then((r) => r.data)
  )

export const login = (user: { email: string; password: string }): Thunk =>
  withLifecycle(loginActions.login, () =>
    axios.post(`${host}/authorize/local`, user).then((r) => r.data)
  )

export const logout = (): Thunk => {
  return (dispatch) => {
    dispatch(loginActions.logout.requested())
    try {
      // Simulate Auth.deauthenticateUser()
      const ok = true
      if (ok) {
        return Promise.resolve(dispatch(loginActions.logout.success({})))
      }
      return Promise.resolve(
        dispatch(
          loginActions.logout.error(
            new Error('we have an error to logout, try again later')
          )
        )
      )
    } catch (e) {
      return Promise.resolve(dispatch(loginActions.logout.error(e)))
    }
  }
}

export const register = (user: { email: string; password: string; name: string }): Thunk =>
  withLifecycle(loginActions.register, () =>
    axios.post(`${host}/auth/register`, user).then((r) => r.data)
  )
