<script setup lang="ts">
import ProfileNavigation from '~/components/profile/ProfileNavigation.vue'
</script>

<template>
  <v-container fluid class="py-6">
    <ProfileNavigation class="mb-6" />
    <slot />
  </v-container>
</template>
