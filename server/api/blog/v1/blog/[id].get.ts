import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { fetchBlogDetail } from '~~/server/utils/cache/blog'
import type { Blog } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du blog')

  return await fetchBlogDetail(event, 'blog', id, () =>
    broWorldBlogRequest<Blog>(event, `/blog/${id}`),
  )
})
