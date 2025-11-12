import { createError, getRouterParam } from 'h3'
import { invalidateUserWorkplaces } from '~~/server/utils/cache/workplace'
import { requestFrontendWithJsonBody } from '~~/server/utils/crud'
import type { Workplace, WorkplacePluginPayload } from '~/types/workplace'

export default defineEventHandler(async (event) => {
  const workplace = getRouterParam(event, 'workplace')

  if (!workplace) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Workplace identifier is required' },
    })
  }

  const body = await readBody<WorkplacePluginPayload>(event)

  const response = await requestFrontendWithJsonBody<Workplace, WorkplacePluginPayload>(
    event,
    `/workplaces/${encodeURIComponent(workplace)}/plugins`,
    'DELETE',
    body,
  )

  await invalidateUserWorkplaces(event)

  return response
})
