<template>
  <AppCard class="pa-5 d-flex flex-column gap-4" variant="outlined">
    <header class="d-flex flex-column gap-1">
      <div class="text-subtitle-1 font-weight-bold">Vues source</div>
      <p class="text-body-2 text-medium-emphasis mb-0">
        Provenant du dossier <code>education/views</code> pour guider la
        migration.
      </p>
    </header>

    <div class="related-views__divider" />

    <div class="d-flex flex-wrap gap-2">
      <AppButton
        v-for="view in views"
        :key="view"
        :to="buildLink(view)"
        color="primary"
        variant="tonal"
        size="small"
        class="related-views__chip"
      >
        {{ label(view) }}
      </AppButton>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import {
  legacyViewSlugToLabel,
  legacyViewSlugToPath,
} from '~/utils/education/legacyRoutes'

defineProps<{
  views: string[]
}>()

const buildLink = (view: string) => legacyViewSlugToPath(view)
const label = (view: string) => legacyViewSlugToLabel(view)
</script>

<style scoped>
.related-views__divider {
  height: 1px;
  background: rgba(var(--v-theme-primary), 0.12);
}

.related-views__chip {
  border-radius: 999px !important;
  text-transform: none;
  font-weight: 600;
}
</style>
