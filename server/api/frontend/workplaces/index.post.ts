import { invalidateUserWorkplaces } from '~~/server/utils/cache/workplace'
import { requestFrontendWithJsonBody } from '~~/server/utils/crud'
import type {
  FrontendWorkplaceCreatePayload,
  Workplace,
} from '~/types/workplace'

export default defineEventHandler(async (event) => {
  const body = await readBody<FrontendWorkplaceCreatePayload>(event)

  const workplace = await requestFrontendWithJsonBody<
    Workplace,
    FrontendWorkplaceCreatePayload
  >(event, '/workplaces', 'POST', body)

  await invalidateUserWorkplaces(event)

  return workplace
})
