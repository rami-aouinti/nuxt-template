import type { User, UserPayload } from '~/types/user'
import { requestWithJsonBody } from '~~/server/utils/crud'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<UserPayload>(event)

  const response = await requestWithJsonBody<User, UserPayload>(
    event,
    '/user',
    'POST',
    body,
  )

  await invalidateAdminCollection('user')

  return response
})
