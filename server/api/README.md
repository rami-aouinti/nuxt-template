# API route factory (admin v1)

Pour les routes CRUD standards, utiliser `createAdminCrudHandlers` afin d'appliquer les mêmes conventions partout:

- validation de `:id` (`requireEntityId`)
- appel API via `broWorldRequest`
- hooks cache admin (`fetchAdminList`, `fetchAdminDetail`, invalidation list/detail/collection)

## Exemple avant / après

### Avant (`GET /role/:id`)

```ts
import type { Role } from '~/types/role'
import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  return await fetchAdminDetail(event, 'role', id, () =>
    broWorldRequest<Role>(event, `/role/${id}`),
  )
})
```

### Après (`GET /role/:id`)

```ts
import type { Role } from '~/types/role'
import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const { getDetail } = createAdminCrudHandlers<Role>({
  resource: 'role',
  path: '/role',
  entityLabel: 'du rôle',
})

export default getDetail
```

## Recette CRUD complète

```ts
import type { Role, RolePayload } from '~/types/role'
import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const handlers = createAdminCrudHandlers<Role, RolePayload>({
  resource: 'role',
  path: '/role',
  entityLabel: 'du rôle',
})

export const listHandler = handlers.getList // GET /role
export const detailHandler = handlers.getDetail // GET /role/:id
export const createHandler = handlers.post // POST /role
export const updateHandler = handlers.put // PUT /role/:id
export const deleteHandler = handlers.del // DELETE /role/:id
```

## Convention DELETE

- par défaut, `del` renvoie `{ success: true }`
- pour préserver un endpoint existant qui renvoie la réponse backend, activer:

```ts
createAdminCrudHandlers({
  resource: 'plugin',
  path: '/plugin',
  entityLabel: 'du plugin',
  deleteReturnsResponse: true,
})
```
