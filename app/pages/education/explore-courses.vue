<script setup lang="ts">
import { computed } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationApi } from '~/composables/useEducationApi'
import { useEducationNavigation } from '~/composables/useEducationNavigation'
import type { ApiPlatformCollection } from '~/utils/apiPlatform'
import { extractApiPlatformCollectionItems } from '~/utils/apiPlatform'
import type { Camelize } from '~/utils/casing'
import type { Course, CourseCategory } from '~/types/education'

definePageMeta({
  layout: 'default',
  title: 'navigation.educationExploreCourses',
  icon: 'mdi-compass-rose',
  drawerIndex: 2,
})

const { t } = useI18n()
const educationApi = useEducationApi()
const { navLinks, baseUrl } = useEducationNavigation()

type EducationCourse = Camelize<Course>
type EducationCategory = Camelize<CourseCategory>

const {
  data: trendingCourses,
  pending: trendingPending,
  error: trendingError,
} = await useAsyncData<EducationCourse[]>(
  'education-explore-trending',
  async () => {
    const collection = await educationApi.courses.publicList<
      ApiPlatformCollection<EducationCourse>
    >()
    return extractApiPlatformCollectionItems(collection).slice(0, 3)
  },
  { default: () => [] },
)

const {
  data: categories,
  pending: categoriesPending,
  error: categoriesError,
} = await useAsyncData<EducationCategory[]>(
  'education-explore-categories',
  async () => {
    const collection = await educationApi.courseCategories.list<
      ApiPlatformCollection<EducationCategory>
    >()
    return extractApiPlatformCollectionItems(collection).slice(0, 6)
  },
  { default: () => [] },
)

const fallbackRoutes = computed(() => [
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

const catalogueRoutes = computed(() => {
  if (trendingCourses.value.length) {
    return trendingCourses.value.map((course) => ({
      icon: 'mdi-star-circle-outline',
      title: course.title || course.code,
      description: course.description || t('pages.education.explore.catalog.trendingDescription'),
      href: `${baseUrl}/courses/${course.code}`,
    }))
  }

  return fallbackRoutes.value
})

const discoveryPills = computed(() => {
  if (categories.value.length) {
    return categories.value.map((category) => ({
      icon: 'mdi-label-outline',
      title: category.title,
      href: `${baseUrl}/courses?category=${category.code}`,
    }))
  }

  return [
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
  ]
})

const exploreState = computed(() => ({
  isLoading: trendingPending.value,
  hasError: Boolean(trendingError.value),
}))

const categoryState = computed(() => ({
  isLoading: categoriesPending.value,
  hasError: Boolean(categoriesError.value),
}))
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
          <v-alert
            v-if="exploreState.hasError"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('pages.education.explore.notifications.trendingError') }}
          </v-alert>

          <v-row v-if="exploreState.isLoading" class="gy-4">
            <v-col v-for="index in 3" :key="index" cols="12" sm="4">
              <v-skeleton-loader
                type="heading, subtitle, paragraph"
                class="pa-4 rounded"
                color="transparent"
              />
            </v-col>
          </v-row>

          <v-row v-else-if="catalogueRoutes.length" class="gy-4">
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

          <div v-else class="text-body-2 text-medium-emphasis">
            {{ t('pages.education.explore.notifications.noTrending') }}
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" md="4">
        <AppCard class="pa-5" elevation="2">
          <h2 class="text-subtitle-1 font-weight-semibold mb-4">
            {{ t('pages.education.explore.discovery.title') }}
          </h2>
          <v-alert
            v-if="categoryState.hasError"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('pages.education.explore.notifications.categoryError') }}
          </v-alert>

          <div v-if="categoryState.isLoading" class="d-flex flex-column gap-2">
            <v-skeleton-loader v-for="index in 4" :key="index" type="chip" />
          </div>

          <div v-else-if="discoveryPills.length" class="d-flex flex-wrap gap-3">
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

          <div v-else class="text-body-2 text-medium-emphasis">
            {{ t('pages.education.explore.notifications.noCategories') }}
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
