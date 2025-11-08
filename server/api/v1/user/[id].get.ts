import type { User } from '~/types/user'
import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'utilisateur")

  return await fetchAdminDetail(event, 'user', id, () =>
    broWorldRequest<User>(event, `/user/${id}`),
  )
})
