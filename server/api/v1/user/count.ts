import { broWorldRequest } from '~~/server/utils/broWorldApi'
import {Count} from "~/types/count";

export default defineEventHandler(async (event) => {
  return await broWorldRequest<Count>(event, '/user/count')
})
