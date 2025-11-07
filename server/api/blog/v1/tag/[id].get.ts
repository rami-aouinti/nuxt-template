import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import type { BlogTag } from '~/types/blogTag'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du tag')

  return await broWorldBlogRequest<BlogTag>(event, `/tag/${id}`)
})
