<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import type { ProfilePlugin } from '~/types/plugin'
import { Notify } from '~/stores/notification'
import { useProfilePluginsStore } from '~/stores/profile-plugins'

definePageMeta({
  title: 'profile.sections.plugins.title',
  middleware: 'auth',
})

const { t } = useI18n()

const pluginsError = ref('')
const pluginToggleLoading = reactive<Record<string, boolean>>({})

const pluginsStore = useProfilePluginsStore()
const { plugins, isLoading: pluginsLoading } = storeToRefs(pluginsStore)
const hasPlugins = computed(() => plugins.value.length > 0)

function resolvePluginRoute(key: string) {
  if (!key) {
    return '/profile/plugins'
  }

  return `/plugin/${encodeURIComponent(key)}`
}

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

async function loadPlugins(force = false) {
  if (pluginsLoading.value && !force) {
    return
  }

  pluginsError.value = ''

  try {
    await pluginsStore.load(force)
  } catch (error) {
    pluginsError.value = extractRequestError(
      error,
      t('profile.sections.plugins.errors.loadFailed'),
    )
  }
}

async function handlePluginToggle(plugin: ProfilePlugin) {
  const key = plugin.key
  if (!key || pluginToggleLoading[key]) {
    return
  }

  pluginToggleLoading[key] = true
  const previousActive = plugin.active

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
        name: plugin.name,
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

await loadPlugins()
</script>

<template>
  <ProfilePageShell>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-sheet class="rounded-xl mb-6" elevation="2">
          <div
            class="pa-6 px-4 py-2 d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4"
          >
            <div class="d-flex flex-column gap-2">
              <h1 class="text-h4 text-h3-md font-weight-bold mb-0">
                {{ t('profile.sections.plugins.title') }}
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-0">
                {{ t('profile.sections.plugins.description') }}
              </p>
            </div>
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  density="comfortable"
                  icon="mdi-refresh"
                  :disabled="pluginsLoading"
                  :loading="pluginsLoading"
                  @click="loadPlugins(true)"
                />
              </template>
              <span>{{ t('profile.sections.plugins.actions.refresh') }}</span>
            </v-tooltip>
          </div>
        </v-sheet>

        <v-alert
          v-if="pluginsError"
          type="error"
          variant="tonal"
          density="comfortable"
          class="mb-4"
        >
          {{ pluginsError }}
        </v-alert>

        <div v-if="pluginsLoading">
          <v-row>
            <v-col v-for="index in 3" :key="index" cols="12" sm="6" lg="4">
              <v-skeleton-loader
                class="profile-plugin-card"
                type="image, article"
              />
            </v-col>
          </v-row>
        </div>

        <template v-else>
          <div v-if="!hasPlugins" class="text-body-2 text-medium-emphasis">
            {{ t('profile.sections.plugins.empty') }}
          </div>

          <v-row v-else class="g-4" style="row-gap: 24px; column-gap: 0">
            <v-col
              v-for="plugin in plugins"
              :key="plugin.id || plugin.key"
              cols="12"
              class="d-flex"
            >
              <v-card
                :elevation="plugin.active ? 8 : 2"
                rounded="xl"
                border
                class="profile-plugin-card"
                :class="{
                  'profile-plugin-card--active': plugin.active,
                }"
              >
                <div class="profile-plugin-card__body">
                  <div class="profile-plugin-card__header">
                    <div class="profile-plugin-card__meta">
                      <v-avatar
                        size="56"
                        rounded="lg"
                        class="profile-plugin-card__logo"
                      >
                        <v-img
                          v-if="plugin.logo"
                          :src="plugin.logo"
                          :alt="plugin.name"
                          cover
                        />
                        <v-icon
                          v-else
                          :icon="plugin.icon || 'mdi-puzzle'"
                          size="28"
                          color="primary"
                        />
                      </v-avatar>

                      <div class="profile-plugin-card__title">
                        <div class="profile-plugin-card__heading">
                          <span class="profile-plugin-card__name">
                            {{ plugin.name }}
                          </span>
                          <v-chip
                            v-if="plugin.pricing"
                            size="x-small"
                            variant="flat"
                            color="primary"
                            class="text-uppercase profile-plugin-card__pricing"
                          >
                            {{ formatPluginPricing(plugin.pricing) }}
                          </v-chip>
                        </div>
                        <span
                          v-if="plugin.subTitle"
                          class="text-caption text-medium-emphasis"
                        >
                          {{ plugin.subTitle }}
                        </span>
                      </div>
                    </div>

                    <v-chip
                      size="small"
                      :color="plugin.active ? 'success' : 'grey-darken-1'"
                      variant="tonal"
                      class="text-uppercase font-weight-medium profile-plugin-card__status"
                    >
                      {{
                        plugin.active
                          ? t('profile.sections.plugins.status.active')
                          : t('profile.sections.plugins.status.inactive')
                      }}
                    </v-chip>
                  </div>

                  <p
                    v-if="plugin.description"
                    class="profile-plugin-card__description"
                  >
                    {{ plugin.description }}
                  </p>
                </div>

                <div class="profile-plugin-card__footer">
                  <v-btn
                    :color="plugin.active ? 'secondary' : 'primary'"
                    :variant="plugin.active ? 'tonal' : 'flat'"
                    :loading="pluginToggleLoading[plugin.key]"
                    :disabled="pluginToggleLoading[plugin.key]"
                    prepend-icon="mdi-power"
                    class="profile-plugin-card__action"
                    @click="handlePluginToggle(plugin)"
                  >
                    {{
                      plugin.active
                        ? t('profile.sections.plugins.actions.deactivate')
                        : t('profile.sections.plugins.actions.activate')
                    }}
                  </v-btn>
                  <v-btn
                    :to="resolvePluginRoute(plugin.key)"
                    variant="text"
                    prepend-icon="mdi-open-in-new"
                    class="profile-plugin-card__action"
                  >
                    {{ t('profile.sections.plugins.actions.open') }}
                  </v-btn>
                  <v-btn
                    v-if="!plugin.installed && plugin.action === 'install' && plugin.link"
                    :href="plugin.link"
                    target="_blank"
                    rel="noopener"
                    variant="outlined"
                    color="primary"
                    prepend-icon="mdi-download"
                    class="profile-plugin-card__action"
                  >
                    {{ t('profile.sections.plugins.actions.install') }}
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </ProfilePageShell>
</template>

