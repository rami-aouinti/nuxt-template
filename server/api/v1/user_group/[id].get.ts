import type { UserGroup } from '~/types/userGroup'
import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "du groupe d'utilisateurs")

  return await broWorldRequest<UserGroup>(event, `/user_group/${id}`)
})
