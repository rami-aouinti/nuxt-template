import type { User } from '~/types/user'
import { createAdminCrudHandlers } from '~~/server/utils/routeFactory'

const { getDetail } = createAdminCrudHandlers<User>({
  resource: 'user',
  path: '/user',
  entityLabel: "de l'utilisateur",
})

export default getDetail
