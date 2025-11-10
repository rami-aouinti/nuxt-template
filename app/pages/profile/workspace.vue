<script setup lang="ts">
import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import WorkspaceManager from '~/components/workspace/WorkspaceManager.vue'

definePageMeta({
  title: 'navigation.profileWorkspace',
  middleware: 'auth',
})
</script>

<template>
  <ProfilePageShell>
    <WorkspaceManager />
  </ProfilePageShell>
</template>
