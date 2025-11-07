import type { UserGroup, UserGroupPayload } from '~/types/userGroup'
import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "du groupe d'utilisateurs")

  const body = await readBody<UserGroupPayload>(event)

  return await requestWithJsonBody<UserGroup, UserGroupPayload>(
    event,
    `/user_group/${id}`,
    'PUT',
    body,
  )
})
