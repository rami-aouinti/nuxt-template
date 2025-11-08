import { createBroWorldRequest } from './broWorldApi'

const BLOG_PROFILE_BASE_URL = 'https://blog.bro-world.org/v1'
const BLOG_PROFILE_ERROR_MESSAGE = "Requête à l'API Blog Bro World échouée"

export const broWorldBlogProfileRequest = createBroWorldRequest(
  BLOG_PROFILE_BASE_URL,
  BLOG_PROFILE_ERROR_MESSAGE,
)
