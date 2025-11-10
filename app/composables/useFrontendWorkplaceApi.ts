import { FetchError } from 'ofetch'

import type {
  FrontendWorkplaceCreatePayload,
  FrontendWorkplaceUpdatePayload,
  WorkplaceMemberPayload,
  WorkplacePluginPayload,
  Workplace,
} from '~/types/workplace'

const FRONTEND_WORKPLACE_BASE = '/api/frontend/workplaces'

type RequestOptions<Payload> = {
  method: 'POST' | 'PUT' | 'DELETE'
  body?: Payload
}

function buildRequestOptions<Payload>(options: RequestOptions<Payload>) {
  const { method, body } = options
  return {
    method,
    body,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
  }
}

async function requestWorkplaceEndpoint<Response, Payload = undefined>(
  path: string,
  options: RequestOptions<Payload>,
) {
  try {
    return await $fetch<Response>(`${FRONTEND_WORKPLACE_BASE}${path}`, {
      ...buildRequestOptions(options),
    })
  } catch (error) {
    if (
      error instanceof FetchError &&
      error.data &&
      typeof error.data === 'object'
    ) {
      const data = error.data as Record<string, unknown>
      if (typeof data.message === 'string' && data.message.trim().length > 0) {
        throw new Error(data.message)
      }
    }

    throw error
  }
}

export function useFrontendWorkplaceApi() {
  const createWorkplace = (payload: FrontendWorkplaceCreatePayload) =>
    requestWorkplaceEndpoint<Workplace, FrontendWorkplaceCreatePayload>('', {
      method: 'POST',
      body: payload,
    })

  const updateWorkplace = (
    workplace: string,
    payload: FrontendWorkplaceUpdatePayload,
  ) =>
    requestWorkplaceEndpoint<Workplace, FrontendWorkplaceUpdatePayload>(
      `/${encodeURIComponent(workplace)}`,
      {
        method: 'PUT',
        body: payload,
      },
    )

  const deleteWorkplace = (workplace: string) =>
    requestWorkplaceEndpoint<unknown, undefined>(
      `/${encodeURIComponent(workplace)}`,
      {
        method: 'DELETE',
      },
    )

  const addPlugins = (workplace: string, payload: WorkplacePluginPayload) =>
    requestWorkplaceEndpoint<Workplace, WorkplacePluginPayload>(
      `/${encodeURIComponent(workplace)}/plugins`,
      {
        method: 'POST',
        body: payload,
      },
    )

  const removePlugins = (workplace: string, payload: WorkplacePluginPayload) =>
    requestWorkplaceEndpoint<Workplace, WorkplacePluginPayload>(
      `/${encodeURIComponent(workplace)}/plugins`,
      {
        method: 'DELETE',
        body: payload,
      },
    )

  const addMembers = (workplace: string, payload: WorkplaceMemberPayload) =>
    requestWorkplaceEndpoint<Workplace, WorkplaceMemberPayload>(
      `/${encodeURIComponent(workplace)}/members`,
      {
        method: 'POST',
        body: payload,
      },
    )

  const removeMembers = (workplace: string, payload: WorkplaceMemberPayload) =>
    requestWorkplaceEndpoint<Workplace, WorkplaceMemberPayload>(
      `/${encodeURIComponent(workplace)}/members`,
      {
        method: 'DELETE',
        body: payload,
      },
    )

  return {
    createWorkplace,
    updateWorkplace,
    deleteWorkplace,
    addPlugins,
    removePlugins,
    addMembers,
    removeMembers,
  }
}
