import type { Role } from '~/types/role'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  return await broWorldRequest<Role[]>(event, '/role')
})
