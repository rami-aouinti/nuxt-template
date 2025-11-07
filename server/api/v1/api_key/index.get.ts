import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {ApiKey} from "~/types/apiKey";

export default defineEventHandler(async (event) => {
  return await broWorldRequest<ApiKey[]>(event, '/api_key')
})
