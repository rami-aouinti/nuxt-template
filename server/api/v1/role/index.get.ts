import type { Role } from '~/types/role'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'role', () =>
    broWorldRequest<Role[]>(event, '/role'),
  )
})
