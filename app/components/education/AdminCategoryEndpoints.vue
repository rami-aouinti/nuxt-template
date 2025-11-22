<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '~/components/ui/AppCard.vue'
import type { AdminCategory } from '~/composables/useEducationAdministrationData'
import { useEducationAdministrationData } from '~/composables/useEducationAdministrationData'

const props = defineProps<{ categoryKey: string }>()

const { t } = useI18n()
const { findCategory } = useEducationAdministrationData()

const category = computed<AdminCategory | undefined>(() => findCategory(props.categoryKey))

const headers = [
  { title: t('pages.education.administration.table.endpoint'), key: 'label' },
  { title: t('pages.education.administration.table.type'), key: 'type' },
  { title: t('pages.education.administration.table.description'), key: 'description' },
]

const rows = computed(() =>
  category.value?.items.map((item) => ({
    ...item,
    typeLabel:
      item.type === 'api'
        ? 'API'
        : item.type === 'form'
          ? t('pages.education.administration.table.form')
          : t('pages.education.administration.table.page'),
  })) || [],
)
</script>

<template>
  <v-row class="gy-6" justify="center">
    <v-col cols="12" md="10">
      <AppCard class="pa-6" elevation="2">
        <div class="d-flex align-center justify-space-between gap-4 flex-wrap mb-4">
          <div class="d-flex align-center gap-3">
            <v-avatar color="surface-variant" size="48">
              <v-icon :icon="category?.icon || 'mdi-alert-circle-outline'" :color="category?.color || 'primary'" />
            </v-avatar>
            <div>
              <h1 class="text-h5 font-weight-bold mb-1">
                {{ category?.title || t('common.notFound') }}
              </h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ category?.description || t('pages.education.administration.table.empty') }}
              </p>
            </div>
          </div>
          <v-chip v-if="category" :color="category.color || 'primary'" variant="tonal" label>
            {{ category.items.length }} {{ t('pages.education.administration.table.links') }}
          </v-chip>
        </div>

        <v-data-table
          :items="rows"
          :headers="headers"
          :items-per-page="10"
          class="elevation-0"
          density="comfortable"
        >
          <template #item.label="{ item }">
            <div class="d-flex align-center gap-3">
              <v-avatar color="surface" size="36">
                <v-icon :icon="item.raw.icon || category?.icon" :color="category?.color || 'primary'" />
              </v-avatar>
              <div class="d-flex flex-column">
                <span class="font-weight-medium">{{ item.raw.label }}</span>
                <a
                  class="text-caption text-primary"
                  :href="item.raw.href"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ t('pages.education.actions.visit') }}
                  <v-icon icon="mdi-open-in-new" size="14" class="ms-1" />
                </a>
              </div>
            </div>
          </template>

          <template #item.type="{ item }">
            <v-chip color="primary" variant="tonal" size="small" label>
              {{ item.raw.typeLabel }}
            </v-chip>
          </template>

          <template #no-data>
            <div class="text-center py-8">
              <v-icon icon="mdi-alert-circle-outline" size="36" color="warning" class="mb-2" />
              <div class="text-body-2 text-medium-emphasis">
                {{ t('pages.education.administration.table.empty') }}
              </div>
            </div>
          </template>
        </v-data-table>
      </AppCard>
    </v-col>
  </v-row>
</template>
