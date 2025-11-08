import { requestWithJsonBody } from '~~/server/utils/crud'
import { invalidateWorkspaceFolders } from '~~/server/utils/cache/workspace'
import type {
  CreateWorkspaceFolderPayload,
  WorkspaceFolder,
} from '~/types/workspace'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateWorkspaceFolderPayload>(event)

  if (!body || typeof body.name !== 'string' || body.name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Le nom du dossier est requis pour créer un dossier.',
      },
    })
  }

  const folder = await requestWithJsonBody<WorkspaceFolder, CreateWorkspaceFolderPayload>(
    event,
    '/folder',
    'POST',
    {
      ...body,
      name: body.name.trim(),
    },
  )

  await invalidateWorkspaceFolders(event)

  return folder
})
