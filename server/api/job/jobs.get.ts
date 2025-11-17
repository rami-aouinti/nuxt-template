import { createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { broWorldJobRequest } from '~~/server/utils/broWorldJobApi'

interface JobListingResponse<T = Record<string, unknown>> {
  data: T[]
  page: number
  limit: number
  count: number
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.broWorld?.job?.token

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Job API token missing',
      data: {
        message: 'Configure NUXT_BRO_WORLD_JOB_TOKEN to query the job platform.',
      },
    })
  }

  return await broWorldJobRequest<JobListingResponse>(event, '/platform/job', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
})
