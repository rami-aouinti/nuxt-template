<script setup lang="ts">
definePageMeta({
  title: 'navigation.admin',
  icon: 'mdi-shield-account',
  drawerIndex: 6,
  middleware: 'admin',
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>

<template>
  <NuxtPage />
</template>
