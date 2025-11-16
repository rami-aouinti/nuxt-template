<template>
  <IndexPage />
</template>
<script setup lang="ts">
definePageMeta({
  title: 'admin.ecommerce.navigationGroups.customerManagement',
  icon: 'mdi-account-group-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>
