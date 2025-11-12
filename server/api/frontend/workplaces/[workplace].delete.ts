import { createError, getRouterParam } from 'h3'
import { broWorldFrontendRequest } from '~~/server/utils/broWorldFrontendApi'
import { invalidateUserWorkplaces } from '~~/server/utils/cache/workplace'

export default defineEventHandler(async (event) => {
  const workplace = getRouterParam(event, 'workplace')

  if (!workplace) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Workplace identifier is required' },
    })
  }

  const response = await broWorldFrontendRequest<unknown>(
    event,
    `/workplaces/${encodeURIComponent(workplace)}`,
    {
      method: 'DELETE',
    },
  )

  await invalidateUserWorkplaces(event)

  return response
})
