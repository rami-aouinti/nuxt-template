import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { Workplace, WorkplacePayload } from '~/types/workplace'
import {
  invalidateAdminDetail,
  invalidateAdminList,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  const body = await readBody<WorkplacePayload>(event)

  const response = await requestWithJsonBody<Workplace, WorkplacePayload>(
    event,
    `/workplace/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateAdminDetail('workplace', id),
    invalidateAdminList('workplace'),
  ])

  return response
})
