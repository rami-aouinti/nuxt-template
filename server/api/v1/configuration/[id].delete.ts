import { getRouterParam } from 'h3'
import { configurationRequest } from '~~/server/utils/configurationApi'

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

  return { success: true }
})
