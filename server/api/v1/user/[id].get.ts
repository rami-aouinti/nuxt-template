import type { User } from '~/types/user'
import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'utilisateur")

  return await broWorldRequest<User>(event, `/user/${id}`)
})
