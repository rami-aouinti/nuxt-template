<template>
  <AppCard class="pa-5 d-flex flex-column gap-4" variant="outlined">
    <header class="d-flex flex-column gap-1">
      <div class="text-subtitle-1 font-weight-bold">{{ heading }}</div>
      <p class="text-body-2 text-medium-emphasis mb-0">
        Accès direct aux composants du dossier <code>education/views</code>.
      </p>
    </header>

    <div class="legacy-view-list__divider" />

    <div class="d-flex flex-column gap-4">
      <div
        v-for="(items, category) in groupedViews"
        :key="category"
        class="d-flex flex-column gap-2"
      >
        <div class="text-subtitle-2 text-medium-emphasis text-uppercase">
          {{ category }}
        </div>

        <AppList
          :items="toListItems(items)"
          density="compact"
          nav
          border
          class="legacy-view-list__list"
        />
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { LegacyViewEntry } from '~/utils/education/legacyViews'
import { legacyViewSlugToPath } from '~/utils/education/legacyRoutes'

const props = defineProps<{
  views: LegacyViewEntry[]
  title?: string
}>()

const heading = computed(() => props.title ?? 'Toutes les vues legacy')

const groupedViews = computed(() =>
  props.views.reduce<Record<string, LegacyViewEntry[]>>((groups, entry) => {
    if (!groups[entry.category]) {
      groups[entry.category] = []
    }

    groups[entry.category].push(entry)

    return groups
  }, {}),
)

const buildLink = (slug: string) => legacyViewSlugToPath(slug)
const toListItems = (items: LegacyViewEntry[]) =>
  items.map((item) => ({
    title: item.name,
    subtitle: item.slug,
    to: buildLink(item.slug),
  }))
</script>

<style scoped>
.legacy-view-list__divider {
  height: 1px;
  background: rgba(var(--v-theme-primary), 0.12);
}

.legacy-view-list__list {
  --app-shadow: 0 12px 30px rgba(var(--v-theme-primary), 0.12);
}
</style>
