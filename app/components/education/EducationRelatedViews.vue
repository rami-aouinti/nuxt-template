<template>
  <v-card variant="outlined">
    <v-card-item>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Vues source
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis">
        Provenant du dossier <code>education/views</code> pour guider la migration.
      </v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-card-text>
      <v-chip-group
        column
        class="d-flex flex-wrap gap-2"
      >
      <v-chip
        v-for="view in views"
        :key="view"
        color="primary"
        label
        variant="tonal"
        :to="buildLink(view)"
        component="NuxtLink"
      >
        {{ view.replace(/\.vue$/, '') }}
      </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  views: string[]
}>()

const buildLink = (view: string) => `/education/views/${view.replace(/\.vue$/, '')}`
</script>
