import { getRouterParam } from 'h3'

import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const folderId = requireEntityId(event, 'dossier')
  const fileId = getRouterParam(event, 'fileId')

  if (!fileId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: "L'identifiant du fichier est requis pour le supprimer.",
      },
    })
  }

  await broWorldRequest<unknown>(event, `/folder/${folderId}/files/${fileId}`, {
    method: 'DELETE',
  })

  return { success: true }
})
