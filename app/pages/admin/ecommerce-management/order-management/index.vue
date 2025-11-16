<template>
  <IndexPage />
</template>
<script setup lang="ts">
definePageMeta({
  title: 'admin.ecommerce.navigationGroups.orderManagement',
  icon: 'mdi-receipt-text-outline',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>
