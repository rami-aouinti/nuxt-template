<script setup lang="ts">
definePageMeta({
  title: 'navigation.admin',
  icon: 'mdi-shield-account',
  drawerIndex: 6,
  middleware: 'admin',
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
  layout: 'admin',
})
</script>

<template>
  <NuxtPage />
</template>
