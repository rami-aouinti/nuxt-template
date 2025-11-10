import type { Count } from '~/types/count'
import { broWorldMediaRequest } from '~~/server/utils/broWorldMediaApi'
import { fetchAdminCount } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminCount(event, 'media', () =>
    broWorldMediaRequest<Count>(event, '/media/count'),
  )
})
