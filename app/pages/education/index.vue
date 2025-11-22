<script setup lang="ts">
import { computed } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationApi } from '~/composables/useEducationApi'
import { useEducationNavigation } from '~/composables/useEducationNavigation'
import type { ApiPlatformCollection } from '~/utils/apiPlatform'
import { extractCollectionItems } from '~/utils/apiPlatform'
import type { Camelize } from '~/utils/casing'
import type { Course } from '~/types/education'

definePageMeta({
  layout: 'default',
  title: 'navigation.education',
  icon: 'mdi-school-outline',
  drawerIndex: 4,
})

type EducationCourse = Camelize<Course>

const { t } = useI18n()
const educationApi = useEducationApi()
const { navLinks, platformRoutes, baseUrl } = useEducationNavigation()

const {
  data: featuredCourses,
  pending: coursesPending,
  error: coursesError,
} = await useAsyncData<EducationCourse[]>(
  'education-public-courses',
  async () => {
    const collection = await educationApi.courses.publicList<
      ApiPlatformCollection<EducationCourse>
    >()
    return extractCollectionItems(collection).slice(0, 3)
  },
  { default: () => [] },
)

const discoveryRoutes = computed(() => [
  {
    icon: 'mdi-view-grid-plus',
    title: t('pages.education.discovery.collections.title'),
    description: t('pages.education.discovery.collections.description'),
    href: `${baseUrl}/collections`,
  },
  {
    icon: 'mdi-puzzle-check-outline',
    title: t('pages.education.discovery.paths.title'),
    description: t('pages.education.discovery.paths.description'),
    href: `${baseUrl}/learning-paths`,
  },
  {
    icon: 'mdi-forum-outline',
    title: t('pages.education.discovery.community.title'),
    description: t('pages.education.discovery.community.description'),
    href: `${baseUrl}/community`,
  },
])

const featuredState = computed(() => ({
  isLoading: coursesPending.value,
  hasError: Boolean(coursesError.value),
  hasCourses: featuredCourses.value.length > 0,
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

    <v-row justify="center" class="gy-6">
      <v-col cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="d-flex flex-column flex-md-row justify-space-between align-center">
            <div>
              <div class="animated-badge mb-4">
                <span class="animated-badge__pulse" />
                {{ t('pages.education.hero.badge') }}
              </div>
              <h1 class="text-h4 text-md-h3 font-weight-bold mb-3">
                {{ t('pages.education.hero.title') }}
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-4">
                {{ t('pages.education.hero.subtitle') }}
              </p>
              <div class="d-flex flex-wrap align-center gap-3">
                <v-btn
                  color="primary"
                  :href="baseUrl"
                  target="_blank"
                  rel="noreferrer"
                  prepend-icon="mdi-open-in-new"
                >
                  {{ t('pages.education.hero.cta') }}
                </v-btn>
                <v-btn
                  variant="text"
                  color="primary"
                  :to="navLinks[2]?.to"
                  prepend-icon="mdi-compass-outline"
                >
                  {{ t('pages.education.hero.secondaryCta') }}
                </v-btn>
              </div>
            </div>
            <v-avatar color="primary" size="104" variant="tonal" class="mt-6 mt-md-0">
              <v-icon icon="mdi-school-outline" size="56" color="primary" />
            </v-avatar>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" md="4">
        <AppCard class="pa-4" elevation="2">
          <AppNavigationList
            class="mb-4"
            :items="navLinks"
            :title="t('pages.education.navigation.quickAccess.title')"
            :description="t('pages.education.navigation.quickAccess.description')"
          />
          <v-divider class="my-2" />
          <h3 class="text-subtitle-1 font-weight-semibold mb-3">
            {{ t('pages.education.routes.title') }}
          </h3>
          <v-list density="compact">
            <v-list-item
              v-for="route in platformRoutes"
              :key="route.label"
              :title="route.label"
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

      <v-col cols="12" md="6">
        <AppCard class="pa-5" elevation="2">
          <h2 class="text-h5 font-weight-semibold mb-4">
            {{ t('pages.education.sections.featuredTitle') }}
          </h2>
          <v-alert
            v-if="featuredState.hasError"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('pages.education.notifications.featuredError') }}
          </v-alert>

          <v-row v-if="featuredState.isLoading" class="gy-4">
            <v-col v-for="index in 3" :key="index" cols="12" sm="6">
              <v-skeleton-loader
                type="heading, subtitle, paragraph"
                class="pa-4 rounded"
                color="transparent"
              />
            </v-col>
          </v-row>

          <v-row v-else-if="featuredState.hasCourses" class="gy-4">
            <v-col v-for="course in featuredCourses" :key="course.code" cols="12" sm="6">
              <v-card variant="tonal" class="pa-4 h-100">
                <div class="d-flex align-center mb-3">
                  <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
                    <v-icon icon="mdi-school-outline" color="primary" />
                  </v-avatar>
                  <div>
                    <h3 class="text-subtitle-1 font-weight-semibold mb-0">
                      {{ course.title || course.code }}
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-0">
                      {{ course.courseLanguage?.toUpperCase() || 'N/A' }} •
                      {{ course.visibility === 0 ? 'Private' : 'Public' }}
                    </p>
                  </div>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ course.description || t('pages.education.sections.gettingStarted.description') }}
                </p>
                <v-btn
                  :href="`${baseUrl}/courses/${course.code}`"
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
            {{ t('pages.education.notifications.noFeatured') }}
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" md="6">
        <AppCard class="pa-5" elevation="2">
          <h2 class="text-h5 font-weight-semibold mb-4">
            {{ t('pages.education.discovery.title') }}
          </h2>
          <v-list lines="three" density="comfortable">
            <v-list-item
              v-for="route in discoveryRoutes"
              :key="route.title"
              :title="route.title"
              :subtitle="route.description"
              :prepend-icon="route.icon"
            >
              <template #append>
                <v-btn
                  icon="mdi-open-in-new"
                  variant="text"
                  color="primary"
                  :href="route.href"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open section"
                />
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
