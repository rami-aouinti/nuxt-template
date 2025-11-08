export interface ProfileEvent {
  id: string
  title: string
  start: string
  end?: string | null
  description?: string | null
  color?: string | null
  allDay?: boolean | null
  location?: string | null
  isPrivate?: boolean | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface UpsertProfileEventPayload {
  id?: string
  title: string
  start: string
  end?: string | null
  description?: string | null
  color?: string | null
  allDay?: boolean
  location?: string | null
  isPrivate?: boolean
}
