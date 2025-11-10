import type {
  CreateWorkspaceFolderPayload,
  WorkspaceFolder,
} from '~/types/workspace'
import { invalidateWorkspaceFolders } from '~~/server/utils/cache/workspace'
import { requireEntityId, requestWithJsonBody } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const parentId = requireEntityId(event, 'dossier parent')
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

  const { parentId: _ignored, ...rest } = body
  const payload: Omit<CreateWorkspaceFolderPayload, 'parentId'> = {
    ...rest,
    name: body.name.trim(),
  }

  const folder = await requestWithJsonBody<
    WorkspaceFolder,
    Omit<CreateWorkspaceFolderPayload, 'parentId'>
  >(event, `/folder/${parentId}`, 'POST', payload)

  await invalidateWorkspaceFolders(event)

  return folder
})
