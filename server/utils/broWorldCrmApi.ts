import { createBroWorldRequest } from './broWorldApi'

const CRM_BASE_URL = 'https://crm.bro-world.org'
const DEFAULT_ERROR_MESSAGE = "Requête à l'API CRM échouée"

export const broWorldCrmRequest = createBroWorldRequest(
  CRM_BASE_URL,
  DEFAULT_ERROR_MESSAGE,
)
