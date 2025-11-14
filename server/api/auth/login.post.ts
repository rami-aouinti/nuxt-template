import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'
import { persistProfileState } from '../../utils/cache/profile'
import { scheduleProfileCacheWarmup } from '../../utils/cache/profile-warmup'

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

    const email =
      (typeof data.profile.email === 'string' && data.profile.email.trim()) ||
      body.username.trim()

    type EcommerceTokenResponse = { token: string }

    const [adminTokenResponse, shopTokenResponse] = await Promise.all([
      axios.post<EcommerceTokenResponse>(
        'https://ecommerce.bro-world.org/api/v2/admin/administrators/token',
        {
          email,
          password: body.password,
        },
      ),
      axios.post<EcommerceTokenResponse>(
        'https://ecommerce.bro-world.org/api/v2/shop/customers/token',
        {
          email,
          password: body.password,
        },
      ),
    ])

    const loginResponse: LoginResponse = {
      ...data,
      ecommerceAdminToken: adminTokenResponse.data.token,
      ecommerceShopToken: shopTokenResponse.data.token,
    }

    await setUserSession(event, {
      user: {
        login: loginResponse.profile.username,
        avatar_url:
          (typeof loginResponse.profile.photo === 'string' &&
          loginResponse.profile.photo) ||
          'https://bro-world-space.com/img/person.png',
      },
      token: loginResponse.token,
      ecommerceAdminToken: loginResponse.ecommerceAdminToken || undefined,
      ecommerceShopToken: loginResponse.ecommerceShopToken || undefined,
      profile: {
        username: loginResponse.profile.username,
        firstName: loginResponse.profile.firstName,
        lastName: loginResponse.profile.lastName,
        email: loginResponse.profile.email,
        enabled: loginResponse.profile.enabled,
        roles: loginResponse.profile.roles,
        title: loginResponse.profile.profile.title,
        phone: loginResponse.profile.profile.phone,
        birthday: loginResponse.profile.profile.birthday,
        gender: loginResponse.profile.profile.gender,
        description: loginResponse.profile.profile.description,
        address: loginResponse.profile.profile.address,
      },
    })

    await persistProfileState(event, loginResponse.profile)

    scheduleProfileCacheWarmup(event)

    return loginResponse
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
