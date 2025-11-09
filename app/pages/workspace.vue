<script setup lang="ts">
import WorkspaceManager from '~/components/workspace/WorkspaceManager.vue'

definePageMeta({
  title: 'navigation.workspace',
  middleware: 'auth',
  icon: 'mdi-folder-account',
  drawerIndex: 4,
})
</script>

<template>
  <WorkspaceManager />
</template>
