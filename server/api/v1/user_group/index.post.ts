import { requestWithJsonBody } from '~~/server/utils/crud'
import type { UserGroup, UserGroupPayload } from '~/types/userGroup'

export default defineEventHandler(async (event) => {
  const body = await readBody<UserGroupPayload>(event)

  return await requestWithJsonBody<UserGroup, UserGroupPayload>(
    event,
    '/user_group',
    'POST',
    body,
  )
})
