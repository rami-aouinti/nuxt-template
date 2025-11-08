import type { RouteLocationRaw } from 'vue-router'

type LocalePathResolver = (route: RouteLocationRaw) => string

const EXTERNAL_PATTERN = /^(?:[a-z][a-z+.-]*:|\/\/)/i

function isExternal(target: string): boolean {
  return EXTERNAL_PATTERN.test(target)
}

export function resolveLocalizedRouteTarget(
  target: string,
  localePath: LocalePathResolver,
): string {
  let normalized = target.trim()

  if (!normalized) {
    return normalized
  }

  if (normalized === '#') {
    return localePath({ name: 'index' })
  }

  if (normalized.startsWith('#')) {
    const hash = normalized.slice(1).trim()
    const base = localePath({ name: 'index' })

    return hash ? `${base}#${hash}` : base
  }

  if (isExternal(normalized)) {
    return normalized
  }

  const hashIndex = normalized.indexOf('#')
  let hash = ''

  if (hashIndex !== -1) {
    hash = normalized.slice(hashIndex)
    normalized = normalized.slice(0, hashIndex)
  }

  const routePath = normalized.startsWith('/') ? normalized : `/${normalized}`
  const resolvedPath = localePath(routePath)

  return `${resolvedPath}${hash}`
}
