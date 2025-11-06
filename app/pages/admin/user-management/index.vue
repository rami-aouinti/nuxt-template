<script setup lang="ts">
definePageMeta({
  title: 'User Management',
  icon: 'mdi-account-cog-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>

<template>
  <IndexPage />
</template>
