<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  title: 'navigation.contact',
})

const { t } = useI18n()

const sections = computed(() => [
  {
    icon: 'mdi-headset',
    title: t('pages.contact.sections.support.title'),
    description: t('pages.contact.sections.support.description'),
  },
  {
    icon: 'mdi-handshake-outline',
    title: t('pages.contact.sections.partnerships.title'),
    description: t('pages.contact.sections.partnerships.description'),
  },
  {
    icon: 'mdi-newspaper-variant-outline',
    title: t('pages.contact.sections.press.title'),
    description: t('pages.contact.sections.press.description'),
  },
])

const details = computed(() => ({
  title: t('pages.contact.details.title'),
  description: t('pages.contact.details.description'),
}))
</script>

<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h4 font-weight-bold pb-2">
            {{ t('pages.contact.title') }}
          </v-card-title>
          <v-card-subtitle class="text-body-1 pb-6">
            {{ t('pages.contact.subtitle') }}
          </v-card-subtitle>
          <v-divider class="mb-6" />
          <v-row dense>
            <v-col
              v-for="section in sections"
              :key="section.title"
              cols="12"
              sm="6"
              class="d-flex"
            >
              <v-sheet elevation="1" rounded="lg" class="pa-4 flex-grow-1">
                <div class="d-flex align-center mb-3">
                  <v-icon :icon="section.icon" size="32" class="mr-3 text-primary" />
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
          <v-alert
            class="mt-6"
            type="info"
            variant="tonal"
            rounded="lg"
          >
            <strong class="d-block mb-1">{{ details.title }}</strong>
            <span>{{ details.description }}</span>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
