import type { WorkspaceFile } from '~/types/workspace'

import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { invalidateWorkspaceFolders } from '~~/server/utils/cache/workspace'
import { ensureUploadFormData } from '~~/server/utils/workspace-upload'

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event)
  const formData = ensureUploadFormData(multipart)

  const file = await broWorldRequest<WorkspaceFile>(
    event,
    '/files/upload',
    {
      method: 'POST',
      body: formData,
    },
  )

  await invalidateWorkspaceFolders(event)

  return file
})
