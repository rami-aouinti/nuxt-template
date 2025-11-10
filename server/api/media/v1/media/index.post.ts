import { readBody } from 'h3'

import type { Media, MediaPayload } from '~/types/media'
import { requestMediaWithJsonBody } from '~~/server/utils/crud'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<MediaPayload>(event)

  const response = await requestMediaWithJsonBody<Media, MediaPayload>(
    event,
    '/media',
    'POST',
    body,
  )

  await invalidateAdminCollection('media')

  return response
})
