import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type { WorkspaceFolder } from '~/types/workspace'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'dossier')

  return await broWorldRequest<WorkspaceFolder>(event, `/folder/${id}`)
})
