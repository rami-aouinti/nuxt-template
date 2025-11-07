import type { Count } from '~/types/count'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'

export default defineEventHandler(async (event) => {
  return await broWorldBlogRequest<Count | number>(event, '/comment/count')
})
