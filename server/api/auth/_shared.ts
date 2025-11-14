import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'
import { persistProfileState } from '../../utils/cache/profile'

const DEFAULT_AVATAR_URL = 'https://bro-world-space.com/img/person.png'
const AUTHENTICATION_FAILED = 'Authentication failed'
const AUTHENTICATION_FALLBACK_MESSAGE =
  'Unable to authenticate with the provided credentials.'

const getErrorMessage = (error: AxiosError<{ message?: string }>) =>
  (error.response?.data &&
  typeof error.response.data === 'object' &&
  'message' in error.response.data &&
  typeof error.response.data.message === 'string'
    ? error.response.data.message
    : null) ||
  error.response?.statusText ||
  AUTHENTICATION_FAILED

export const toSessionPayload = (data: LoginResponse) => ({
  user: {
    login: data.profile.username,
    avatar_url:
      (typeof data.profile.photo === 'string' && data.profile.photo) ||
      DEFAULT_AVATAR_URL,
  },
  token: data.token,
  ecommerceAdminToken: data.ecommerceAdminToken || undefined,
  ecommerceShopToken: data.ecommerceShopToken || undefined,
  profile: {
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
    address: data.profile.profile.address,
  },
})

export const createOAuthHandler = (verifyUrl: string) => ({
  async onSuccess(event: any, { user }: { user: Record<string, unknown> }) {
    try {
      const { data } = await axios.post<LoginResponse>(verifyUrl, user)

      await setUserSession(event, toSessionPayload(data))

      await persistProfileState(event, data.profile)

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw createError({
          statusCode: error.response?.status || 500,
          statusMessage: AUTHENTICATION_FAILED,
          data: { message: getErrorMessage(error) },
        })
      }

      throw createError({
        statusCode: 500,
        statusMessage: AUTHENTICATION_FAILED,
        data: {
          message: AUTHENTICATION_FALLBACK_MESSAGE,
        },
      })
    }
  },
})
