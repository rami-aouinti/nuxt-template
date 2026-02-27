import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
  type EventHandler,
  type H3Event,
} from 'h3'

import { broWorldRequest } from './broWorldApi'
import {
  fetchAdminDetail,
  fetchAdminList,
  invalidateAdminCollection,
  invalidateAdminDetail,
  invalidateAdminList,
  type AdminResource,
} from './cache/admin'

type RequestClient = typeof broWorldRequest

type RouteFactoryDependencies = {
  request: RequestClient
  requireId: (event: H3Event, entityLabel: string) => string
  fetchList: typeof fetchAdminList
  fetchDetail: typeof fetchAdminDetail
  invalidateCollection: typeof invalidateAdminCollection
  invalidateList: typeof invalidateAdminList
  invalidateDetail: typeof invalidateAdminDetail
  readJsonBody: typeof readBody
}

export type AdminCrudFactoryOptions = {
  resource: AdminResource
  path: `/${string}`
  entityLabel: string
  deleteReturnsResponse?: boolean
}

function requireEntityIdFromRoute(event: H3Event, entityLabel: string) {
  const id = getRouterParam(event, 'id')

  if (id) {
    return id
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Bad Request',
    data: { message: `Identifiant ${entityLabel} manquant` },
  })
}

const defaultDependencies: RouteFactoryDependencies = {
  request: broWorldRequest,
  requireId: requireEntityIdFromRoute,
  fetchList: fetchAdminList,
  fetchDetail: fetchAdminDetail,
  invalidateCollection: invalidateAdminCollection,
  invalidateList: invalidateAdminList,
  invalidateDetail: invalidateAdminDetail,
  readJsonBody: readBody,
}

export function createAdminCrudHandlers<Response, Payload = never>(
  options: AdminCrudFactoryOptions,
  dependencies: Partial<RouteFactoryDependencies> = {},
) {
  const deps: RouteFactoryDependencies = {
    ...defaultDependencies,
    ...dependencies,
  }

  const getList: EventHandler = defineEventHandler(async (event) => {
    return await deps.fetchList(event, options.resource, () =>
      deps.request<Response[]>(event, options.path),
    )
  })

  const getDetail: EventHandler = defineEventHandler(async (event) => {
    const id = deps.requireId(event, options.entityLabel)

    return await deps.fetchDetail(event, options.resource, id, () =>
      deps.request<Response>(event, `${options.path}/${id}`),
    )
  })

  const post: EventHandler = defineEventHandler(async (event) => {
    const body = await deps.readJsonBody<Payload>(event)

    const response = await deps.request<Response>(event, options.path, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })

    await deps.invalidateCollection(options.resource)

    return response
  })

  const put: EventHandler = defineEventHandler(async (event) => {
    const id = deps.requireId(event, options.entityLabel)
    const body = await deps.readJsonBody<Payload>(event)

    const response = await deps.request<Response>(event, `${options.path}/${id}`, {
      method: 'PUT',
      body,
      headers: { 'Content-Type': 'application/json' },
    })

    await Promise.all([
      deps.invalidateDetail(options.resource, id),
      deps.invalidateList(options.resource),
    ])

    return response
  })

  const del: EventHandler = defineEventHandler(async (event: H3Event) => {
    const id = deps.requireId(event, options.entityLabel)

    const response = await deps.request<unknown>(event, `${options.path}/${id}`, {
      method: 'DELETE',
    })

    await Promise.all([
      deps.invalidateDetail(options.resource, id),
      deps.invalidateCollection(options.resource),
    ])

    if (options.deleteReturnsResponse) {
      return response
    }

    return { success: true }
  })

  return { getList, getDetail, post, put, del }
}
