import { requireEntityId } from '~~/server/utils/crud'
import { broWorldMediaRequest } from '~~/server/utils/broWorldMediaApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import type { Media } from '~/types/media'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du média')

  return await fetchAdminDetail(event, 'media', id, () =>
    broWorldMediaRequest<Media>(event, `/media/${id}`),
  )
})
