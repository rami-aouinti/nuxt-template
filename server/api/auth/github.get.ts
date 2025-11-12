import { createOAuthHandler } from './_shared'

export default defineOAuthGitHubEventHandler(
  createOAuthHandler('https://bro-world.org/api/v1/user/github/verify'),
)
