import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {Workplace} from "~/types/workplace";

export default defineEventHandler(async (event) => {
  return await broWorldRequest<Workplace[]>(event, '/workplace')
})
