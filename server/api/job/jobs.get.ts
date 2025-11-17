import type { JobListingResponse } from '~/types/job'
import { fetchJobListings } from '~~/server/utils/cache/job'
import { broWorldJobRequest } from '~~/server/utils/broWorldJobApi'

export default defineEventHandler(async (event) => {
  return await fetchJobListings(event, async () => {
    return await broWorldJobRequest<JobListingResponse>(event, '/api/v1/job', {
      method: 'GET',
    })
  })
})
