import { createBroWorldRequest } from './broWorldApi'

const BASE_URL = 'https://job.bro-world.org'

export const broWorldJobRequest = createBroWorldRequest(BASE_URL)

export const broWorldJobPublicRequest = createBroWorldRequest(BASE_URL, undefined, {
  resolveToken: () => null,
})
