import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {UserGroup, UserGroupPayload} from "~/types/userGroup";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserGroupPayload>(event)

  return await broWorldRequest<UserGroup>(event, '/user_group', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
})
