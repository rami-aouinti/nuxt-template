import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type {Workplace, WorkplacePayload} from "~/types/workplace";

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  const body = await readBody<WorkplacePayload>(event)

  return await requestWithJsonBody<Workplace, WorkplacePayload>(event, `/workplace/${id}`, 'PUT', body)
})
