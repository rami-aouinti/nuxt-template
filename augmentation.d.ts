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
    ecommerceAdminToken?: string
    ecommerceShopToken?: string
    profile?: AuthProfile
  }
}

declare module 'jspdf-autotable' {
  import type { jsPDF } from 'jspdf'

  export interface AutoTableOptions {
    head?: unknown[][]
    body?: unknown[][]
    [key: string]: unknown
  }

  export default function autoTable(
    doc: jsPDF,
    options: AutoTableOptions,
  ): jsPDF
}

export {}
