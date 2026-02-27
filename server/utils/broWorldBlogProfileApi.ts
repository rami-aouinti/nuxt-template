import { createServiceClient } from './httpClient'

const BLOG_PROFILE_BASE_URL = 'https://blog.bro-world.org/v1'
const BLOG_PROFILE_ERROR_MESSAGE = "Requête à l'API Blog Bro World échouée"

export const broWorldBlogProfileRequest = createServiceClient({
  baseUrl: BLOG_PROFILE_BASE_URL,
  defaultErrorMessage: BLOG_PROFILE_ERROR_MESSAGE,
})
