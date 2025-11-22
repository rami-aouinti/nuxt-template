<script setup lang="ts">
import AppNavigationList from '~/components/AppNavigationList.vue'
import AdminCategoryEndpoints from '~/components/education/AdminCategoryEndpoints.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'

definePageMeta({
  layout: 'default',
  title: 'pages.education.administration.categories.users.title',
  icon: 'mdi-account-cog-outline',
  drawerIndex: 3,
})

const { t } = useI18n()
const { navLinks } = useEducationNavigation()
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer">
        <AppNavigationList
          :items="navLinks"
          :title="t('pages.education.navigation.title')"
          :description="t('pages.education.navigation.description')"
        />
      </teleport>
    </client-only>
    <AdminCategoryEndpoints category-key="users" />
  </v-container>
</template>
