import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'
import type { UserGroup } from '~/types/userGroup'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'user_group', () =>
    broWorldRequest<UserGroup[]>(event, '/user_group'),
  )
})
