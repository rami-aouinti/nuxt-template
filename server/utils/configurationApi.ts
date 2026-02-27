import { createServiceClient } from './httpClient'

const BASE_URL = 'https://configuration.bro-world.org/api/v1'
const DEFAULT_ERROR_MESSAGE = "Requête à l'API Bro World échouée"

export const configurationRequest = createServiceClient({
  baseUrl: BASE_URL,
  defaultErrorMessage: DEFAULT_ERROR_MESSAGE,
})
