import type { AdminPlugin, AdminPluginPayload } from '~/types/plugin'
import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import {
  invalidateAdminDetail,
  invalidateAdminList,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du plugin')
  const body = await readBody<AdminPluginPayload>(event)

  const response = await requestWithJsonBody<AdminPlugin, AdminPluginPayload>(
    event,
    `/plugin/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateAdminDetail('plugin', id),
    invalidateAdminList('plugin'),
  ])

  return response
})
