import { broWorldFrontendRequest } from '~~/server/utils/broWorldFrontendApi'
import type { Workplace } from '~/types/workplace'

export default defineEventHandler(async (event) => {
  return await broWorldFrontendRequest<Workplace[]>(event, '/workplaces')
})
