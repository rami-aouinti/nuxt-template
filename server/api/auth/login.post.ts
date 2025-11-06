import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'
import { persistProfileState } from '../../utils/cache/profile'

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

    await setUserSession(event, {
      user: {
        login: data.profile.username,
        avatar_url:
          (typeof data.profile.photo === 'string' && data.profile.photo) ||
          'https://bro-world-space.com/img/person.png',
      },
      token: data.token,
      profile:  {
        username: data.profile.username,
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        email: data.profile.email,
        enabled: data.profile.enabled,
        roles: data.profile.roles,
        title: data.profile.profile.title,
        phone: data.profile.profile.phone,
        birthday: data.profile.profile.birthday,
        gender: data.profile.profile.gender,
        description: data.profile.profile.description,
        address: data.profile.profile.address
      },
    })

    await persistProfileState(event, data.profile)

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
