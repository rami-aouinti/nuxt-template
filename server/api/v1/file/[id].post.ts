import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { invalidateWorkspaceFolders } from '~~/server/utils/cache/workspace'
import { ensureUploadFormData } from '~~/server/utils/workspace-upload'
import { requireEntityId } from '~~/server/utils/crud'
import type { WorkspaceFile } from '~/types/workspace'

export default defineEventHandler(async (event) => {
  const folderId = requireEntityId(event, 'dossier')
  const multipart = await readMultipartFormData(event)
  const formData = ensureUploadFormData(multipart)

  const file = await broWorldRequest<WorkspaceFile>(event, `/file/${folderId}`, {
    method: 'POST',
    body: formData,
  })

  await invalidateWorkspaceFolders(event)

  return file
})
