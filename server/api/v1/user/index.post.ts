import type { User, UserPayload } from '~/types/user'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const body = await readBody<UserPayload>(event)

  return await broWorldRequest<User>(event, '/user', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
})
