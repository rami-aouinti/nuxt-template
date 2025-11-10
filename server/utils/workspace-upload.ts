import { createError, type MultiPartData } from 'h3'

const textDecoder = new TextDecoder()

export function ensureUploadFormData(parts: MultiPartData[] | null | undefined) {
  if (!parts || parts.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Aucun fichier trouvé pour le téléversement.',
      },
    })
  }

  const hasFile = parts.some((part) => Boolean(part.filename))

  if (!hasFile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Veuillez sélectionner un fichier à téléverser.',
      },
    })
  }

  const formData = new FormData()

  for (const part of parts) {
    if (!part.name) {
      continue
    }

    if (part.filename) {
      const blob = new Blob([part.data], {
        type: part.type || 'application/octet-stream',
      })
      formData.append(part.name, blob, part.filename)
      continue
    }

    formData.append(part.name, textDecoder.decode(part.data))
  }

  return formData
}
