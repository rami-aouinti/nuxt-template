<script setup lang="ts">
definePageMeta({
  title: 'navigation.blogs',
  icon: 'mdi-notebook-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
</script>

<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title>{{ t('navigation.blogs') }}</v-card-title>
      <v-card-text>
        {{ t('admin.blogManagement.placeholders.underConstruction') }}
      </v-card-text>
    </v-card>
  </v-container>
</template>
