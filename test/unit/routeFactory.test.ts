import type { H3Event } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const request = vi.fn()
const fetchList = vi.fn()
const fetchDetail = vi.fn()
const invalidateCollection = vi.fn()
const invalidateList = vi.fn()
const invalidateDetail = vi.fn()

vi.mock('../../server/utils/broWorldApi', () => ({
  broWorldRequest: request,
}))

vi.mock('../../server/utils/cache/admin', () => ({
  fetchAdminList: fetchList,
  fetchAdminDetail: fetchDetail,
  invalidateAdminCollection: invalidateCollection,
  invalidateAdminList: invalidateList,
  invalidateAdminDetail: invalidateDetail,
}))

describe('createAdminCrudHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a 400 error when id is missing on detail route', async () => {
    const { createAdminCrudHandlers } = await import('../../server/utils/routeFactory')

    const { getDetail } = createAdminCrudHandlers<{ id: string }>(
      {
        resource: 'role',
        path: '/role',
        entityLabel: 'du rôle',
      },
      { request },
    )

    const event = { context: { params: {} } } as unknown as H3Event

    await expect(getDetail(event)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Identifiant du rôle manquant' },
    })
    expect(request).not.toHaveBeenCalled()
  })

  it('invalidates detail and collection after delete', async () => {
    request.mockResolvedValue(undefined)
    invalidateDetail.mockResolvedValue(undefined)
    invalidateCollection.mockResolvedValue(undefined)

    const { createAdminCrudHandlers } = await import('../../server/utils/routeFactory')

    const { del } = createAdminCrudHandlers(
      {
        resource: 'plugin',
        path: '/plugin',
        entityLabel: 'du plugin',
      },
      {
        request,
        invalidateDetail,
        invalidateCollection,
      },
    )

    const event = { context: { params: { id: '42' } } } as unknown as H3Event

    await expect(del(event)).resolves.toEqual({ success: true })
    expect(request).toHaveBeenCalledWith(event, '/plugin/42', { method: 'DELETE' })
    expect(invalidateDetail).toHaveBeenCalledWith('plugin', '42')
    expect(invalidateCollection).toHaveBeenCalledWith('plugin')
  })
})
