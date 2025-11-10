<script setup lang="ts">
import ProfileNavigation from '~/components/profile/ProfileNavigation.vue'
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer">
        <ProfileNavigation class="mb-6" />
      </teleport>
    </client-only>
    <slot />
  </v-container>
</template>
