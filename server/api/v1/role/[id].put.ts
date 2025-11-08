import type { Role, RolePayload } from '~/types/role'
import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import {
  invalidateAdminDetail,
  invalidateAdminList,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  const body = await readBody<RolePayload>(event)

  const response = await requestWithJsonBody<Role, RolePayload>(
    event,
    `/role/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateAdminDetail('role', id),
    invalidateAdminList('role'),
  ])

  return response
})
