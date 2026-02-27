import type { Role, RolePayload } from '~/types/role'
import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const { post } = createAdminCrudHandlers<Role, RolePayload>({
  resource: 'role',
  path: '/role',
  entityLabel: 'du rôle',
})

export default post
