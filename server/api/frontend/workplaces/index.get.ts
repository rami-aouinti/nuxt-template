import { broWorldFrontendRequest } from '~~/server/utils/broWorldFrontendApi'
import { fetchUserWorkplaces } from '~~/server/utils/cache/workplace'
import type { Workplace } from '~/types/workplace'

export default defineEventHandler(async (event) => {
  return await fetchUserWorkplaces(event, () =>
    broWorldFrontendRequest<Workplace[]>(event, '/workplaces'),
  )
})
