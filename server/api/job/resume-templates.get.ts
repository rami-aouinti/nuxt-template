import { broWorldJobPublicRequest } from '~~/server/utils/broWorldJobApi'

export default defineEventHandler(async (event) => {
  return await broWorldJobPublicRequest(event, '/platform/resume/templates', {
    method: 'GET',
  })
})
