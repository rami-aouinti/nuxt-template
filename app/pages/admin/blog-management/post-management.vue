<script setup lang="ts">
definePageMeta({
  title: 'navigation.posts',
  icon: 'mdi-post-outline',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
</script>

<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title>{{ t('navigation.posts') }}</v-card-title>
      <v-card-text>
        {{ t('admin.blogManagement.placeholders.underConstruction') }}
      </v-card-text>
    </v-card>
  </v-container>
</template>
