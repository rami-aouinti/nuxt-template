export interface ApiKey {
  id: string
  token: string
  description: string | null
}

export interface ApiKeyPayload {
  description: string
}
