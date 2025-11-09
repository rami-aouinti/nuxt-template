<script setup lang="ts">
definePageMeta({
  title: 'navigation.admin',
  middleware: 'admin',
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>

<template>
  <NuxtPage />
</template>
