import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { fetchBlogDetail } from '~~/server/utils/cache/blog'
import type { BlogPost } from '~/types/blogPost'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'article")

  return await fetchBlogDetail(event, 'post', id, () =>
    broWorldBlogRequest<BlogPost>(event, `/post/${id}`),
  )
})
