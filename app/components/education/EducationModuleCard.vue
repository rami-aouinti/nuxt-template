<template>
  <v-card
    class="h-100 d-flex flex-column"
    variant="outlined"
  >
    <v-card-item>
      <div class="text-overline text-medium-emphasis mb-1">
        {{ module.category }}
      </div>
      <v-card-title class="text-h6 font-weight-bold">
        {{ module.title }}
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis">
        {{ module.summary }}
      </v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-card-text class="flex-grow-1">
      <v-list density="compact">
        <v-list-item
          v-for="highlight in module.highlights"
          :key="highlight"
          prepend-icon="mdi-check-circle"
          title=""
        >
          <v-list-item-title class="text-body-2">
            {{ highlight }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions class="px-6 pb-4 pt-0 d-flex justify-space-between">
      <div class="text-caption text-medium-emphasis">
        {{ module.relatedViews.length }} vues migrées
      </div>
      <v-btn
        :to="moduleTarget"
        color="primary"
        size="small"
        variant="tonal"
      >
        Ouvrir
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EducationModule } from '~/utils/education/modules'

const props = defineProps<{
  module: EducationModule
}>()

const moduleTarget = computed(() => props.module.path ?? `/education/${props.module.slug}`)
</script>
