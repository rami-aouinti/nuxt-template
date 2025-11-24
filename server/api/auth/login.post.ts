import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'
import { persistProfileState } from '../../utils/cache/profile'
import { scheduleProfileCacheWarmup } from '../../utils/cache/profile-warmup'
import { ensureDefaultProfileConfigurations } from '../../utils/profileConfiguration'
import { toSessionPayload } from './_shared'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)

  if (!body?.username || !body?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid credentials',
      data: { message: 'Username and password are required.' },
    })
  }

  try {
    const { data } = await axios.post<LoginResponse>(
      'https://bro-world.org/api/v1/auth/login',
      {
        username: body.username,
        password: body.password,
      },
    )

    const runtimeConfig = useRuntimeConfig(event)
    const educationBaseUrl =
      runtimeConfig.public?.educationApiBaseUrl ||
      runtimeConfig.educationApiBaseUrl ||
      'https://education.bro-world.org'

    let educationToken: string | undefined

    try {
      const { token } = await $fetch<{ token: string }>(
        `${educationBaseUrl.replace(/\/+$/, '')}/api/authentication_token`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: {
            username: 'admin',
            password: '19891989aA!',
          },
        },
      )

      educationToken = token
    } catch (error) {
      console.error('Failed to fetch education token after login', error)
    }

    await setUserSession(event, toSessionPayload(data, { educationToken }))

    await persistProfileState(event, data.profile)

    await ensureDefaultProfileConfigurations(event, data.profile)

    scheduleProfileCacheWarmup(event)

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      const message =
        (error.response?.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : null) ||
        error.response?.statusText ||
        'Authentication failed'

      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: 'Authentication failed',
        data: { message },
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed',
      data: {
        message: 'Unable to authenticate with the provided credentials.',
      },
    })
  }
})
