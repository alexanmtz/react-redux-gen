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

export { genieActionsNames };