import { requestFrontendWithJsonBody } from '~~/server/utils/crud'
import type {
  FrontendWorkplaceCreatePayload,
  Workplace,
} from '~/types/workplace'

export default defineEventHandler(async (event) => {
  const body = await readBody<FrontendWorkplaceCreatePayload>(event)

  return await requestFrontendWithJsonBody<
    Workplace,
    FrontendWorkplaceCreatePayload
  >(event, '/workplaces', 'POST', body)
})
