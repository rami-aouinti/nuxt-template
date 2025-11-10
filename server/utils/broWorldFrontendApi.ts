import { createBroWorldRequest } from './broWorldApi'

const FRONTEND_BASE_URL = 'https://bro-world.org/api/v1/frontend'
const FRONTEND_ERROR_MESSAGE = "Requête à l'API Frontend Bro World échouée"

export const broWorldFrontendRequest = createBroWorldRequest(
  FRONTEND_BASE_URL,
  FRONTEND_ERROR_MESSAGE,
)
