import { getRouterParam } from 'h3'
import { configurationRequest } from '~~/server/utils/configurationApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing configuration identifier',
    })
  }

  await configurationRequest(event, `/configuration/${id}`, {
    method: 'DELETE',
  })

  await Promise.all([
    invalidateAdminDetail('configuration', id),
    invalidateAdminCollection('configuration'),
  ])

  return { success: true }
})
