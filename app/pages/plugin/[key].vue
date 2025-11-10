<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import type { ProfilePlugin } from '~/types/plugin'
import { Notify } from '~/stores/notification'
import { useProfilePluginsStore } from '~/stores/profile-plugins'

definePageMeta({
  title: 'profile.sections.plugins.title',
  middleware: 'auth',
})

const route = useRoute()
const { t } = useI18n()

const pluginsStore = useProfilePluginsStore()
const pluginsError = ref('')
const pluginToggleLoading = reactive<Record<string, boolean>>({})
const pluginsLoading = computed(() => pluginsStore.isLoading)

function extractRequestError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'message' in (error.data as Record<string, unknown>)
  ) {
    const dataMessage = (error.data as Record<string, unknown>).message
    if (typeof dataMessage === 'string' && dataMessage.trim().length > 0) {
      return dataMessage
    }
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    const message = ((error as { message?: unknown }).message as string).trim()
    if (message) {
      return message
    }
  }

  return fallback
}

function formatPluginPricing(value: unknown) {
  if (typeof value !== 'string') {
    return ''
  }

  const normalized = value.trim().toLowerCase()
  if (normalized === 'free') {
    return t('profile.sections.plugins.pricing.free')
  }

  if (normalized === 'paid') {
    return t('profile.sections.plugins.pricing.paid')
  }

  return value
}

const pluginKey = computed(() => {
  const param = route.params.key
  if (Array.isArray(param)) {
    return param[0] ?? ''
  }

  return typeof param === 'string' ? param : ''
})

await (async () => {
  try {
    await pluginsStore.load()
  } catch (error) {
    pluginsError.value = extractRequestError(
      error,
      t('profile.sections.plugins.errors.loadFailed'),
    )
  }
})()

const plugin = computed(() => {
  const key = pluginKey.value
  if (!key) {
    return null
  }

  return pluginsStore.findByKey(key)
})

const hasPlugin = computed(() => Boolean(plugin.value))

const pricingLabel = computed(() => formatPluginPricing(plugin.value?.pricing))

const statusLabel = computed(() =>
  plugin.value?.active
    ? t('profile.sections.plugins.status.active')
    : t('profile.sections.plugins.status.inactive'),
)

const statusColor = computed(() =>
  plugin.value?.active ? 'success' : 'grey-darken-1',
)

async function handlePluginToggle(current: ProfilePlugin | null) {
  if (!current) {
    return
  }

  const key = current.key
  if (!key || pluginToggleLoading[key]) {
    return
  }

  pluginToggleLoading[key] = true
  const previousActive = current.active

  try {
    const response = await $fetch<
      Partial<ProfilePlugin> & { success?: boolean; active?: boolean }
    >(`/api/profile/plugins/${encodeURIComponent(key)}/toggle`, {
      method: 'POST',
    })

    let updatedActive: boolean | null = null
    if (response && typeof response === 'object') {
      if ('active' in response && typeof response.active === 'boolean') {
        updatedActive = response.active
      }

      if ('installed' in response && typeof response.installed === 'boolean') {
        pluginsStore.updatePlugin(key, { installed: response.installed })
      }
    }

    const nextActive =
      updatedActive === null ? !previousActive : Boolean(updatedActive)

    pluginsStore.updatePlugin(key, { active: nextActive })

    pluginsError.value = ''
    Notify.success(
      t('profile.sections.plugins.notifications.toggleSuccess', {
        name: current.name,
      }),
    )
  } catch (error) {
    pluginsStore.updatePlugin(key, { active: previousActive })
    const message = extractRequestError(
      error,
      t('profile.sections.plugins.errors.toggleFailed'),
    )
    pluginsError.value = message
    Notify.error(message)
  } finally {
    pluginToggleLoading[key] = false
  }
}
</script>

