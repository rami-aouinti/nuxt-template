export interface PublicProfileFriend {
  user: string
  status: number
}

export interface PublicProfileStory {
  id?: string
  [key: string]: unknown
}

export interface PublicProfileData {
  id: string
  username: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  language?: string | null
  locale?: string | null
  timezone?: string | null
  enabled: boolean
  profile?: Record<string, unknown> | null
  roles?: string[]
  photo?: string | null
  stories?: PublicProfileStory[]
  friends?: PublicProfileFriend[]
}
