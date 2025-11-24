<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '~/components/App/AppCard.vue'
import EducationShell from '~/components/education/EducationShell.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'

definePageMeta({
  title: 'Education',
})

const { t } = useI18n()
const localePath = useLocalePath()
const { platformRoutes } = useEducationNavigation()

const quickAccessItems = platformRoutes

const featuredRoutes = computed(() => [
  {
    icon: 'mdi-home-variant-outline',
    title: t('pages.education.sections.gettingStarted.title'),
    description: t('pages.education.sections.gettingStarted.description'),
      to: localePath('/education/course/catalogue-courses'),
  },
  {
    icon: 'mdi-progress-check',
    title: t('pages.education.sections.progress.title'),
    description: t('pages.education.sections.progress.description'),
      to: localePath('/education/user/courses/list'),
  },
  {
    icon: 'mdi-flask-outline',
    title: t('pages.education.sections.labs.title'),
    description: t('pages.education.sections.labs.description'),
      to: localePath('/education/course/course-home'),
  },
])

const discoveryItems = computed(() => [
  {
    icon: 'mdi-playlist-check',
    title: t('pages.education.discovery.collections.title'),
    description: t('pages.education.discovery.collections.description'),
      to: localePath('/education/links/list'),
  },
  {
    icon: 'mdi-map-marker-path',
    title: t('pages.education.discovery.paths.title'),
    description: t('pages.education.discovery.paths.description'),
      to: localePath('/education/terms/list'),
  },
  {
    icon: 'mdi-account-group-outline',
    title: t('pages.education.discovery.community.title'),
    description: t('pages.education.discovery.community.description'),
      to: localePath('/education/blog/blog-posts'),
  },
])
</script>

<template>
  <EducationShell>
    <v-container fluid class="py-8">
      <v-row>
        <v-col cols="12">
          <AppCard class="pa-6 hero" elevation="3" hover>
            <div class="d-flex flex-column flex-md-row align-center justify-space-between gap-6">
              <div class="d-flex flex-column gap-2">
                <div class="animated-badge">
                  <span class="animated-badge__pulse" />
                  {{ t('pages.education.hero.badge') }}
                </div>
                <div class="text-h5 text-md-h4 font-weight-bold">
                  {{ t('pages.education.hero.title') }}
                </div>
                <p class="text-body-2 text-medium-emphasis">
                  {{ t('pages.education.hero.subtitle') }}
                </p>
                <div class="d-flex flex-wrap gap-3">
                  <v-btn
                    color="primary"
                    variant="flat"
                  :to="localePath('/education/course/catalogue-courses')"
                  >
                    <v-icon icon="mdi-open-in-new" start />
                    {{ t('pages.education.hero.cta') }}
                  </v-btn>
                  <v-btn
                    color="secondary"
                    variant="text"
                  :to="localePath('/education/course/list')"
                  >
                    <v-icon icon="mdi-compass-rose" start />
                    {{ t('pages.education.hero.secondaryCta') }}
                  </v-btn>
                </div>
              </div>
              <div class="hero-cta text-medium-emphasis">
                <div class="text-subtitle-1 font-weight-bold mb-2">
                  {{ t('pages.education.routes.title') }}
                </div>
                <ul class="ps-4">
                  <li v-for="route in quickAccessItems" :key="route.to">
                    <NuxtLink :to="route.to">
                      {{ route.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </AppCard>
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col v-for="route in featuredRoutes" :key="route.title" cols="12" md="4">
          <AppCard class="pa-5 h-100 glass-card" elevation="2" hover>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="d-flex align-center gap-3">
                <v-avatar color="primary" variant="tonal" size="46">
                  <v-icon :icon="route.icon" size="24" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ route.title }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ route.description }}
                  </div>
                </div>
              </div>
              <v-btn
                icon
                variant="tonal"
                color="primary"
                :to="route.to"
              >
                <v-icon icon="mdi-open-in-new" />
              </v-btn>
            </div>
          </AppCard>
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col cols="12" md="6">
          <AppCard class="pa-5 h-100" elevation="2" hover>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-h6 font-weight-bold">
                {{ t('pages.education.routes.title') }}
              </div>
              <div class="animated-badge">
                <span class="animated-badge__pulse" />
                {{ t('pages.education.hero.badge') }}
              </div>
            </div>
            <div class="d-flex flex-column gap-3">
              <div
                v-for="route in quickAccessItems"
                :key="route.to"
                class="d-flex align-center justify-space-between route-pill"
              >
                <div class="d-flex align-center gap-3">
                  <v-icon v-if="route.icon" :icon="route.icon" size="22" />
                  <div>
                    <div class="text-subtitle-2 font-weight-semibold">
                      {{ route.label }}
                    </div>
                    <div class="text-caption text-medium-emphasis">{{ route.to }}</div>
                  </div>
                </div>
                <v-btn
                  icon
                  variant="text"
                  color="primary"
                  :to="route.to"
                >
                  <v-icon icon="mdi-open-in-new" />
                </v-btn>
              </div>
            </div>
          </AppCard>
        </v-col>
        <v-col cols="12" md="6">
          <AppCard class="pa-5 h-100" elevation="2" hover>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-h6 font-weight-bold">
                {{ t('pages.education.discovery.title') }}
              </div>
              <v-chip color="secondary" variant="flat" size="small">
                {{ t('pages.education.hero.badge') }}
              </v-chip>
            </div>
            <div class="d-flex flex-column gap-3">
              <div
                v-for="item in discoveryItems"
                :key="item.title"
                class="d-flex align-center justify-space-between route-pill"
              >
                <div class="d-flex align-center gap-3">
                  <v-icon :icon="item.icon" size="22" />
                  <div>
                    <div class="text-subtitle-2 font-weight-semibold">
                      {{ item.title }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
                <v-btn
                  icon
                  variant="text"
                  color="secondary"
                  :to="item.to"
                >
                  <v-icon icon="mdi-open-in-new" />
                </v-btn>
              </div>
            </div>
          </AppCard>
        </v-col>
      </v-row>
    </v-container>
  </EducationShell>
</template>

<style scoped>
.education-page {
  padding-inline: 18px;
}

.nav-pill {
  display: block;
  padding: 10px 14px;
  border-radius: 14px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.nav-pill:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.12);
}

.hero {
  background: linear-gradient(
    120deg,
    rgba(66, 165, 245, 0.2),
    rgba(126, 87, 194, 0.18)
  );
}

.hero-cta ul {
  margin: 0;
}

.glass-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.92),
    rgba(255, 255, 255, 0.86)
  );
}

.route-pill {
  padding: 10px 12px;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
}
</style>
