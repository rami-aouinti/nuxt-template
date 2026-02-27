import { createServiceClient } from './httpClient'

const FRONTEND_BASE_URL = 'https://bro-world.org/api/v1/frontend'
const FRONTEND_ERROR_MESSAGE = "Requête à l'API Frontend Bro World échouée"

export const broWorldFrontendRequest = createServiceClient({
  baseUrl: FRONTEND_BASE_URL,
  defaultErrorMessage: FRONTEND_ERROR_MESSAGE,
})
