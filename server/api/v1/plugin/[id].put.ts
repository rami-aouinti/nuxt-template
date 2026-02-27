import type { AdminPlugin, AdminPluginPayload } from '~/types/plugin'
import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const { put } = createAdminCrudHandlers<AdminPlugin, AdminPluginPayload>({
  resource: 'plugin',
  path: '/plugin',
  entityLabel: 'du plugin',
})

export default put
