import { requestWithJsonBody } from '~~/server/utils/crud'
import type {Workplace, WorkplacePayload} from "~/types/workplace";

export default defineEventHandler(async (event) => {
  const body = await readBody<WorkplacePayload>(event)

  return await requestWithJsonBody<Workplace, WorkplacePayload>(event, '/workplace', 'POST', body)
})
