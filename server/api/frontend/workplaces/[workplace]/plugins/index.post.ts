import { createError, getRouterParam } from 'h3'
import { invalidateUserWorkplaces } from '~~/server/utils/cache/workplace'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
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

  const response = await broWorldRequest<Workplace>(
    event,
    `/frontend/workplaces/${encodeURIComponent(workplace)}/plugins`,
    {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    },
  )

  await invalidateUserWorkplaces(event)

  return response
})
