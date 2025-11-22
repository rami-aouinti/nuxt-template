<script setup lang="ts">
import { computed } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'

definePageMeta({
  layout: 'default',
  title: 'navigation.educationExploreCourses',
  icon: 'mdi-compass-rose',
  drawerIndex: 2,
})

const { t } = useI18n()
const { navLinks, baseUrl } = useEducationNavigation()

const catalogueRoutes = computed(() => [
  {
    icon: 'mdi-magnify-scan',
    title: t('pages.education.explore.catalog.search'),
    description: t('pages.education.explore.catalog.searchDescription'),
    href: `${baseUrl}/courses`,
  },
  {
    icon: 'mdi-trending-up',
    title: t('pages.education.explore.catalog.trending'),
    description: t('pages.education.explore.catalog.trendingDescription'),
    href: `${baseUrl}/courses/trending`,
  },
  {
    icon: 'mdi-new-box',
    title: t('pages.education.explore.catalog.new'),
    description: t('pages.education.explore.catalog.newDescription'),
    href: `${baseUrl}/courses/new`,
  },
])

const discoveryPills = computed(() => [
  {
    icon: 'mdi-shield-edit-outline',
    title: t('pages.education.explore.discovery.compliance'),
    href: `${baseUrl}/courses?focus=compliance`,
  },
  {
    icon: 'mdi-robot-outline',
    title: t('pages.education.explore.discovery.ai'),
    href: `${baseUrl}/courses?focus=ai`,
  },
  {
    icon: 'mdi-creation-outline',
    title: t('pages.education.explore.discovery.design'),
    href: `${baseUrl}/courses?focus=design`,
  },
  {
    icon: 'mdi-currency-usd',
    title: t('pages.education.explore.discovery.finance'),
    href: `${baseUrl}/courses?focus=finance`,
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
            {{ t('pages.education.explore.badge') }}
          </div>
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ t('pages.education.explore.title') }}
          </h1>
          <p class="text-body-1 text-medium-emphasis mb-4">
            {{ t('pages.education.explore.subtitle') }}
          </p>
          <v-row>
            <v-col v-for="route in catalogueRoutes" :key="route.title" cols="12" sm="4">
              <v-card variant="tonal" class="pa-4 h-100">
                <div class="d-flex align-center mb-3">
                  <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
                    <v-icon :icon="route.icon" color="primary" />
                  </v-avatar>
                  <h3 class="text-subtitle-1 font-weight-semibold mb-0">
                    {{ route.title }}
                  </h3>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ route.description }}
                </p>
                <v-btn
                  :href="route.href"
                  target="_blank"
                  rel="noreferrer"
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-open-in-new"
                >
                  {{ t('pages.education.actions.visit') }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </AppCard>
      </v-col>

      <v-col cols="12" md="4">
        <AppCard class="pa-5" elevation="2">
          <h2 class="text-subtitle-1 font-weight-semibold mb-4">
            {{ t('pages.education.explore.discovery.title') }}
          </h2>
          <div class="d-flex flex-wrap gap-3">
            <v-btn
              v-for="pill in discoveryPills"
              :key="pill.title"
              :href="pill.href"
              target="_blank"
              rel="noreferrer"
              variant="tonal"
              color="primary"
              class="text-none"
              :prepend-icon="pill.icon"
            >
              {{ pill.title }}
            </v-btn>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
