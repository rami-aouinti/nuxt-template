import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { fetchBlogDetail } from '~~/server/utils/cache/blog'
import type { BlogComment } from '~/types/blogComment'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du commentaire')

  return await fetchBlogDetail(event, 'comment', id, () =>
    broWorldBlogRequest<BlogComment>(event, `/comment/${id}`),
  )
})
