import type { User, UserPayload } from '~/types/user'
import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import { invalidateAdminDetail, invalidateAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'utilisateur")

  const body = await readBody<UserPayload>(event)

  const response = await requestWithJsonBody<User, UserPayload>(
    event,
    `/user/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateAdminDetail('user', id),
    invalidateAdminList('user'),
  ])

  return response
})
