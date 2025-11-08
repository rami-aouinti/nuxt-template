import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { fetchBlogDetail } from '~~/server/utils/cache/blog'
import type { BlogTag } from '~/types/blogTag'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du tag')

  return await fetchBlogDetail(event, 'tag', id, () =>
    broWorldBlogRequest<BlogTag>(event, `/tag/${id}`),
  )
})
