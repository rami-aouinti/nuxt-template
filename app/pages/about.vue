<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  title: 'navigation.about',
})

const { t } = useI18n()

const sections = computed(() => [
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
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h4 font-weight-bold pb-2">
            {{ t('pages.about.title') }}
          </v-card-title>
          <v-card-subtitle class="text-body-1 pb-6">
            {{ t('pages.about.subtitle') }}
          </v-card-subtitle>
          <v-divider class="mb-6" />
          <v-row dense>
            <v-col
              v-for="section in sections"
              :key="section.title"
              cols="12"
              sm="4"
              class="d-flex"
            >
              <v-sheet elevation="1" rounded="lg" class="pa-4 flex-grow-1">
                <div class="d-flex align-center mb-3">
                  <v-icon
                    :icon="section.icon"
                    size="32"
                    class="mr-3 text-primary"
                  />
                  <h2 class="text-h6 font-weight-medium mb-0">
                    {{ section.title }}
                  </h2>
                </div>
                <p class="text-body-1 mb-0">
                  {{ section.description }}
                </p>
              </v-sheet>
            </v-col>
          </v-row>
          <v-alert class="mt-6" type="primary" variant="tonal" rounded="lg">
            <strong class="d-block mb-1">{{ callToAction.title }}</strong>
            <span>{{ callToAction.description }}</span>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
