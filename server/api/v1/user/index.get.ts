import type { User } from '~/types/user'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'user', () =>
    broWorldRequest<User[]>(event, '/user'),
  )
})
