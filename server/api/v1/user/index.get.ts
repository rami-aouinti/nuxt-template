import type { User } from '~/types/user'
import { broWorldRequest } from '~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  return await broWorldRequest<User[]>(event, '/user')
})
