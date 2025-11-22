<script setup lang="ts">
import AppNavigationList from '~/components/AppNavigationList.vue'
import MyCourseEndpointPage from '~/components/education/MyCourseEndpointPage.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'

definePageMeta({
  layout: 'default',
  title: 'pages.education.myCourses.endpoints.settings',
  icon: 'mdi-shield-check-outline',
  drawerIndex: 1,
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
    <MyCourseEndpointPage slug="accessibilite-et-securite" />
  </v-container>
</template>
