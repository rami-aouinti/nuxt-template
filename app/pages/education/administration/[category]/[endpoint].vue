<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'
import { useEducationAdministrationData } from '~/composables/useEducationAdministrationData'

definePageMeta({
  layout: 'default',
  title: 'navigation.educationAdministration',
  icon: 'mdi-shield-crown-outline',
  drawerIndex: 3,
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { navLinks } = useEducationNavigation()
const { findCategory, findEndpoint } = useEducationAdministrationData()

const categoryKey = computed(() => route.params.category as string)
const endpointSlug = computed(() => route.params.endpoint as string)

const category = computed(() => findCategory(categoryKey.value))
const endpoint = computed(() =>
  category.value ? findEndpoint(category.value.key, endpointSlug.value) : undefined,
)

const categoryOverviewRoute = computed(() =>
  category.value
    ? localePath({ name: `education-administration-${category.value.key}` })
    : localePath('education-administration'),
)

const typeLabel = computed(() => {
  if (endpoint.value?.type === 'form') return t('pages.education.administration.table.form')
  if (endpoint.value?.type === 'api') return 'API'
  return t('pages.education.administration.table.page')
})

const hasDataSource = computed(() => Boolean(endpoint.value?.apiPath))
const records = ref<Record<string, unknown>[]>([])
const usingFallback = ref(false)

const fetchPath = computed(() =>
  hasDataSource.value && endpoint.value?.apiPath
    ? `/api/education/${endpoint.value.apiPath}`
    : null,
)

const { data, pending, error, refresh } = useFetch(fetchPath, {
  immediate: false,
})

const normalizeRecords = (payload: unknown) => {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    const collection = payload as Record<string, unknown>
    if (Array.isArray(collection.items)) return collection.items
    if (Array.isArray(collection.data)) return collection.data
    if (Array.isArray(collection.results)) return collection.results
    if (Array.isArray(collection['hydra:member'])) return collection['hydra:member']
  }
  return []
}

const prettify = (value: string) =>
  value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())

const dataHeaders = computed(() => {
  if (endpoint.value?.columns?.length) {
    return endpoint.value.columns.map((column) => ({
      key: column.key,
      title: column.i18nKey ? t(column.i18nKey) : column.label || prettify(column.key),
    }))
  }

  const sample = records.value[0]
  return sample
    ? Object.keys(sample).map((key) => ({ key, title: prettify(key) }))
    : []
})

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return '—'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

watchEffect(() => {
  if (!hasDataSource.value) {
    records.value = []
    usingFallback.value = false
    return
  }

  if (fetchPath.value) {
    refresh()
  }
})

watchEffect(() => {
  if (!hasDataSource.value) return

  if (data.value) {
    const normalized = normalizeRecords(data.value)
    if (normalized.length) {
      records.value = normalized
      usingFallback.value = false
      return
    }
  }

  if (error.value || !records.value.length) {
    records.value = endpoint.value?.mockData || []
    usingFallback.value = Boolean(records.value.length)
  }
})
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer">
        <AppNavigationList
          :items="navLinks"
          :title="t('pages.education.navigation.title')"
          :description="t('pages.education.navigation.description')"
        />
      </teleport>
    </client-only>

    <v-row class="gy-6" justify="center">
      <v-col cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="d-flex align-center justify-space-between gap-4 flex-wrap mb-2">
            <div>
              <p class="text-caption text-medium-emphasis mb-2">
                {{ category?.title || t('common.notFound') }} · {{ typeLabel }}
              </p>
              <h1 class="text-h5 font-weight-bold mb-1">
                {{ endpoint?.label || t('common.notFound') }}
              </h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ endpoint?.description || t('pages.education.administration.table.empty') }}
              </p>
            </div>
            <div class="d-flex align-center gap-2">
              <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-view-dashboard-outline"
                :to="categoryOverviewRoute"
              >
                {{ t('pages.education.actions.backToOverview') }}
              </v-btn>
              <v-btn
                v-if="endpoint?.href"
                color="primary"
                variant="flat"
                prepend-icon="mdi-open-in-new"
                :href="endpoint.href"
                target="_blank"
                rel="noreferrer"
              >
                {{ t('pages.education.actions.visit') }}
              </v-btn>
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col v-if="hasDataSource" cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="d-flex align-center justify-space-between gap-4 flex-wrap mb-4">
            <div>
              <h2 class="text-subtitle-1 font-weight-semibold mb-1">
                {{ t('pages.education.administration.data.title') }}
              </h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ t('pages.education.administration.data.subtitle') }}
              </p>
            </div>
            <v-btn
              variant="text"
              color="primary"
              :loading="pending"
              :disabled="pending"
              icon="mdi-refresh"
              @click="refresh"
            />
          </div>

          <v-alert v-if="usingFallback" type="warning" variant="tonal" class="mb-4">
            {{ t('pages.education.administration.data.fallback') }}
          </v-alert>

          <v-data-table
            :headers="dataHeaders"
            :items="records"
            :loading="pending"
            :items-per-page="10"
            class="elevation-0"
          >
            <template #item="{ item, headers }">
              <tr>
                <td v-for="header in headers" :key="header.key">
                  {{ formatValue(item.columns[header.key]) }}
                </td>
              </tr>
            </template>

            <template #no-data>
              <div class="text-center py-6 text-medium-emphasis">
                {{ t('pages.education.administration.data.empty') }}
              </div>
            </template>
          </v-data-table>
        </AppCard>
      </v-col>

      <v-col cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="d-flex align-center gap-3 mb-4">
            <v-avatar color="surface-variant" size="44">
              <v-icon :icon="endpoint?.icon || category?.icon || 'mdi-information-outline'" :color="category?.color || 'primary'" />
            </v-avatar>
            <div>
              <h2 class="text-subtitle-1 font-weight-semibold mb-1">{{ endpoint?.label }}</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ category?.description }}</p>
            </div>
          </div>

          <v-list lines="two" density="comfortable">
            <v-list-item
              :title="t('pages.education.administration.table.type')"
              :subtitle="typeLabel"
              prepend-icon="mdi-tag-text-outline"
            />
            <v-list-item
              v-if="endpoint?.href"
              :title="t('pages.education.actions.visit')"
              :subtitle="endpoint.href"
              prepend-icon="mdi-link-variant"
            >
              <template #append>
                <v-btn
                  :href="endpoint.href"
                  target="_blank"
                  rel="noreferrer"
                  size="small"
                  variant="tonal"
                  color="primary"
                  prepend-icon="mdi-open-in-new"
                >
                  {{ t('common.open') || 'Open' }}
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>

      <v-col v-if="category?.items.length" cols="12" md="4">
        <AppCard class="pa-5" elevation="2">
          <h3 class="text-subtitle-1 font-weight-semibold mb-3">{{ t('pages.education.administration.title') }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-3">
            {{ t('pages.education.administration.subtitle') }}
          </p>
          <v-list density="compact">
            <v-list-item
              v-for="item in category.items"
              :key="item.slug"
              :title="item.label"
              :to="localePath({
                name: 'education-administration-category-endpoint',
                params: { category: categoryKey, endpoint: item.slug },
              })"
              :prepend-icon="item.icon || category.icon"
            >
              <template #append>
                <v-chip color="primary" variant="tonal" size="x-small" label>
                  {{ item.type?.toUpperCase() || 'PAGE' }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
