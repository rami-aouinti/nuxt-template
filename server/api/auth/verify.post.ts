import { axios, AxiosError } from '~/utils/axios'
import { defineEventHandler, readBody } from 'h3'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.token) {
    throw new Error('Missing token in request body')
  }
  const { data } = await axios.post<LoginResponse>(
    'https://bro-world.org/api/v1/auth/verification_email',
    {
      token: body.token
    },
  )
return data

})
