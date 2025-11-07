import type { Role, RolePayload } from '~/types/role'
import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  const body = await readBody<RolePayload>(event)

  return await requestWithJsonBody<Role, RolePayload>(event, `/role/${id}`, 'PUT', body)
})
