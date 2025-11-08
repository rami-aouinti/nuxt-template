import type { MultiPartData } from 'h3'

import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { requireEntityId } from '~~/server/utils/crud'
import type { WorkspaceFile } from '~/types/workspace'

const textDecoder = new TextDecoder()

function toFormData(parts: MultiPartData[]) {
  const form = new FormData()

  for (const part of parts) {
    if (!part.name) {
      continue
    }

    if (part.filename) {
      const blob = new Blob([part.data], {
        type: part.type || 'application/octet-stream',
      })
      form.append(part.name, blob, part.filename)
      continue
    }

    form.append(part.name, textDecoder.decode(part.data))
  }

  return form
}

export default defineEventHandler(async (event) => {
  const folderId = requireEntityId(event, 'dossier')

  const multipart = await readMultipartFormData(event)

  if (!multipart || multipart.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Aucun fichier trouvé pour le téléversement.',
      },
    })
  }

  const hasFile = multipart.some((part) => part.filename)
  if (!hasFile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Veuillez sélectionner un fichier à téléverser.',
      },
    })
  }

  const formData = toFormData(multipart)

  return await broWorldRequest<WorkspaceFile>(event, `/folder/${folderId}/files`, {
    method: 'POST',
    body: formData,
  })
})
