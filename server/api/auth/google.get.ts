import { createOAuthHandler } from './_shared'

export default defineOAuthGoogleEventHandler(
  createOAuthHandler('https://bro-world.org/api/v1/user/google/verify'),
)
