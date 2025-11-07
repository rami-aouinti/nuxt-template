import type { User, UserPayload } from '~/types/user'
import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'utilisateur")

  const body = await readBody<UserPayload>(event)

  return await requestWithJsonBody<User, UserPayload>(event, `/user/${id}`, 'PUT', body)
})
