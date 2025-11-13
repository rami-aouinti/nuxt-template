import { createBroWorldRequest } from '~~/server/utils/broWorldApi'

const NOTIFICATION_BASE_URL = 'https://notification.bro-world.org/api/v1'
const NOTIFICATION_ERROR_MESSAGE = "Requête à l'API Notification Bro World échouée"

export const broWorldNotificationRequest = createBroWorldRequest(
  NOTIFICATION_BASE_URL,
  NOTIFICATION_ERROR_MESSAGE,
)
