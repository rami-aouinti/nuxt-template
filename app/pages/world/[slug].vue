<script setup lang="ts">
import { computed } from 'vue'
import WorkplaceActionMenu from '~/components/workplace/WorkplaceActionMenu.vue'
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

const {
  data: workplace,
  pending,
  error,
  refresh,
} = await useAsyncData<Workplace | null>(
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

const router = useRouter()

async function handleWorkplaceRefresh() {
  await refresh()
}

async function handleWorkplaceDeleted() {
  await router.push('/')
}

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
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="12">
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
            <AppButton
              color="primary"
              variant="tonal"
              prepend-icon="mdi-refresh"
              @click="refresh"
            >
              {{ t('common.retry') }}
            </AppButton>
          </div>
        </v-alert>

        <AppCard v-else class="workplace-hero" elevation="4">
          <v-card-item>
            <div
              class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4"
            >
              <div class="d-flex align-center gap-4">
                <v-avatar size="72" color="primary" variant="tonal">
                  <span class="text-h5 font-weight-medium">
                    {{
                      getInitials(workplace?.name || workplace?.slug || slug)
                    }}
                  </span>
                </v-avatar>
                <div>
                  <h1 class="text-h4 text-sm-h5 mb-2">
                    {{ workplace?.name || slug }}
                  </h1>
                  <div class="d-flex flex-wrap align-center gap-2">
                    <v-chip color="primary" variant="tonal" size="small">
                      <v-icon size="18" class="me-1">mdi-link-variant</v-icon>
                      {{ workplace?.slug || slug }}
                    </v-chip>
                    <v-chip color="secondary" variant="tonal" size="small">
                      <v-icon size="18" class="me-1">mdi-earth</v-icon>
                      {{ translate('workplace.drawer.title', 'World') }}
                    </v-chip>
                  </div>
                </div>
              </div>
              <div v-if="workplace" class="d-flex align-center">
                <WorkplaceActionMenu
                  :workplace="workplace"
                  @refresh="handleWorkplaceRefresh"
                  @deleted="handleWorkplaceDeleted"
                />
              </div>
            </div>
          </v-card-item>
          <v-divider class="my-2" />
          <v-card-text>
            <div class="workplace-hero__body">
              <p class="text-body-1 mb-4">
                {{
                  translate(
                    'workplace.page.placeholder',
                    'This world is ready for new adventures.',
                  )
                }}
              </p>
              <v-alert
                type="info"
                variant="tonal"
                border="start"
                density="comfortable"
                class="workplace-hero__hint"
              >
                <v-icon icon="mdi-lightbulb-on" size="18" class="me-2" />
                {{
                  translate(
                    'workplace.page.tip',
                    'Use the menu to invite teammates or install new plugins.',
                  )
                }}
              </v-alert>
            </div>
          </v-card-text>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.workplace-hero {
  border-radius: 28px;
  background:
    linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.06),
      rgba(var(--v-theme-surface), 0.92)
    ),
    rgba(var(--v-theme-surface), 0.94);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.workplace-hero__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workplace-hero__hint {
  align-items: center;
}

@media (max-width: 600px) {
  .workplace-hero {
    border-radius: 22px;
  }
}
</style>
