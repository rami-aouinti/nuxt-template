import type { Role } from '~/types/role'
import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const { getList } = createAdminCrudHandlers<Role>({
  resource: 'role',
  path: '/role',
  entityLabel: 'du rôle',
})

export default getList
