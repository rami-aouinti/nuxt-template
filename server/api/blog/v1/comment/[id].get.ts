import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import type { BlogComment } from '~/types/blogComment'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du commentaire')

  return await broWorldBlogRequest<BlogComment>(event, `/comment/${id}`)
})
