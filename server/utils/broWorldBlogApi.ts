import { createBroWorldRequest } from '~~/server/utils/broWorldApi'

const BLOG_BASE_URL = 'https://blog.bro-world.org/api/v1'
const BLOG_ERROR_MESSAGE = "Requête à l'API Blog Bro World échouée"

export const broWorldBlogRequest = createBroWorldRequest(
  BLOG_BASE_URL,
  BLOG_ERROR_MESSAGE,
)
