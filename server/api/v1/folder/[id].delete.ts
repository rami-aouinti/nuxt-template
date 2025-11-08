import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { requireEntityId } from '~~/server/utils/crud'
import { invalidateWorkspaceFolders } from '~~/server/utils/cache/workspace'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'dossier')

  await broWorldRequest<unknown>(event, `/folder/${id}`, { method: 'DELETE' })

  await invalidateWorkspaceFolders(event)

  return { success: true }
})
