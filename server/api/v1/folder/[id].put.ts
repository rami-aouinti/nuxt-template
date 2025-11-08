import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import { invalidateWorkspaceFolders } from '~~/server/utils/cache/workspace'
import type {
  UpdateWorkspaceFolderPayload,
  WorkspaceFolder,
} from '~/types/workspace'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'dossier')
  const body = await readBody<UpdateWorkspaceFolderPayload>(event)

  if (!body || Object.keys(body).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Aucune donnée fournie pour mettre à jour le dossier.',
      },
    })
  }

  const payload: UpdateWorkspaceFolderPayload = { ...body }

  if (typeof payload.name === 'string') {
    payload.name = payload.name.trim()
    if (!payload.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Le nom du dossier ne peut pas être vide.',
        },
      })
    }
  }

  const folder = await requestWithJsonBody<
    WorkspaceFolder,
    UpdateWorkspaceFolderPayload
  >(event, `/folder/${id}`, 'PUT', payload)

  await invalidateWorkspaceFolders(event)

  return folder
})
