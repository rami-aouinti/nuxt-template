import { createBroWorldRequest } from '~~/server/utils/broWorldApi'

const MEDIA_BASE_URL = 'https://media.bro-world.org/api/v1'
const MEDIA_ERROR_MESSAGE = "Requête à l'API Media Bro World échouée"

export const broWorldMediaRequest = createBroWorldRequest(
  MEDIA_BASE_URL,
  MEDIA_ERROR_MESSAGE,
)