<style scoped>
.profile-plugin-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 24px;
  gap: 20px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.profile-plugin-card:hover {
  transform: translateY(-4px);
}

.profile-plugin-card--active {
  border-color: rgba(var(--v-theme-primary), 0.45);
  box-shadow: 0 18px 32px rgba(var(--v-theme-primary), 0.18);
  background: linear-gradient(
    150deg,
    rgba(var(--v-theme-primary), 0.08) 0%,
    rgba(var(--v-theme-surface), 1) 65%
  );
}

.profile-plugin-card__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-plugin-card__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.profile-plugin-card__logo {
  flex-shrink: 0;
  background-color: rgba(var(--v-theme-surface-variant), 0.65);
  box-shadow: inset 0 0 0 1px rgba(var(--v-theme-outline-variant), 0.25);
}

.profile-plugin-card__title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.profile-plugin-card__heading {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.profile-plugin-card__name {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.94);
}

.profile-plugin-card__pricing {
  letter-spacing: 0.08em;
}

.profile-plugin-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.profile-plugin-card__status {
  align-self: flex-start;
}

.profile-plugin-card__description {
  color: rgba(var(--v-theme-on-surface), 0.72);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 72px;
}

.profile-plugin-card__footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(var(--v-theme-outline-variant), 0.4);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.profile-plugin-card__action {
  flex: 1 1 auto;
}

@media (max-width: 960px) {
  .profile-plugin-card__action {
    flex: 1 1 100%;
  }
}

@media (max-width: 600px) {
  .profile-plugin-card {
    padding: 20px;
  }

  .profile-plugin-card__status {
    width: 100%;
  }

  .profile-plugin-card__footer {
    flex-direction: column;
  }
}
</style>
