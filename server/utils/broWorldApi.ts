import { createApiRequest } from './apiClient'

const BASE_URL = 'https://bro-world.org/api/v1'

export const broWorldRequest = createApiRequest(BASE_URL)
