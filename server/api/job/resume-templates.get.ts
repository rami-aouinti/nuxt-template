import { broWorldJobRequest } from '~~/server/utils/broWorldJobApi'

export default defineEventHandler(async (event) => {
  return await broWorldJobRequest(event, '/platform/resume/templates', {
    method: 'GET',
  })
})
