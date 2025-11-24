<template>
  <AppCard class="h-100 d-flex flex-column pa-6 gap-4" variant="outlined">
    <header class="d-flex flex-column gap-1">
      <div class="text-overline text-medium-emphasis mb-1">
        {{ module.category }}
      </div>
      <div class="text-h6 font-weight-bold">{{ module.title }}</div>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ module.summary }}</p>
    </header>

    <div class="module-card__divider" />

    <ul class="module-card__list flex-grow-1">
      <li v-for="highlight in module.highlights" :key="highlight">
        <v-icon icon="mdi-check-circle" size="18" class="text-primary" />
        <span class="text-body-2">{{ highlight }}</span>
      </li>
    </ul>

    <footer class="d-flex align-center justify-space-between">
      <div class="text-caption text-medium-emphasis">
        {{ module.relatedViews.length }} vues migrées
      </div>
      <AppButton
        :to="moduleTarget"
        color="primary"
        size="small"
        variant="tonal"
      >
        Ouvrir
      </AppButton>
    </footer>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EducationModule } from '~/utils/education/modules'

const props = defineProps<{
  module: EducationModule
}>()

const moduleTarget = computed(
  () => props.module.path ?? `/education/${props.module.slug}`,
)
</script>

<style scoped>
.module-card__divider {
  height: 1px;
  background: rgba(var(--v-theme-primary), 0.14);
}

.module-card__list {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
}

.module-card__list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.06);
}
</style>
