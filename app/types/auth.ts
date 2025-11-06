export type AuthProfile = Record<string, unknown> & {
  id: string
  username: string
  email: string
  firstName?: string | null
  lastName?: string | null
  photo?: string | null
  roles?: string[]
}

export interface LoginResponse {
  token: string
  profile: AuthProfile
}
