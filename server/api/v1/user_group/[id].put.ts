import type { UserGroup, UserGroupPayload } from '~/types/userGroup'
import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import {
  invalidateAdminDetail,
  invalidateAdminList,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "du groupe d'utilisateurs")

  const body = await readBody<UserGroupPayload>(event)

  const response = await requestWithJsonBody<UserGroup, UserGroupPayload>(
    event,
    `/user_group/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateAdminDetail('user_group', id),
    invalidateAdminList('user_group'),
  ])

  return response
})
