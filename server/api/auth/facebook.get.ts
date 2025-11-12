import { createOAuthHandler } from './_shared'

export default defineOAuthFacebookEventHandler(
  createOAuthHandler('https://bro-world.org/api/v1/user/facebook/verify'),
)
