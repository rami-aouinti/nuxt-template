import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const { del } = createAdminCrudHandlers({
  resource: 'role',
  path: '/role',
  entityLabel: 'du rôle',
})

export default del
