<template>
  <IndexPage />
</template>
<script setup lang="ts">
definePageMeta({
  title: 'admin.ecommerce.navigationGroups.productsManagement',
  icon: 'mdi-package-variant-closed',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>
