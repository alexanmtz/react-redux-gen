import { genActionNames } from './gen-actions'

const genReducer = (entity, initialState) => {
  const actions = genActionNames(entity)
  return (state = initialState, action) => {
    switch (action.type) {
      case actions['create'][0]:
        return { ...state, error: false, completed: action.completed }
      case actions['create'][1]:
          return { ...state, error: false, completed: action.completed, data: action.data }
      case actions['create'][2]:
          return { ...state, error: action.error, completed: action.completed }
      case actions['update'][0]:
          return { ...state, error: false, completed: action.completed }
      case actions['update'][1]:
          return { ...state, error: false, completed: action.completed, data: action.data }
      case actions['update'][2]:
          return { ...state, error: action.error, completed: action.completed }
      case actions['delete'][0]:
          return { ...state, error: false, completed: action.completed }
      case actions['delete'][1]:
          return { ...state, error: false, completed: action.completed, data: action.data }
      case actions['delete'][2]:
          return { ...state, error: action.error, completed: action.completed }   
      case actions['list'][0]:
          return { ...state, error: false, completed: action.completed }
      case actions['list'][1]:
          return { ...state, error: false, completed: action.completed, data: action.data }
      case actions['list'][2]:
          return { ...state, error: action.error, completed: action.completed }
      case actions['fetch'][0]:
          return { ...state, error: false, completed: action.completed }
      case actions['fetch'][1]:
          return { ...state, error: false, completed: action.completed, data: action.data }
      case actions['fetch'][2]:
          return { ...state, error: action.error, completed: action.completed }
      default:
        return state
    }
  }
}

export { genReducer }