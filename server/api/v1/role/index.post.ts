import type { Role, RolePayload } from '~/types/role'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const body = await readBody<RolePayload>(event)

  return await broWorldRequest<Role>(event, '/role', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
})
