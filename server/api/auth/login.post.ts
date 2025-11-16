import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'
import { persistProfileState } from '../../utils/cache/profile'
import { scheduleProfileCacheWarmup } from '../../utils/cache/profile-warmup'
import { toSessionPayload } from './_shared'

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

    await setUserSession(event, toSessionPayload(data))

    await persistProfileState(event, data.profile)

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
