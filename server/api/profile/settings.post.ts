import type { Configuration } from '~/types/configuration'
import { configurationRequest } from '~~/server/utils/configurationApi'

interface ProfileSettingsPayload {
  configurationKey?: string
  contextKey?: string
  contextId?: string
  workplaceId?: string
  configurationValue?: unknown
}

function assertString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody<ProfileSettingsPayload | null>(event)

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Invalid configuration payload provided.' },
    })
  }

  const { configurationKey, contextKey, contextId, workplaceId, configurationValue } = body

  if (
    !assertString(configurationKey) ||
    !assertString(contextKey) ||
    !assertString(contextId) ||
    !assertString(workplaceId) ||
    configurationValue === undefined
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Missing configuration identifiers or value.' },
    })
  }

  return await configurationRequest<Configuration>(
    event,
    '/v1/platform/configuration',
    {
      method: 'POST',
      body: {
        configurationKey,
        contextKey,
        contextId,
        workplaceId,
        configurationValue,
      },
    },
  )
})
