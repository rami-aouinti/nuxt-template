import { createServiceClient } from './httpClient'

const NOTIFICATION_BASE_URL = 'https://notification.bro-world.org/api/v1'
const NOTIFICATION_ERROR_MESSAGE =
  "Requête à l'API Notification Bro World échouée"

export const broWorldNotificationRequest = createServiceClient({
  baseUrl: NOTIFICATION_BASE_URL,
  defaultErrorMessage: NOTIFICATION_ERROR_MESSAGE,
})
