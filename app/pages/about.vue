<script setup lang="ts">
import { computed } from 'vue'

import ContentCallToActionBanner from '~/components/Content/CallToActionBanner.vue'
import ContentSectionGrid, {
  type SectionGridItem,
} from '~/components/Content/SectionGrid.vue'

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
])

const callToAction = computed(() => ({
  title: t('pages.about.callToAction.title'),
  description: t('pages.about.callToAction.description'),
}))
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12">
        <AppCard class="pa-6" elevation="2">
          <v-card-title class="text-h4 font-weight-bold pb-2">
            {{ t('pages.about.title') }}
          </v-card-title>
          <v-card-subtitle class="text-body-1 pb-6">
            {{ t('pages.about.subtitle') }}
          </v-card-subtitle>
          <v-divider class="mb-6" />
          <ContentSectionGrid :items="sections" />
          <ContentCallToActionBanner
            class="mt-6"
            :title="callToAction.title"
            :description="callToAction.description"
          />
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
