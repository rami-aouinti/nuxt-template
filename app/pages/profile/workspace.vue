<script setup lang="ts">
import ProfileNavigation from '~/components/profile/ProfileNavigation.vue'
import WorkspaceManager from '~/components/workspace/WorkspaceManager.vue'

definePageMeta({
  title: 'navigation.profileWorkspace',
  middleware: 'auth',
})
</script>

<template>
  <WorkspaceManager>
    <template #header>
      <ProfileNavigation class="mb-6" />
    </template>
  </WorkspaceManager>
</template>
