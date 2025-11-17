import { createError } from 'h3'
import { useRuntimeConfig } from '#imports'

import type { JobListingResponse } from '~/types/job'
import { fetchJobListings } from '~~/server/utils/cache/job'
import { broWorldJobRequest } from '~~/server/utils/broWorldJobApi'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const token = runtimeConfig.broWorld?.job?.token

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Job API token missing',
      data: {
        message: 'Configure BRO_WORLD_JOB_TOKEN to query the job platform.',
      },
    })
  }

  return await fetchJobListings(event, async () => {
    return await broWorldJobRequest<JobListingResponse>(event, '/platform/job', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  })
})
