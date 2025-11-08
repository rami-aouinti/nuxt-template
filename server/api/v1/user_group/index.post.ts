import { requestWithJsonBody } from '~~/server/utils/crud'
import type { UserGroup, UserGroupPayload } from '~/types/userGroup'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<UserGroupPayload>(event)

  const response = await requestWithJsonBody<UserGroup, UserGroupPayload>(
    event,
    '/user_group',
    'POST',
    body,
  )

  await invalidateAdminCollection('user_group')

  return response
})
