import { createServiceClient } from './httpClient'

const BLOG_BASE_URL = 'https://blog.bro-world.org/api/v1'
const BLOG_ERROR_MESSAGE = "Requête à l'API Blog Bro World échouée"

export const broWorldBlogRequest = createServiceClient({
  baseUrl: BLOG_BASE_URL,
  defaultErrorMessage: BLOG_ERROR_MESSAGE,
})
