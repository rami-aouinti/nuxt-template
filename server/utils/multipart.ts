import type { MultiPartData } from 'h3'

const textDecoder = new TextDecoder()

export function buildFormDataFromMultipart(
  parts: MultiPartData[] | null | undefined,
): FormData | null {
  if (!parts || parts.length === 0) {
    return null
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
