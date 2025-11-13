import { defineEventHandler, readBody, createError } from 'h3'
import { axios, AxiosError } from '~/utils/axios'

type VerificationCredentials = {
  email?: string
  password?: string
}

type VerificationResponse = {
  success: boolean
  message?: string
  credentials?: VerificationCredentials | null
  [key: string]: unknown
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string }>(event)

  if (!body?.token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing token in request body',
    })
  }

  try {
    const { data } = await axios.post<Any>(
      'https://bro-world.org/api/v1/auth/verification_email',
      {
        token: body.token,
      },
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status ?? 500
      const statusMessage =
        error.response?.data && typeof error.response.data === 'object'
          ? ((error.response.data as Record<string, unknown>).message as
              string | undefined) ?? error.response?.statusText ??
            'Failed to verify email'
          : error.response?.statusText ?? 'Failed to verify email'

      throw createError({
        statusCode,
        statusMessage,
        data: error.response?.data ?? null,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to verify email',
    })
  }
})
