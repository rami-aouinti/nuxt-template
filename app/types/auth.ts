export type AuthProfile = Record<string, unknown> & {
  id: string
  username: string
  email: string
  firstName?: string | null
  lastName?: string | null
  photo?: string | null
  title?: string | null
  description?: string | null
  gender?: string | null
  phone?: string | null
  address?: string | null
  birthday?: string | null
  roles?: string[]
}

export interface LoginResponse {
  token: string
  profile: AuthProfile
}
