import { readBody } from 'h3'
import { configurationRequest } from '~~/server/utils/configurationApi'
import type { Configuration, ConfigurationPayload } from '~/types/configuration'

export default defineEventHandler(async (event) => {
  const body = await readBody<ConfigurationPayload>(event)
  return await configurationRequest<Configuration>(event, '/configuration', {
    method: 'POST',
    body,
  })
})
