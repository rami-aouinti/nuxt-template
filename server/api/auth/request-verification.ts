import { defineEventHandler } from 'h3'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
export default defineEventHandler(async (event) => {
  return await broWorldRequest<Any[]>(event, '/profile/request-verification')
})
