import { createError, getRouterParam } from 'h3'
import { broWorldFrontendRequest } from '~~/server/utils/broWorldFrontendApi'
import type { Workplace } from '~/types/workplace'

export default defineEventHandler(async (event) => {
  const workplace = getRouterParam(event, 'workplace')

  if (!workplace) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Workplace identifier is required' },
    })
  }

  return await broWorldFrontendRequest<Workplace>(
    event,
    `/workplaces/${encodeURIComponent(workplace)}`,
  )
})
