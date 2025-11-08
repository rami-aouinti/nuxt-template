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