<template>
  <ProfilePageShell>
    <v-row class="justify-center">
      <v-col cols="12" lg="8" xl="9">
        <v-alert
          v-if="pluginsError"
          type="error"
          variant="tonal"
          density="comfortable"
          class="mb-4"
        >
          {{ pluginsError }}
        </v-alert>

        <v-skeleton-loader
          v-else-if="pluginsLoading"
          type="image, article"
          class="rounded-xl"
        />

        <template v-else>
          <v-alert
            v-if="!hasPlugin"
            type="warning"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            {{ t('profile.sections.plugins.empty') }} ({{ pluginKey }})
          </v-alert>

          <v-card v-else class="plugin-detail-card" elevation="2" rounded="xl">
            <v-card-text>
              <div class="plugin-detail-card__header">
                <div class="d-flex align-center gap-4 flex-wrap">
                  <v-avatar
                    size="72"
                    rounded="lg"
                    class="plugin-detail-card__logo"
                  >
                    <v-img
                      v-if="plugin?.logo"
                      :src="plugin.logo"
                      :alt="plugin.name"
                      cover
                    />
                    <v-icon
                      v-else
                      :icon="plugin?.icon || 'mdi-puzzle'"
                      size="32"
                      color="primary"
                    />
                  </v-avatar>
                  <div class="d-flex flex-column gap-1">
                    <h1 class="text-h4 text-h3-md font-weight-bold mb-0">
                      {{ plugin?.name }}
                    </h1>
                    <span
                      v-if="plugin?.subTitle"
                      class="text-subtitle-2 text-medium-emphasis"
                    >
                      {{ plugin.subTitle }}
                    </span>
                    <div class="d-flex align-center gap-2 flex-wrap">
                      <v-chip
                        :color="statusColor"
                        variant="tonal"
                        class="text-uppercase font-weight-medium"
                      >
                        {{ statusLabel }}
                      </v-chip>
                      <v-chip
                        v-if="pricingLabel"
                        color="primary"
                        variant="flat"
                        size="small"
                        class="text-uppercase font-weight-medium"
                      >
                        {{ pricingLabel }}
                      </v-chip>
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <v-btn
                    variant="text"
                    prepend-icon="mdi-arrow-left"
                    :to="'/profile/plugins'"
                  >
                    {{ t('profile.sections.plugins.title') }}
                  </v-btn>
                  <v-btn
                    :color="plugin?.active ? 'secondary' : 'primary'"
                    :variant="plugin?.active ? 'tonal' : 'flat'"
                    :loading="plugin && pluginToggleLoading[plugin.key]"
                    :disabled="!plugin || pluginToggleLoading[plugin.key]"
                    prepend-icon="mdi-power"
                    @click="handlePluginToggle(plugin ?? null)"
                  >
                    {{
                      plugin?.active
                        ? t('profile.sections.plugins.actions.deactivate')
                        : t('profile.sections.plugins.actions.activate')
                    }}
                  </v-btn>
                  <v-btn
                    v-if="plugin?.link"
                    :href="plugin.link"
                    target="_blank"
                    rel="noopener"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-open-in-new"
                  >
                    {{ t('profile.sections.plugins.actions.open') }}
                  </v-btn>
                  <v-btn
                    v-if="
                      plugin &&
                      !plugin.installed &&
                      plugin.action === 'install' &&
                      plugin.link
                    "
                    :href="plugin.link"
                    target="_blank"
                    rel="noopener"
                    variant="outlined"
                    color="primary"
                    prepend-icon="mdi-download"
                  >
                    {{ t('profile.sections.plugins.actions.install') }}
                  </v-btn>
                </div>
              </div>

              <v-divider class="my-6" />

              <div class="d-flex flex-column gap-4">
                <section>
                  <h2 class="text-subtitle-1 font-weight-semibold mb-2">
                    {{ t('profile.sections.plugins.title') }}
                  </h2>
                  <p class="text-body-1 text-medium-emphasis mb-0">
                    {{
                      plugin?.description ||
                      t('profile.sections.plugins.description')
                    }}
                  </p>
                </section>

                <section v-if="plugin?.subTitle">
                  <h3 class="text-subtitle-2 text-medium-emphasis mb-1">
                    {{ t('profile.sections.plugins.title') }} —
                    {{ plugin.subTitle }}
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ plugin.subTitle }}
                  </p>
                </section>

                <section class="d-flex flex-wrap gap-4">
                  <div class="plugin-detail-card__meta">
                    <span class="text-caption text-medium-emphasis d-block">
                      {{ t('profile.sections.plugins.status.active') }}
                    </span>
                    <span class="text-subtitle-2 font-weight-medium">
                      {{ statusLabel }}
                    </span>
                  </div>
                  <div class="plugin-detail-card__meta">
                    <span class="text-caption text-medium-emphasis d-block">
                      {{ t('profile.sections.plugins.pricing.paid') }}
                    </span>
                    <span class="text-subtitle-2 font-weight-medium">
                      {{ pricingLabel || '—' }}
                    </span>
                  </div>
                  <div class="plugin-detail-card__meta">
                    <span class="text-caption text-medium-emphasis d-block">
                      {{ t('profile.sections.plugins.actions.install') }}
                    </span>
                    <span class="text-subtitle-2 font-weight-medium">
                      {{
                        plugin?.installed
                          ? t('profile.sections.plugins.status.active')
                          : t('profile.sections.plugins.status.inactive')
                      }}
                    </span>
                  </div>
                </section>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </ProfilePageShell>
</template>

<style scoped>
.plugin-detail-card {
  overflow: hidden;
}

.plugin-detail-card__header {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.plugin-detail-card__logo {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
}

.plugin-detail-card__meta {
  min-width: 160px;
}

@media (min-width: 960px) {
  .plugin-detail-card__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
