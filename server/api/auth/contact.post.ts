import { createError, defineEventHandler, readBody } from 'h3'
import { axios } from '~/utils/axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.email || !body?.subject) {
    throw createError({
      statusCode: 400,
      message: 'Missing username or password',
    })
  }

  try {
    const response = await axios.post('https://bro-world.org/api/contact', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
    })

    return response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Login failed',
    })
  }
})
