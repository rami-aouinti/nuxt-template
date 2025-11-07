import { getRouterParam, readBody } from 'h3'
import { configurationRequest } from '~~/server/utils/configurationApi'
import type { Configuration, ConfigurationPayload } from '~/types/configuration'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing configuration identifier',
    })
  }

  const body = await readBody<ConfigurationPayload>(event)

  return await configurationRequest<Configuration>(event, `/configuration/${id}`, {
    method: 'PUT',
    body,
  })
})
