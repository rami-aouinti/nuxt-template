import { getRouterParam } from 'h3'
import { configurationRequest } from '~~/server/utils/configurationApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import type { Configuration } from '~/types/configuration'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing configuration identifier',
    })
  }

  return await fetchAdminDetail(event, 'configuration', id, () =>
    configurationRequest<Configuration>(event, `/configuration/${id}`),
  )
})
