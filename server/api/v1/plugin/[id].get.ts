import type { AdminPlugin } from '~/types/plugin'
import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const { getDetail } = createAdminCrudHandlers<AdminPlugin>({
  resource: 'plugin',
  path: '/plugin',
  entityLabel: 'du plugin',
})

export default getDetail
