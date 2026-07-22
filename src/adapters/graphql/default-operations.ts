import type { GraphQLOperationMap } from './types'

/**
 * Build default GraphQL documents for list / get / create / update / delete.
 * Entity name is capitalized for type names and pluralized simply with 's' for lists.
 */
export function buildDefaultOperations(
  entity: string,
  selection = 'id'
): GraphQLOperationMap {
  const capital = entity.charAt(0).toUpperCase() + entity.slice(1)
  const plural = `${entity}s`

  return {
    list: `query List${capital}s { ${plural} { ${selection} } }`,
    fetch: `query Get${capital}($id: ID!) { ${entity}(id: $id) { ${selection} } }`,
    create: `mutation Create${capital}($input: ${capital}Input!) { create${capital}(input: $input) { ${selection} } }`,
    update: `mutation Update${capital}($id: ID!, $input: ${capital}Input!) { update${capital}(id: $id, input: $input) { ${selection} } }`,
    delete: `mutation Delete${capital}($id: ID!) { delete${capital}(id: $id) { ${selection} } }`,
  }
}
