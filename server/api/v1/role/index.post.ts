import type { Role, RolePayload } from '~/types/role'
import { requestWithJsonBody } from '~~/server/utils/crud'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<RolePayload>(event)

  const response = await requestWithJsonBody<Role, RolePayload>(
    event,
    '/role',
    'POST',
    body,
  )

  await invalidateAdminCollection('role')

  return response
})
