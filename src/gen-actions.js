import axios from 'axios'

const globalTypes = ['create', 'update', 'delete', 'list', 'fetch']
const globalStates = ['REQUESTED', 'SUCCESS', 'ERROR']

const genActionNames = (entity, types, states) => {
  const upperEntity = entity.toUpperCase();
  const actionTypes = types || globalTypes;
  const stateTypes = states || globalStates
  let actions = {};
  actionTypes.forEach((t) => {
    const typeUpper = t.toUpperCase();
    actions[t] = stateTypes.map(s => {
      const stateNames = s.toUpperCase();
      return `${typeUpper}_${upperEntity}_${stateNames}`, `${typeUpper}_${upperEntity}_${stateNames}`, `${typeUpper}_${upperEntity}_${stateNames}`;
    });
  });
  return actions;
}

const genPlainActions = (entity, types, states) => {
  const actionNames = genActionNames(entity, types, states)
  let actionCreators = []

  Object.keys(actionNames).forEach(key => {
    actionCreators[key] = actionNames[key].map((item, index) => {
        let action;
        switch(index) {
          case 0:
            action = new Function(`return { type: '${item}', completed: false }`)
            break;
          case 1:
            action = new Function('data', `return { type: '${item}', completed: true, error: false, data: data }`)
            break;
          case 2:
            action = new Function('error', `return { type: '${item}', completed: true, error: error }`)
            break;
          default:
            action = () => ({ type: 'UNKNOWN' })
            break;
        }
        return action
    })
  })
  return actionCreators
}

const genAsyncActions = (entity, url, headers, types, states) => {
  const generatedActions = genPlainActions(entity, types, states)
  let actions = {}
  const methodKeys = {'create': 'post', 'update': 'update', 'delete': 'delete', 'list': 'get', 'fetch': 'get'}
  Object.keys(generatedActions).forEach(key => {
    actions[key] = (data, params) => {
      return (dispatch) => { 
        dispatch(generatedActions[key][0]())
        return axios({
          method: methodKeys[key],
          headers,
          data: key === 'create' ? data : {},
          params: key === 'update' ? params : {},
          url: key === 'fetch' || key === 'update' || key === 'delete' ? `${url}/${data}` : url
        }).then(response => {
          return dispatch(generatedActions[key][1](response.data))
        }).catch( e => {
          return dispatch(generatedActions[key][2](e))
        })
      }
    }
  });
  return actions
}

export { genActionNames, genPlainActions, genAsyncActions };