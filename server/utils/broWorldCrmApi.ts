import { createServiceClient } from './httpClient'

const CRM_BASE_URL = 'https://crm.bro-world.org'
const DEFAULT_ERROR_MESSAGE = "Requête à l'API CRM échouée"

export const broWorldCrmRequest = createServiceClient({
  baseUrl: CRM_BASE_URL,
  defaultErrorMessage: DEFAULT_ERROR_MESSAGE,
})
