<script setup lang="ts">
import { computed } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'

definePageMeta({
  layout: 'default',
  title: 'navigation.educationAdministration',
  icon: 'mdi-shield-crown-outline',
  drawerIndex: 3,
})

const { t } = useI18n()
const { navLinks, baseUrl } = useEducationNavigation()

const adminRoutes = computed(() => [
  {
    icon: 'mdi-shield-lock-outline',
    title: t('pages.education.administration.routes.dashboard'),
    description: t('pages.education.administration.routes.dashboardDescription'),
    href: `${baseUrl}/admin`,
  },
  {
    icon: 'mdi-human-male-board',
    title: t('pages.education.administration.routes.instructors'),
    description: t('pages.education.administration.routes.instructorsDescription'),
    href: `${baseUrl}/admin/instructors`,
  },
  {
    icon: 'mdi-book-cog-outline',
    title: t('pages.education.administration.routes.courses'),
    description: t('pages.education.administration.routes.coursesDescription'),
    href: `${baseUrl}/admin/courses`,
  },
  {
    icon: 'mdi-account-group-outline',
    title: t('pages.education.administration.routes.learners'),
    description: t('pages.education.administration.routes.learnersDescription'),
    href: `${baseUrl}/admin/learners`,
  },
])

const governance = computed(() => [
  {
    icon: 'mdi-shield-alert-outline',
    title: t('pages.education.administration.governance.compliance'),
    description: t('pages.education.administration.governance.complianceDescription'),
    href: `${baseUrl}/admin/compliance`,
  },
  {
    icon: 'mdi-chart-box-outline',
    title: t('pages.education.administration.governance.analytics'),
    description: t('pages.education.administration.governance.analyticsDescription'),
    href: `${baseUrl}/analytics`,
  },
  {
    icon: 'mdi-domain',
    title: t('pages.education.administration.governance.integrations'),
    description: t('pages.education.administration.governance.integrationsDescription'),
    href: `${baseUrl}/admin/integrations`,
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
            {{ t('pages.education.administration.badge') }}
          </div>
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ t('pages.education.administration.title') }}
          </h1>
          <p class="text-body-1 text-medium-emphasis mb-4">
            {{ t('pages.education.administration.subtitle') }}
          </p>
          <v-list lines="three" density="comfortable">
            <v-list-item
              v-for="route in adminRoutes"
              :key="route.title"
              :title="route.title"
              :subtitle="route.description"
              :prepend-icon="route.icon"
              :href="route.href"
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
            {{ t('pages.education.administration.governance.title') }}
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('pages.education.administration.governance.description') }}
          </p>
          <v-list density="compact">
            <v-list-item
              v-for="item in governance"
              :key="item.title"
              :title="item.title"
              :subtitle="item.description"
              :prepend-icon="item.icon"
              :href="item.href"
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
