import type { Role, RolePayload } from '~/types/role'
import { requestWithJsonBody } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const body = await readBody<RolePayload>(event)

  return await requestWithJsonBody<Role, RolePayload>(event, '/role', 'POST', body)
})
