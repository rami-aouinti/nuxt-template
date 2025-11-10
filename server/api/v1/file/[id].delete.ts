import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { invalidateWorkspaceFolders } from '~~/server/utils/cache/workspace'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const fileId = requireEntityId(event, 'fichier')

  await broWorldRequest<unknown>(event, `/file/${fileId}`, {
    method: 'DELETE',
  })

  await invalidateWorkspaceFolders(event)

  return { success: true }
})
