import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'
import { persistProfileState } from '../../utils/cache/profile'
import { toSessionPayload } from './_shared'

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    try {
      const { data } = await axios.post<LoginResponse>(
        'https://bro-world.org/api/v1/user/github/verify',
        user,
      )

      await setUserSession(event, toSessionPayload(data))

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
  },
})
