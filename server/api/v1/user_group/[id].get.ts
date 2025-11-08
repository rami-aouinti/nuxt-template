import type { UserGroup } from '~/types/userGroup'
import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "du groupe d'utilisateurs")

  return await fetchAdminDetail(event, 'user_group', id, () =>
    broWorldRequest<UserGroup>(event, `/user_group/${id}`),
  )
})
