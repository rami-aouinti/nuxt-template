import { readBody } from 'h3'

import type { Media, MediaPayload } from '~/types/media'
import { requestMediaWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du média')
  const body = await readBody<MediaPayload>(event)

  const response = await requestMediaWithJsonBody<Media, MediaPayload>(
    event,
    `/media/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateAdminDetail('media', id),
    invalidateAdminCollection('media'),
  ])

  return response
})
