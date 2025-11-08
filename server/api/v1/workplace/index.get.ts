import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'
import type { Workplace } from '~/types/workplace'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'workplace', () =>
    broWorldRequest<Workplace[]>(event, '/workplace'),
  )
})
