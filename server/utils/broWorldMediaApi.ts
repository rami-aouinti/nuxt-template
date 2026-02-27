import { createServiceClient } from './httpClient'

const MEDIA_BASE_URL = 'https://media.bro-world.org/api/v1'
const MEDIA_ERROR_MESSAGE = "Requête à l'API Media Bro World échouée"

export const broWorldMediaRequest = createServiceClient({
  baseUrl: MEDIA_BASE_URL,
  defaultErrorMessage: MEDIA_ERROR_MESSAGE,
})
