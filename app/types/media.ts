export interface MediaThumbnail {
  id: string
  path?: string | null
  type?: string | null
  url?: string | null
  size?: string | null
}

export interface Media {
  id: string
  workplaceId?: string | null
  userId?: string | null
  contextKey?: string | null
  contextId?: string | null
  mimeType?: string | null
  fileExtension?: string | null
  fileSize?: number | null
  metaData?: Record<string, unknown> | null
  fileName?: string | null
  title?: string | null
  alt?: string | null
  mediaType?: string | null
  thumbnailsRo?: string | null
  private?: boolean | null
  favorite?: boolean | null
  path?: string | null
  mediaFolder?: unknown
  deletedAt?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  thumbnails?: MediaThumbnail[] | null
}

export interface MediaPayload {
  workplaceId?: string | null
  userId?: string | null
  contextKey: string
  contextId?: string | null
  mimeType?: string | null
  fileExtension?: string | null
  fileSize?: number | null
  metaData?: Record<string, unknown> | null
  fileName: string
  title: string
  alt?: string | null
  mediaType?: string | null
  thumbnailsRo?: string | null
  private?: boolean | null
  favorite?: boolean | null
  path: string
  mediaFolder?: string | null
}
