import axios from 'axios'

const genieActionNames = (entity, types, states) => {
  const upperEntity = entity.toUpperCase();
  const actionTypes = types || ['create', 'update', 'delete', 'list', 'fetch'];
  const stateTypes = states || ['REQUESTED', 'SUCCESS', 'ERROR']
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

const genieActions = (entity) => {
  const actionNames = genieActionNames(entity)
  let actionCreators = []

  Object.keys(actionNames).forEach(key => {
    actionCreators.push(actionNames[key].map((item, index) => {
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
    }))
  })
  return Array.prototype.concat.apply([], actionCreators)
}

const genThunks = (entity, url) => {
  const generatedActions = genieActions(entity)
  let actions = {}
  actions['create'] = () => {
    return (dispatch) => { 
      dispatch(generatedActions[0]())
      return axios.post(url).then(response => {
        return dispatch(generatedActions[1](response.data))
      }).catch( e => {
        return dispatch(generatedActions[2](e))
      })
    }
  }
  actions['update'] = () => {
    return (dispatch) => { 
      dispatch(generatedActions[3]())
      return axios.put(url).then(response => {
        return dispatch(generatedActions[4](response.data))
      }).catch( e => {
        return dispatch(generatedActions[5](e))
      })
    }
  }
  actions['delete'] = () => {
    return (dispatch) => { 
      dispatch(generatedActions[6]())
      return axios.put(url).then(response => {
        return dispatch(generatedActions[7](response.data))
      }).catch( e => {
        return dispatch(generatedActions[8](e))
      })
    }
  }
  actions['list'] = () => {
    return (dispatch) => { 
      dispatch(generatedActions[9]())
      return axios.get(url).then(response => {
        return dispatch(generatedActions[10](response.data))
      }).catch( e => {
        return dispatch(generatedActions[11](e))
      })
    }
  }
  actions['fetch'] = () => {
    return (dispatch) => { 
      dispatch(generatedActions[12]())
      return axios.get(url).then(response => {
        return dispatch(generatedActions[13](response.data))
      }).catch( e => {
        return dispatch(generatedActions[14](e))
      })
    }
  }
  return actions
}

export { genieActionNames, genieActions, genThunks };