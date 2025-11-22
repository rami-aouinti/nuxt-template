<script setup lang="ts">
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'
import { useEducationMyCoursesEndpoints } from '~/composables/useEducationMyCoursesEndpoints'

definePageMeta({
  layout: 'default',
  title: 'navigation.educationMyCourses',
  icon: 'mdi-book-account-outline',
  drawerIndex: 1,
})

const { t } = useI18n()
const localePath = useLocalePath()
const { navLinks } = useEducationNavigation()
const { groups } = useEducationMyCoursesEndpoints()
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
              <h1 class="text-h5 font-weight-bold mb-1">Catalogue complet de mes endpoints</h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Tous les liens utiles pour gérer vos cours, activités, collaborations et préférences.
              </p>
            </div>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-view-dashboard-outline"
              :to="localePath('education-my-courses')"
            >
              {{ t('pages.education.actions.backToOverview') }}
            </v-btn>
          </div>
        </AppCard>
      </v-col>

      <v-col
        v-for="group in groups"
        :key="group.key"
        cols="12"
        md="6"
      >
        <AppCard class="pa-5 h-100" elevation="2">
          <div class="d-flex align-center justify-space-between mb-3">
            <div>
              <h2 class="text-subtitle-1 font-weight-semibold mb-1">{{ group.title }}</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ group.description }}</p>
            </div>
            <v-chip color="primary" variant="tonal" size="small" label>
              {{ group.items.length }} liens
            </v-chip>
          </div>
          <v-list density="comfortable" lines="two">
            <v-list-item
              v-for="item in group.items"
              :key="item.title"
              :title="item.title"
              :subtitle="item.description"
              :href="item.href"
              target="_blank"
              rel="noreferrer"
              :prepend-icon="item.icon"
            >
              <template #append>
                <v-chip color="primary" variant="tonal" size="x-small" label>
                  {{ item.type?.toUpperCase() || 'PAGE' }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
