export interface User {
  id: string
  username: string
  firstName: string | null
  lastName: string | null
  email: string
  language: string | null
  locale: string | null
  timezone: string | null
  enabled: boolean
  profile: Record<string, unknown> | null
}

export interface UserPayload {
  username: string
  email: string
  enabled?: boolean
  firstName?: string
  lastName?: string
  language?: string
  locale?: string
  timezone?: string
  password?: string
}
