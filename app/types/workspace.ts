export interface WorkspaceFile {
  id: string
  name: string
  type: string
  url: string
  isPrivate: boolean
  isFavorite: boolean
  extension: string
  size: number
}

export interface WorkspaceFolder {
  id: string
  name: string
  children: WorkspaceFolder[]
  files: WorkspaceFile[]
  isPrivate: boolean
  isFavorite: boolean
}

export interface CreateWorkspaceFolderPayload {
  name: string
  parentId?: string | null
  isPrivate?: boolean
  isFavorite?: boolean
}

export interface UpdateWorkspaceFolderPayload {
  name?: string
  parentId?: string | null
  isPrivate?: boolean
  isFavorite?: boolean
}
