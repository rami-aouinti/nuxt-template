import type { User, UserPayload } from '~/types/user'
import { requestWithJsonBody } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const body = await readBody<UserPayload>(event)

  return await requestWithJsonBody<User, UserPayload>(event, '/user', 'POST', body)
})
