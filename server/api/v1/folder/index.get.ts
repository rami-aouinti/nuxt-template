import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchWorkspaceFolders } from '~~/server/utils/cache/workspace'
import type { WorkspaceFolder } from '~/types/workspace'

export default defineEventHandler(async (event) => {
  return await fetchWorkspaceFolders(event, () =>
    broWorldRequest<WorkspaceFolder[]>(event, '/folder'),
  )
})
