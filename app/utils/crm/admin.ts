export type CrmAdminResourceActionLinks = {
  show: string | null
  edit: string | null
  delete: string | null
}

function normalizePath(value?: string | null) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function resolvePrefixedPath(prefix: string, path: string) {
  const normalizedPrefix = prefix.endsWith('/')
    ? prefix.slice(0, -1)
    : prefix
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${normalizedPrefix}/${normalizedPath}`
}

export function resolveCrmAdminEndpoint(path?: string | null): string | null {
  const normalized = normalizePath(path)

  if (!normalized) {
    return null
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized
  }

  if (normalized.startsWith('/api/crm')) {
    return normalized
  }

  if (normalized.startsWith('/api/')) {
    return `/api/crm${normalized.replace(/^\/api/, '')}`
  }

  return resolvePrefixedPath('/api/crm', normalized)
}

export function buildCrmAdminResourceActionLinks(
  basePath?: string | null,
  overrides: Partial<CrmAdminResourceActionLinks> = {},
): CrmAdminResourceActionLinks {
  const showSource = overrides.show ?? basePath ?? null
  const editSource = overrides.edit ?? basePath ?? null
  const deleteSource = overrides.delete ?? basePath ?? null

  return {
    show: resolveCrmAdminEndpoint(showSource),
    edit: resolveCrmAdminEndpoint(editSource),
    delete: resolveCrmAdminEndpoint(deleteSource),
  }
}
