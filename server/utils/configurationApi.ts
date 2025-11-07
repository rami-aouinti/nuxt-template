import { createApiRequest } from './apiClient'

const BASE_URL = 'https://configuration.bro-world.org/api/v1'

export const configurationRequest = createApiRequest(BASE_URL)
