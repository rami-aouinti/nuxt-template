<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '~/components/ui/AppCard.vue'
import type { EducationEndpoint } from '/useEducationMyCoursesEndpoints'
import { useEducationMyCoursesEndpoints } from '/useEducationMyCoursesEndpoints'

const props = defineProps<{ slug: string }>()

const { t } = useI18n()
const localePath = useLocalePath()
const { findEndpointBySlug, findGroupBySlug } = useEducationMyCoursesEndpoints()

const endpoint = computed<EducationEndpoint | undefined>(() =>
  findEndpointBySlug(props.slug),
)
const group = computed(() => findGroupBySlug(props.slug))
</script>

<template>
  <v-row class="gy-6" justify="center">
    <v-col cols="12" md="8">
      <AppCard class="pa-6" elevation="2">
        <div
          class="d-flex align-center justify-space-between gap-4 flex-wrap mb-4"
        >
          <div class="d-flex align-center gap-3">
            <v-avatar color="surface-variant" size="48">
              <v-icon
                :icon="endpoint?.icon || 'mdi-book-outline'"
                color="primary"
              />
            </v-avatar>
            <div>
              <h1 class="text-h5 font-weight-bold mb-1">
                {{ endpoint?.title || t('common.notFound') }}
              </h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{
                  endpoint?.description ||
                  t('pages.education.myCourses.endpoints.empty')
                }}
              </p>
            </div>
          </div>
          <v-btn
            variant="tonal"
            color="primary"
            prepend-icon="mdi-arrow-left"
            :to="localePath('education-my-courses')"
          >
            {{ t('pages.education.actions.back') }}
          </v-btn>
        </div>

        <v-alert v-if="group" type="info" variant="tonal" class="mb-4">
          <div
            class="d-flex align-center justify-space-between flex-wrap gap-3"
          >
            <div>
              <div class="text-subtitle-2 font-weight-semibold">
                {{ group.title }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{ group.description }}
              </div>
            </div>
            <v-chip color="primary" variant="tonal" label
              >{{ group.items.length }}
              {{ t('pages.education.administration.table.links') }}</v-chip
            >
          </div>
        </v-alert>

        <v-table density="comfortable" class="rounded-lg">
          <thead>
            <tr>
              <th class="text-left">
                {{ t('pages.education.administration.table.endpoint') }}
              </th>
              <th class="text-left">
                {{ t('pages.education.administration.table.type') }}
              </th>
              <th class="text-left">
                {{ t('pages.education.administration.table.description') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="endpoint">
              <td>
                <div class="d-flex align-center gap-3">
                  <v-avatar color="surface" size="36">
                    <v-icon :icon="endpoint.icon" color="primary" />
                  </v-avatar>
                  <div class="d-flex flex-column">
                    <span class="font-weight-medium">{{ endpoint.title }}</span>
                    <a
                      :href="endpoint.href"
                      target="_blank"
                      rel="noreferrer"
                      class="text-caption text-primary"
                    >
                      {{ t('pages.education.actions.visit') }}
                      <v-icon icon="mdi-open-in-new" size="14" class="ms-1" />
                    </a>
                  </div>
                </div>
              </td>
              <td>
                <v-chip color="primary" variant="tonal" size="small" label>
                  {{
                    endpoint.type === 'api'
                      ? 'API'
                      : endpoint.type === 'form'
                        ? 'Form'
                        : 'Page'
                  }}
                </v-chip>
              </td>
              <td>{{ endpoint.description }}</td>
            </tr>
            <tr v-else>
              <td colspan="3" class="text-center text-medium-emphasis">
                {{ t('pages.education.myCourses.endpoints.empty') }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </AppCard>
    </v-col>
  </v-row>
</template>
