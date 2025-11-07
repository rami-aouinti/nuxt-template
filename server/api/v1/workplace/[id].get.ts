import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {Workplace} from "~/types/workplace";

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  return await broWorldRequest<Workplace>(event, `/workplace/${id}`)
})
