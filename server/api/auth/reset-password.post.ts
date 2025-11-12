import { randomUUID } from 'node:crypto'

import { axios, AxiosError } from '~/utils/axios'

interface ResetPasswordPayload {
  email?: string
  password?: string
  confirmPassword?: string
  token?: string
}

interface ResetPasswordResponse {
  message?: string
  [key: string]: unknown
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ResetPasswordPayload>(event)

  if (!body?.email || !body.password || !body.confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid payload',
      data: {
        message: 'Email, password, and confirmation are required.',
      },
    })
  }

  const token =
    body.token && body.token.trim().length > 0 ? body.token : randomUUID()

  try {
    const { data } = await axios.post<ResetPasswordResponse>(
      'https://bro-world.org/api/v1/auth/reset-password',
      {
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        token,
      },
    )

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
        'Password reset failed'

      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: 'Password reset failed',
        data: { message },
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Password reset failed',
      data: { message: 'Unable to reset the password.' },
    })
  }
})
