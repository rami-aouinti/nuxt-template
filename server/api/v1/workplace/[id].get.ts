import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import type { Workplace } from '~/types/workplace'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  return await fetchAdminDetail(event, 'workplace', id, () =>
    broWorldRequest<Workplace>(event, `/workplace/${id}`),
  )
})
