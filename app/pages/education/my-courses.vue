<script setup lang="ts">
import { computed } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationApi } from '~/composables/useEducationApi'
import { useEducationNavigation } from '~/composables/useEducationNavigation'
import { useEducationMyCoursesEndpoints } from '~/composables/useEducationMyCoursesEndpoints'
import type { ApiPlatformCollection } from '~/utils/apiPlatform'
import { extractApiPlatformCollectionItems } from '~/utils/apiPlatform'
import type { Camelize } from '~/utils/casing'
import type { Course } from '~/types/education'

definePageMeta({
  layout: 'default',
  title: 'navigation.educationMyCourses',
  icon: 'mdi-book-account-outline',
  drawerIndex: 1,
})

const { t } = useI18n()
const localePath = useLocalePath()
const educationApi = useEducationApi()
const { navLinks, baseUrl } = useEducationNavigation()
const { groups: endpointGroups, primaryShortcuts } = useEducationMyCoursesEndpoints()

type EducationCourse = Camelize<Course>

const {
  data: myCourses,
  pending: myCoursesPending,
  error: myCoursesError,
} = await useAsyncData<EducationCourse[]>(
  'education-my-courses',
  async () => {
    try {
      const collection = await educationApi.courses.list<
        ApiPlatformCollection<EducationCourse>
      >()
      const items = extractApiPlatformCollectionItems(collection)

      if (items.length) {
        return items
      }
    }
    catch (error) {
      console.warn('Unable to load enrolled courses, using public catalog instead', error)
    }

    const fallback = await educationApi.courses.publicList<
      ApiPlatformCollection<EducationCourse>
    >()
    return extractApiPlatformCollectionItems(fallback)
  },
  { default: () => [] },
)

const myCoursesState = computed(() => ({
  isLoading: myCoursesPending.value,
  hasError: Boolean(myCoursesError.value),
  hasCourses: myCourses.value.length > 0,
}))

const recentCourses = computed(() => myCourses.value.slice(0, 4))

const courseEndpoints = computed(() => primaryShortcuts.value)

const learningTools = computed(() => endpointGroups.value.find((group) => group.key === 'collaboration')?.items || [])
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
          <div class="d-flex align-center justify-space-between gap-4 flex-wrap">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">
                {{ t('pages.education.myCourses.title') }}
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-0">
                {{ t('pages.education.myCourses.subtitle') }}
              </p>
            </div>
            <v-btn
              variant="text"
              color="primary"
              prepend-icon="mdi-open-in-new"
              :href="baseUrl"
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir la plateforme
            </v-btn>
          </div>
          <p class="text-body-1 text-medium-emphasis mt-4 mb-0">
            Explorez vos cours inscrits et les raccourcis liés. Retrouvez l'intégralité des endpoints dans la page dédiée.
          </p>
          <v-list lines="three" density="comfortable">
            <v-list-item
              v-for="endpoint in courseEndpoints"
              :key="endpoint.title"
              :title="endpoint.title"
              :subtitle="endpoint.description"
              :prepend-icon="endpoint.icon"
              :to="localePath({ name: `education-my-courses-${endpoint.slug}` })"
            >
              <template #append>
                <v-icon icon="mdi-arrow-right" size="18" />
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>

      <v-col cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h2 class="text-h6 font-weight-semibold mb-1">
                {{ t('pages.education.myCourses.latest.title') }}
              </h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ t('pages.education.myCourses.latest.subtitle') }}
              </p>
            </div>
            <v-btn
              variant="text"
              color="primary"
              :href="courseEndpoints[0]?.href"
              target="_blank"
              rel="noreferrer"
              prepend-icon="mdi-open-in-new"
            >
              {{ t('pages.education.actions.visit') }}
            </v-btn>
          </div>

          <v-alert
            v-if="myCoursesState.hasError"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('pages.education.myCourses.latest.error') }}
          </v-alert>

          <v-list v-if="myCoursesState.isLoading" density="comfortable">
            <v-list-item v-for="index in 3" :key="index">
              <v-skeleton-loader type="list-item-two-line" />
            </v-list-item>
          </v-list>

          <v-list v-else-if="myCoursesState.hasCourses" lines="three" density="comfortable">
            <v-list-item
              v-for="course in recentCourses"
              :key="course.code"
              :title="course.title || course.code"
              :subtitle="course.description || t('pages.education.myCourses.latest.noDescription')"
              :href="`${baseUrl}/courses/${course.code}`"
              target="_blank"
              rel="noreferrer"
              prepend-icon="mdi-book-open-outline"
            >
              <template #append>
                <div class="text-caption text-medium-emphasis text-right">
                  <div>{{ t('pages.education.myCourses.latest.language') }} {{ course.courseLanguage }}</div>
                  <div>
                    {{ t('pages.education.myCourses.latest.visibility') }}
                    {{ course.visibility === 0 ? t('pages.education.myCourses.latest.private') : t('pages.education.myCourses.latest.public') }}
                  </div>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <div v-else class="text-body-2 text-medium-emphasis">
            {{ t('pages.education.myCourses.latest.empty') }}
          </div>
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
