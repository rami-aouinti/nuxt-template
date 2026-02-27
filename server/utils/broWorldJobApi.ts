import { createServiceClient } from './httpClient'

const BASE_URL = 'https://job.bro-world.org'
const DEFAULT_ERROR_MESSAGE = "Requête à l'API Bro World échouée"

export const broWorldJobRequest = createServiceClient({
  baseUrl: BASE_URL,
  defaultErrorMessage: DEFAULT_ERROR_MESSAGE,
})

export const broWorldJobPublicRequest = createServiceClient({
  baseUrl: BASE_URL,
  defaultErrorMessage: DEFAULT_ERROR_MESSAGE,
  tokenResolver: () => null,
})
