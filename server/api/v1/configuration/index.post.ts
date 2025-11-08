import { readBody } from 'h3'
import { configurationRequest } from '~~/server/utils/configurationApi'
import type { Configuration, ConfigurationPayload } from '~/types/configuration'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<ConfigurationPayload>(event)
  const response = await configurationRequest<Configuration>(
    event,
    '/configuration',
    {
      method: 'POST',
      body,
    },
  )

  await invalidateAdminCollection('configuration')

  return response
})
