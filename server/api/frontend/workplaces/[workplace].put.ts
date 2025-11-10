import { createError, getRouterParam } from 'h3'
import { requestFrontendWithJsonBody } from '~~/server/utils/crud'
import type {
  FrontendWorkplaceUpdatePayload,
  Workplace,
} from '~/types/workplace'

export default defineEventHandler(async (event) => {
  const workplace = getRouterParam(event, 'workplace')

  if (!workplace) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Workplace identifier is required' },
    })
  }

  const body = await readBody<FrontendWorkplaceUpdatePayload>(event)

  return await requestFrontendWithJsonBody<
    Workplace,
    FrontendWorkplaceUpdatePayload
  >(event, `/workplaces/${encodeURIComponent(workplace)}`, 'PUT', body)
})
