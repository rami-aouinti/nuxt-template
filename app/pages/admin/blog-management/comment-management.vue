<script setup lang="ts">
definePageMeta({
  title: 'navigation.comments',
  icon: 'mdi-comment-text-outline',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
</script>

<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title>{{ t('navigation.comments') }}</v-card-title>
      <v-card-text>
        {{ t('admin.blogManagement.placeholders.underConstruction') }}
      </v-card-text>
    </v-card>
  </v-container>
</template>
