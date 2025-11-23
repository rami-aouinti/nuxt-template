<template>
  <v-expansion-panels v-model="panel" variant="accordion" class="mb-4">
    <v-expansion-panel>
      <v-expansion-panel-title class="d-flex align-center ga-2">
        <v-icon icon="mdi-filter-variant" />
        <span class="text-subtitle-1">{{ $t('Filters') }}</span>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="py-2">
          <slot name="filter" />
        </div>

        <div class="d-flex ga-2 justify-end mt-3">
          <v-btn variant="tonal" color="secondary" @click="handleReset">
            {{ $t('Reset') }}
          </v-btn>
          <v-btn color="primary" @click="handleFilter">
            {{ $t('Filter') }}
          </v-btn>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { handleReset, handleFilter } = defineProps<{
  handleReset: () => void
  handleFilter: () => void
}>()

const panel = ref<number[]>([0])
</script>
