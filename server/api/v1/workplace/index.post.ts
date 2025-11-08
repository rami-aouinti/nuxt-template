import { requestWithJsonBody } from '~~/server/utils/crud'
import type { Workplace, WorkplacePayload } from '~/types/workplace'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<WorkplacePayload>(event)

  const response = await requestWithJsonBody<Workplace, WorkplacePayload>(
    event,
    '/workplace',
    'POST',
    body,
  )

  await invalidateAdminCollection('workplace')

  return response
})
