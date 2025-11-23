<template>
  <v-card variant="outlined">
    <v-card-item>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Parcours proposé
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis">
        Synthèse des fonctionnalités clés issues de la migration.
      </v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-card-text>
      <v-list density="comfortable">
        <v-list-item
          v-for="highlight in highlights"
          :key="highlight"
          prepend-icon="mdi-check-circle-outline"
        >
          <v-list-item-title class="text-body-2">
            {{ highlight }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  highlights: string[]
}>()
</script>
