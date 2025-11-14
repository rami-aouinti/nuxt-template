import { readBody, readMultipartFormData } from 'h3'

import type { BlogPost, BlogPostPayload } from '~/types/blogPost'
import { invalidateBlogCollection } from '~~/server/utils/cache/blog'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import { buildFormDataFromMultipart } from '~~/server/utils/multipart'

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event)
  const formData = buildFormDataFromMultipart(multipart)

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
