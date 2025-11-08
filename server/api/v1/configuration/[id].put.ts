import { getRouterParam, readBody } from 'h3'
import { configurationRequest } from '~~/server/utils/configurationApi'
import type { Configuration, ConfigurationPayload } from '~/types/configuration'
import {
  invalidateAdminDetail,
  invalidateAdminList,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing configuration identifier',
    })
  }

  const body = await readBody<ConfigurationPayload>(event)

  const response = await configurationRequest<Configuration>(
    event,
    `/configuration/${id}`,
    {
      method: 'PUT',
      body,
    },
  )

  await Promise.all([
    invalidateAdminDetail('configuration', id),
    invalidateAdminList('configuration'),
  ])

  return response
})
