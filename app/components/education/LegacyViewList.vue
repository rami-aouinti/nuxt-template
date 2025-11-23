<template>
  <v-card variant="outlined">
    <v-card-item>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        {{ heading }}
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis">
        Accès direct aux composants du dossier <code>education/views</code>.
      </v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-card-text class="d-flex flex-column gap-4">
      <div
        v-for="(items, category) in groupedViews"
        :key="category"
        class="d-flex flex-column gap-2"
      >
        <div class="text-subtitle-2 text-medium-emphasis text-uppercase">
          {{ category }}
        </div>

        <v-list density="compact" nav>
          <v-list-item
            v-for="item in items"
            :key="item.slug"
            :title="item.name"
            :subtitle="item.slug"
            :to="`/education/views/${item.slug}`"
            link
          />
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { LegacyViewEntry } from '~/utils/education/legacyViews'

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
</script>
