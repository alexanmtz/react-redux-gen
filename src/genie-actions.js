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
            action = new Function(`return { type: '${item}', completed: true, error: false }`)
            if(key === 'list') {
              action = new Function('data', `return { type: '${item}', completed: true, error: false, data }`)
            }
            if(key === 'fetch') {
              action = new Function('data', `return { type: '${item}', completed: true, error: false, data }`)
            }
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

export { genieActionNames, genieActions };