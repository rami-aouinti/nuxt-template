import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type { WorkspaceFolder } from '~/types/workspace'

export default defineEventHandler(async (event) => {
  return await broWorldRequest<WorkspaceFolder[]>(event, '/folder')
})
