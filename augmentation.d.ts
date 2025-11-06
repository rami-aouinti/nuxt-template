import type { AuthProfile } from './app/types/auth'

declare module '#app' {
  interface PageMeta {
    icon?: string
    title?: string
    subtitle?: string
    drawerIndex?: number
  }
}

declare module '#auth-utils' {
  interface User {
    login: string
    avatar_url: string
  }

  interface UserSession {
    token?: string
    profile?: AuthProfile
  }
}

export {}
