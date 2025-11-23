import type { Component } from 'vue'

export type LegacyViewEntry = {
  slug: string
  name: string
  category: string
  segments: string[]
  file: string
}

type LegacyViewRecord = {
  entry: LegacyViewEntry
  loader: () => Promise<{ default: Component }>
}

const viewModules = import.meta.glob('~~/education/views/**/*.vue')

const viewRecords: Record<string, LegacyViewRecord> = {}

const unorderedEntries: LegacyViewEntry[] = []

Object.entries(viewModules).forEach(([path, loader]) => {
  const slugWithExt = path.split('education/views/')[1] ?? path
  const slug = slugWithExt.replace(/\.vue$/, '')
  const segments = slug.split('/')
  const name = segments[segments.length - 1]
  const category = segments[0] ?? 'general'

  const entry: LegacyViewEntry = {
    slug,
    name,
    category,
    segments,
    file: slugWithExt,
  }

  const normalizedSlug = slug.toLowerCase()

  unorderedEntries.push(entry)
  viewRecords[normalizedSlug] = {
    entry,
    loader: loader as () => Promise<{ default: Component }>,
  }
})

export const legacyViewsIndex: LegacyViewEntry[] = unorderedEntries.sort((a, b) => {
  if (a.category === b.category) {
    return a.name.localeCompare(b.name)
  }

  return a.category.localeCompare(b.category)
})

export type ResolvedLegacyView = {
  component: Component
  entry: LegacyViewEntry
}

export async function resolveLegacyView(slug?: string): Promise<ResolvedLegacyView | null> {
  if (!slug) return null

  const normalizedSlug = slug.toLowerCase()
  const record = viewRecords[normalizedSlug]

  if (!record) return null

  const module = await record.loader()

  return {
    component: module.default,
    entry: record.entry,
  }
}
