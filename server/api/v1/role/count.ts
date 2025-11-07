import type { Count } from '~/types/count'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  return await broWorldRequest<Count>(event, '/role/count')
})
