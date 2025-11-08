import { requestBlogWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { BlogPost, BlogPostPayload } from '~/types/blogPost'
import {
  invalidateBlogDetail,
  invalidateBlogList,
} from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'article")
  const body = await readBody<BlogPostPayload>(event)

  const response = await requestBlogWithJsonBody<BlogPost, BlogPostPayload>(
    event,
    `/post/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateBlogDetail('post', id),
    invalidateBlogList('post'),
  ])

  return response
})
