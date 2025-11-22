<script setup lang="ts">
import { computed } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'

definePageMeta({
  layout: 'default',
  title: 'navigation.educationMyCourses',
  icon: 'mdi-book-account-outline',
  drawerIndex: 1,
})

const { t } = useI18n()
const { navLinks, baseUrl } = useEducationNavigation()

const courseEndpoints = computed(() => [
  {
    icon: 'mdi-format-list-bulleted',
    title: t('pages.education.myCourses.endpoints.catalog'),
    description: t('pages.education.myCourses.endpoints.catalogDescription'),
    href: `${baseUrl}/my-courses`,
  },
  {
    icon: 'mdi-progress-check',
    title: t('pages.education.myCourses.endpoints.progress'),
    description: t('pages.education.myCourses.endpoints.progressDescription'),
    href: `${baseUrl}/my-courses/progress`,
  },
  {
    icon: 'mdi-certificate-outline',
    title: t('pages.education.myCourses.endpoints.certificates'),
    description: t('pages.education.myCourses.endpoints.certificatesDescription'),
    href: `${baseUrl}/certificates`,
  },
])

const learningTools = computed(() => [
  {
    icon: 'mdi-calendar-check-outline',
    title: t('pages.education.myCourses.tools.agenda'),
    description: t('pages.education.myCourses.tools.agendaDescription'),
    href: `${baseUrl}/calendar`,
  },
  {
    icon: 'mdi-clipboard-text-outline',
    title: t('pages.education.myCourses.tools.assignments'),
    description: t('pages.education.myCourses.tools.assignmentsDescription'),
    href: `${baseUrl}/my-courses/assignments`,
  },
  {
    icon: 'mdi-comment-quote-outline',
    title: t('pages.education.myCourses.tools.feedback'),
    description: t('pages.education.myCourses.tools.feedbackDescription'),
    href: `${baseUrl}/feedback`,
  },
])
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

    <v-row class="gy-6" justify="center">
      <v-col cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="animated-badge mb-4">
            <span class="animated-badge__pulse" />
            {{ t('pages.education.myCourses.badge') }}
          </div>
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ t('pages.education.myCourses.title') }}
          </h1>
          <p class="text-body-1 text-medium-emphasis mb-4">
            {{ t('pages.education.myCourses.subtitle') }}
          </p>
          <v-list lines="three" density="comfortable">
            <v-list-item
              v-for="endpoint in courseEndpoints"
              :key="endpoint.title"
              :title="endpoint.title"
              :subtitle="endpoint.description"
              :prepend-icon="endpoint.icon"
              :href="endpoint.href"
              target="_blank"
              rel="noreferrer"
            >
              <template #append>
                <v-icon icon="mdi-open-in-new" size="18" />
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>

      <v-col cols="12" md="4">
        <AppCard class="pa-5" elevation="2">
          <h2 class="text-subtitle-1 font-weight-semibold mb-3">
            {{ t('pages.education.myCourses.tools.title') }}
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('pages.education.myCourses.tools.description') }}
          </p>
          <v-list density="compact">
            <v-list-item
              v-for="tool in learningTools"
              :key="tool.title"
              :title="tool.title"
              :subtitle="tool.description"
              :prepend-icon="tool.icon"
              :href="tool.href"
              target="_blank"
              rel="noreferrer"
            >
              <template #append>
                <v-icon icon="mdi-open-in-new" size="18" />
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
