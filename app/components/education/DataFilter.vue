<template>
  <div class="data-filter">
    <AppButton
      color="primary"
      prepend-icon="mdi-filter-variant"
      variant="tonal"
      @click="toggleFilters"
    >
      {{ $t('Search') }}
    </AppButton>

    <v-expand-transition>
      <AppCard
        v-if="filtersExpanded"
        class="mt-3 pa-4 rounded-lg"
        color="primary"
        variant="tonal"
      >
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ $t('Affinez votre recherche avec des filtres modernes.') }}
        </div>
        <slot name="filter" />
        <div class="d-flex align-center gap-2 mt-4">
          <AppButton color="primary" variant="elevated" @click="handleFilter">
            {{ $t('Filter') }}
          </AppButton>
          <AppButton color="secondary" variant="tonal" @click="handleReset">
            {{ $t('Reset') }}
          </AppButton>
        </div>
      </AppCard>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ handleReset: () => void; handleFilter: () => void }>()

const filtersExpanded = ref(false)

const toggleFilters = () => {
  filtersExpanded.value = !filtersExpanded.value
}

const { handleFilter, handleReset } = props
</script>
