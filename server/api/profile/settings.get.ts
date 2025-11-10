import type { Configuration } from '~/types/configuration'
import { configurationRequest } from '~~/server/utils/configurationApi'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return await configurationRequest<Configuration[]>(
    event,
    '/platform/configuration',
    {
      method: 'GET',
    },
  )
})
