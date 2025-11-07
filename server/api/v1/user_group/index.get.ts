import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {UserGroup} from "~/types/userGroup";

export default defineEventHandler(async (event) => {
  return await broWorldRequest<UserGroup[]>(event, '/user_group')
})
