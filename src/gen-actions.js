import axios from 'axios'

const globalTypes = ['create', 'update', 'delete', 'list', 'fetch']
const globalStates = ['REQUESTED', 'SUCCESS', 'ERROR']

const genieActionNames = (entity, types, states) => {
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

const geniePlainActions = (entity, types, states) => {
  const actionNames = genieActionNames(entity, types, states)
  let actionCreators = []

  Object.keys(actionNames).forEach(key => {
    actionCreators[key] = actionNames[key].map((item, index) => {
        let action;
        switch(index) {
          case 0:
            action = new Function(`return { type: '${item}', completed: false }`)
            break;
          case 1:
            action = new Function('data', `return { type: '${item}', completed: true, error: false, data }`)
            break;
          case 2:
            action = new Function('error', `return { type: '${item}', completed: true, error }`)
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

const genAsyncActions = (entity, url, types, states) => {
  const generatedActions = geniePlainActions(entity, types, states)
  let actions = {}
  Object.keys(generatedActions).forEach(key => {
    actions[key] = () => {
      return (dispatch) => { 
        dispatch(generatedActions[key][0]())
        return axios.post(url).then(response => {
          return dispatch(generatedActions[key][1](response.data))
        }).catch( e => {
          return dispatch(generatedActions[key][2](e))
        })
      }
    }
  });
  return actions
}

export { genieActionNames, geniePlainActions, genAsyncActions };