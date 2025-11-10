import { getQuery } from 'h3'
import { buildQueryString } from '~~/server/utils/apiClient'
import { broWorldMediaRequest } from '~~/server/utils/broWorldMediaApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'
import type { Media } from '~/types/media'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)

  return await fetchAdminList(event, 'media', () =>
    broWorldMediaRequest<Media[]>(event, `/media${queryString}`),
  )
})
