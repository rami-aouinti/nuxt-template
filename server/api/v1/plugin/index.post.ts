import type { AdminPlugin, AdminPluginPayload } from '~/types/plugin'
import { requestWithJsonBody } from '~~/server/utils/crud'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<AdminPluginPayload>(event)

  const response = await requestWithJsonBody<AdminPlugin, AdminPluginPayload>(
    event,
    '/plugin',
    'POST',
    body,
  )

  await invalidateAdminCollection('plugin')

  return response
})
