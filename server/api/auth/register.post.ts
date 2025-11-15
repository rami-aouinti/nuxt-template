import { defineEventHandler, readBody, createError } from 'h3'
import { axios } from '~/utils/axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password, repeatPassword } = body || {}

  if (!email || !password || !repeatPassword) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  try {
    const response = await axios.post(
      'https://bro-world.org/api/v1/auth/register',
      {
        email,
        password,
        repeatPassword,
      },
    )

    return !!response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Registration failed',
    })
  }
})
