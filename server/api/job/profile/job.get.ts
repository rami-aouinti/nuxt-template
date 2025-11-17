import { broWorldJobRequest } from '~~/server/utils/broWorldJobApi'

export default defineEventHandler(async (event) => {
  return await broWorldJobRequest(event, '/api/v1/profile/job', {
    method: 'GET',
  })
})
