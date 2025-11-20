import { computed, ref } from 'vue'
import { useCrmApi } from '~/composables/useCrmApi'
import type { CrmCollection } from '~/types/crm'

type SearchField<T> = keyof T | ((item: T) => unknown)

type UseCrmAdminResourceOptions<T> = {
  key?: string
  searchFields?: SearchField<T>[]
}

function sanitizeKey(value: string) {
  return value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')
}

function resolveSearchableValues<T>(
  item: T,
  fields?: SearchField<T>[],
): string[] {
  if (!fields || fields.length === 0) {
    return Object.values(item as Record<string, unknown>)
      .filter((value) => typeof value === 'string')
      .map((value) => value.toLowerCase())
  }

  return fields
    .map((field) => {
      if (typeof field === 'function') {
        return field(item)
      }

      return (item as Record<string, unknown>)[field as string]
    })
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.toLowerCase())
}

export async function useCrmAdminResource<TItem, TRow = TItem>(
  endpoint: string,
  mapItem: (item: TItem, index: number) => TRow,
  options: UseCrmAdminResourceOptions<TRow> = {},
) {
  const { withBase } = useCrmApi()
  const search = ref('')

  const { data, pending, error, refresh } = await useFetch<
    CrmCollection<TItem>
  >(withBase(endpoint), {
    key:
      options.key ||
      `admin-crm-${sanitizeKey(endpoint)}-${Math.random().toString(16).slice(2)}`,
    credentials: 'include',
    cache: 'no-store',
  })

  const rows = computed(() => {
    const items = data.value?.member ?? []
    return items.map((item, index) => mapItem(item, index))
  })

  const filteredRows = computed(() => {
    if (!search.value) {
      return rows.value
    }

    const term = search.value.toLowerCase().trim()
    return rows.value.filter((row) =>
      resolveSearchableValues(row, options.searchFields).some((value) =>
        value.includes(term),
      ),
    )
  })

  const errorMessage = computed(() => {
    const err = error.value as { data?: { message?: string }; message?: string }
    return err?.data?.message || err?.message || null
  })

  return {
    search,
    rows,
    filteredRows,
    pending,
    errorMessage,
    refresh,
  }
}
