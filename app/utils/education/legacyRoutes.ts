function normalizeSegment(segment: string): string {
  return segment
    .replace(/\.vue$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

function labelize(segment: string): string {
  const base = segment.replace(/\.vue$/i, '')
  return base
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function legacyViewSlugToSegments(slug: string): string[] {
  return slug
    .replace(/^[./]+/, '')
    .split('/')
    .filter(Boolean)
    .map(normalizeSegment)
}

export function legacyViewSlugToPath(slug: string): string {
  return `/education/${legacyViewSlugToSegments(slug).join('/')}`
}

export function legacyViewSlugToLabel(slug: string): string {
  const segments = slug.replace(/\.vue$/i, '').split('/')
  return labelize(segments[segments.length - 1] ?? slug)
}
