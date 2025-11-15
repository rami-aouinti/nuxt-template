import { createError, getRouterParam } from 'h3'
import { invalidateUserWorkplaces } from '~~/server/utils/cache/workplace'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type { Workplace, WorkplaceMemberPayload } from '~/types/workplace'

export default defineEventHandler(async (event) => {
  const workplace = getRouterParam(event, 'workplace')

  if (!workplace) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Workplace identifier is required' },
    })
  }

  const body = await readBody<WorkplaceMemberPayload>(event)

  const response = await broWorldRequest<Workplace>(
    event,
    `/frontend/workplaces/${encodeURIComponent(workplace)}/members`,
    {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    },
  )

  await invalidateUserWorkplaces(event)

  return response
})
