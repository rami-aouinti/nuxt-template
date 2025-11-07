import type { Role } from '~/types/role'
import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  return await broWorldRequest<Role>(event, `/role/${id}`)
})
