<script setup lang="ts">
import { computed } from 'vue'

import ContentCallToActionBanner from '~/components/Content/CallToActionBanner.vue'
import ContentSectionGrid, {
  type SectionGridItem,
} from '~/components/Content/SectionGrid.vue'
import AppCard from "~/components/ui/AppCard.vue";

definePageMeta({
  title: 'navigation.about',
})

const { t } = useI18n()

const sections = computed<SectionGridItem[]>(() => [
  {
    icon: 'mdi-monitor-dashboard',
    title: t('pages.about.sections.frontend.title'),
    description: t('pages.about.sections.frontend.description'),
  },
  {
    icon: 'mdi-server',
    title: t('pages.about.sections.backend.title'),
    description: t('pages.about.sections.backend.description'),
  },
  {
    icon: 'mdi-api',
    title: t('pages.about.sections.api.title'),
    description: t('pages.about.sections.api.description'),
  },
  {
    icon: 'mdi-rocket-launch-outline',
    title: t('pages.about.sections.realtime.title'),
    description: t('pages.about.sections.realtime.description'),
  },
  {
    icon: 'mdi-cog-sync-outline',
    title: t('pages.about.sections.automation.title'),
    description: t('pages.about.sections.automation.description'),
  },
  {
    icon: 'mdi-cloud-lock-outline',
    title: t('pages.about.sections.devops.title'),
    description: t('pages.about.sections.devops.description'),
  },
])

const highlights = computed<SectionGridItem[]>(() => [
  {
    icon: 'mdi-account-group-outline',
    title: t('pages.about.highlights.collaboration.title'),
    description: t('pages.about.highlights.collaboration.description'),
  },
  {
    icon: 'mdi-chart-bell-curve-cumulative',
    title: t('pages.about.highlights.analytics.title'),
    description: t('pages.about.highlights.analytics.description'),
  },
  {
    icon: 'mdi-palette-swatch-outline',
    title: t('pages.about.highlights.customization.title'),
    description: t('pages.about.highlights.customization.description'),
  },
  {
    icon: 'mdi-puzzle-star-outline',
    title: t('pages.about.highlights.marketplace.title'),
    description: t('pages.about.highlights.marketplace.description'),
  },
])

const callToAction = computed(() => ({
  title: t('pages.about.callToAction.title'),
  description: t('pages.about.callToAction.description'),
}))
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer">
        <v-card-title class="text-h4 font-weight-bold pb-2">
          {{ t('pages.about.title') }}
        </v-card-title>
        <v-card-subtitle class="text-body-1 pb-6">
          {{ t('pages.about.subtitle') }}
        </v-card-subtitle>
      </teleport>
    </client-only>
    <client-only>
      <teleport to="#app-drawer-right">
        <ContentCallToActionBanner
          class="mt-6"
          :title="callToAction.title"
          :description="callToAction.description"
        />
      </teleport>
    </client-only>
    <v-row justify="center">
      <v-col cols="12">
        <AppCard class="pa-6 mb-6" elevation="2">
          <div class="d-flex flex-column gap-4">
            <p class="text-body-1 mb-0">
              {{ t('pages.about.intro') }}
            </p>
            <p class="text-body-1 mb-0">
              {{ t('pages.about.mission') }}
            </p>
            <p class="text-body-1 mb-0">
              {{ t('pages.about.vision') }}
            </p>
          </div>
        </AppCard>
        <AppCard class="pa-6 mb-6" elevation="2">
          <ContentSectionGrid :items="sections" :item-props="{ sm: 6 }" />
        </AppCard>
        <AppCard class="pa-6" elevation="2">
          <ContentSectionGrid
            :items="highlights"
            :item-props="{ sm: 6 }"
            :sheet-props="{ class: ['pa-4', 'flex-grow-1', 'bg-surface-variant'] }"
            icon-color="secondary"
          />
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
