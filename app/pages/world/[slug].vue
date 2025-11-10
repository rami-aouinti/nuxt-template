<script setup lang="ts">
import { computed } from 'vue'
import type { Workplace } from '~/types/workplace'

const { t } = useI18n()
const translate = (key: string, fallback: string) => {
  const value = t(key)
  return value && value !== key ? value : fallback
}

function getInitials(value: string | null | undefined): string {
  if (!value) {
    return '??'
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return '??'
  }

  const alphanumeric = Array.from(trimmed).filter((char) =>
    /\p{Letter}|\p{Number}/u.test(char),
  )

  const source = alphanumeric.length
    ? alphanumeric
    : Array.from(trimmed).filter((char) => char.trim().length > 0)

  if (!source.length) {
    return '??'
  }

  const initials = source.slice(0, 2)
  if (initials.length === 1) {
    initials.push(initials[0])
  }

  return initials.join('').toUpperCase()
}

const route = useRoute()
const slug = computed(() => {
  const value = route.params.slug
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0]
  }
  return ''
})

const pageTitle = computed(() => {
  const label = workplace.value?.name?.trim().length
    ? workplace.value?.name
    : slug.value
  if (label) {
    return `${label} • ${t('workplace.drawer.title')}`
  }
  return t('workplace.drawer.title')
})

const { data: workplace, pending, error, refresh } = await useAsyncData<
  Workplace | null
>(
  () => `world-${slug.value}`,
  async () => {
    const currentSlug = slug.value.trim()
    if (!currentSlug) {
      return null
    }
    return await $fetch<Workplace>(
      `/api/frontend/workplaces/${encodeURIComponent(currentSlug)}`,
    )
  },
  {
    watch: [slug],
  },
)

useHead(() => ({
  title: pageTitle.value,
}))

const errorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  const data = (error.value as { data?: { message?: string } | null }).data
  if (data && typeof data === 'object' && typeof data.message === 'string') {
    return data.message
  }

  if (error.value instanceof Error && error.value.message) {
    return error.value.message
  }

  return t('common.unexpectedError')
})
</script>

<template>
  <v-container class="py-10 py-md-14">
    <v-row class="justify-center">
      <v-col cols="12" md="8" lg="6">
        <v-breadcrumbs
          :items="[
            { title: t('navigation.home'), href: '/' },
            { title: translate('workplace.drawer.title', 'World'), disabled: true },
          ]"
          class="px-0 mb-4"
        />

        <v-skeleton-loader
          v-if="pending"
          type="heading, paragraph"
          class="rounded-xl"
        />

        <v-alert
          v-else-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-6"
          border="start"
        >
          <div class="d-flex align-center justify-space-between gap-4">
            <span>{{ errorMessage }}</span>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-refresh"
              @click="refresh"
            >
              {{ t('common.retry') }}
            </v-btn>
          </div>
        </v-alert>

        <v-card v-else class="rounded-xl" elevation="2">
          <v-card-text>
            <div class="d-flex align-center gap-3 mb-4">
              <v-avatar size="48" color="primary" variant="tonal">
                <span class="text-h6 font-weight-medium">
                  {{ getInitials(workplace?.name || workplace?.slug || slug) }}
                </span>
              </v-avatar>
              <div>
                <h1 class="text-h5 mb-1">
                  {{ workplace?.name || slug }}
                </h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ workplace?.slug || slug }}
                </p>
              </div>
            </div>

            <p class="text-body-1 mb-0">
              {{
                translate(
                  'workplace.page.placeholder',
                  'This world is ready for new adventures.',
                )
              }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
