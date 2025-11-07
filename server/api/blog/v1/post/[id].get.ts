import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import type { BlogPost } from '~/types/blogPost'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'article")

  return await broWorldBlogRequest<BlogPost>(event, `/post/${id}`)
})
