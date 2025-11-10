<script setup lang="ts">
definePageMeta({
  title: 'navigation.admin',
  icon: 'mdi-shield-half-full',
  drawerIndex: 0,
  middleware: 'admin',
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>

<template>
  <NuxtPage />
</template>
