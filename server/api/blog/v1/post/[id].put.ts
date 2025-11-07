import { requestBlogWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { BlogPost, BlogPostPayload } from '~/types/blogPost'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'article")
  const body = await readBody<BlogPostPayload>(event)

  return await requestBlogWithJsonBody<BlogPost, BlogPostPayload>(
    event,
    `/post/${id}`,
    'PUT',
    body,
  )
})
