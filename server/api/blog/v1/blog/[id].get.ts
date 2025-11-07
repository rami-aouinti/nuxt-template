import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import type { Blog } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du blog')

  return await broWorldBlogRequest<Blog>(event, `/blog/${id}`)
})
