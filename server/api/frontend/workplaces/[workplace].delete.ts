import { createError, getRouterParam } from 'h3'
import { broWorldFrontendRequest } from '~~/server/utils/broWorldFrontendApi'

export default defineEventHandler(async (event) => {
  const workplace = getRouterParam(event, 'workplace')

  if (!workplace) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Workplace identifier is required' },
    })
  }

  return await broWorldFrontendRequest<unknown>(
    event,
    `/workplaces/${encodeURIComponent(workplace)}`,
    {
      method: 'DELETE',
    },
  )
})
