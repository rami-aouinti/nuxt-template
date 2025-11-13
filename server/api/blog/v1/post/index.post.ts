import type { MultiPartData } from 'h3'

import type { BlogPost, BlogPostPayload } from '~/types/blogPost'
import { invalidateBlogCollection } from '~~/server/utils/cache/blog'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { requestBlogWithJsonBody } from '~~/server/utils/crud'

const textDecoder = new TextDecoder()

function buildFormData(parts: MultiPartData[] | null | undefined) {
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

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event)
  const formData = buildFormData(multipart)

  let response: BlogPost

  if (formData) {
    response = await broWorldBlogRequest<BlogPost>(event, '/post', {
      method: 'POST',
      body: formData,
    })
  } else {
    const body = await readBody<BlogPostPayload>(event)

    response = await requestBlogWithJsonBody<BlogPost, BlogPostPayload>(
      event,
      '/post',
      'POST',
      body,
    )
  }

  await invalidateBlogCollection('post')

  return response
})
