import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const { del } = createAdminCrudHandlers({
  resource: 'plugin',
  path: '/plugin',
  entityLabel: 'du plugin',
  deleteReturnsResponse: true,
})

export default del
