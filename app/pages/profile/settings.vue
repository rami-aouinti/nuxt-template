<script setup lang="ts">
import { computed } from 'vue'
import type { AuthProfile } from '~/types/auth'
import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'

definePageMeta({
  title: 'navigation.settings',
})

const { t } = useI18n()
const { loggedIn, session } = useUserSession()
const profileCache = useAuthProfileCache()

type SettingsSectionKey = 'profile' | 'security' | 'notifications'

type SettingsSection = {
  key: SettingsSectionKey
  icon: string
  title: string
  description: string
  fields?: { label: string; value: string }[]
}

const profile = computed<AuthProfile | null>(() => {
  const sessionProfile = session.value?.profile
  if (sessionProfile && typeof sessionProfile === 'object') {
    return sessionProfile as AuthProfile
  }

  return profileCache.value
})

const currentUser = computed<Record<string, unknown> | null>(() => {
  const sessionValue = session.value
  if (!sessionValue || typeof sessionValue !== 'object') {
    return null
  }

  const user = (sessionValue as { user?: Record<string, unknown> | null }).user
  if (user && typeof user === 'object') {
    return user
  }

  return null
})

const profileFields = computed(() => {
  if (!profile.value && !currentUser.value) {
    return [] as { label: string; value: string }[]
  }

  const emptyLabel = t('profile.public.labels.empty')

  const ensureString = (value: unknown) => {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : null
    }
    return null
  }

  const getProfileValue = (key: keyof AuthProfile) =>
    profile.value ? ensureString(profile.value[key]) : null

  const displayName = (() => {
    const firstName = getProfileValue('firstName')
    const lastName = getProfileValue('lastName')
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()
    if (fullName.length) {
      return fullName
    }

    const username = getProfileValue('username')
    if (username) {
      return username
    }

    const login = ensureString(currentUser.value?.login)
    return login ?? null
  })()

  const username =
    getProfileValue('username') ?? ensureString(currentUser.value?.login)
  const email =
    getProfileValue('email') ?? ensureString(currentUser.value?.email)
  const title = getProfileValue('title')
  const phone = getProfileValue('phone')
  const address = getProfileValue('address')

  const items: { label: string; value: string }[] = [
    {
      label: t('pages.settings.sections.profile.fields.displayName'),
      value: displayName ?? emptyLabel,
    },
    {
      label: t('pages.settings.sections.profile.fields.username'),
      value: username ?? emptyLabel,
    },
    {
      label: t('profile.public.labels.email'),
      value: email ?? emptyLabel,
    },
    {
      label: t('profile.fields.title'),
      value: title ?? emptyLabel,
    },
    {
      label: t('profile.fields.phone'),
      value: phone ?? emptyLabel,
    },
    {
      label: t('profile.fields.address'),
      value: address ?? emptyLabel,
    },
  ]

  return items
})

const sections = computed<SettingsSection[]>(() => {
  const items: SettingsSection[] = [
    {
      key: 'security',
      icon: 'mdi-shield-lock-outline',
      title: t('pages.settings.sections.security.title'),
      description: t('pages.settings.sections.security.description'),
    },
    {
      key: 'notifications',
      icon: 'mdi-bell-ring-outline',
      title: t('pages.settings.sections.notifications.title'),
      description: t('pages.settings.sections.notifications.description'),
    },
  ]

  if (loggedIn.value) {
    items.unshift({
      key: 'profile',
      icon: 'mdi-account-cog-outline',
      title: t('pages.settings.sections.profile.title'),
      description: t('pages.settings.sections.profile.description'),
      fields: profileFields.value,
    })
  }

  return items
})
</script>

<template>
  <client-only>
    <teleport to="#app-drawer-right" />
  </client-only>
  <ProfilePageShell>
    <v-row class="d-flex">
      <v-col cols="12">
        <v-card class="pa-6" elevation="2" rounded="xl">
          <v-card-title class="text-h4 font-weight-bold pb-2">
            {{ t('pages.settings.title') }}
          </v-card-title>
          <v-card-subtitle class="text-body-1 pb-6">
            {{ t('pages.settings.subtitle') }}
          </v-card-subtitle>
          <v-divider class="mb-6" />
          <v-row dense>
            <v-col
              v-for="section in sections"
              :key="section.key"
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
                <template
                  v-if="section.key === 'profile' && section.fields?.length"
                >
                  <v-divider class="my-4" />
                  <div class="d-flex flex-column gap-3">
                    <div
                      v-for="field in section.fields"
                      :key="`${section.key}-${field.label}`"
                      class="d-flex flex-column"
                    >
                      <span class="text-caption text-medium-emphasis">
                        {{ field.label }}
                      </span>
                      <span class="text-subtitle-2 font-weight-medium">
                        {{ field.value }}
                      </span>
                    </div>
                  </div>
                </template>
              </v-sheet>
            </v-col>
          </v-row>
          <v-alert class="mt-6" type="info" variant="tonal" rounded="lg">
            <strong class="d-block mb-1">{{
              t('pages.settings.tips.title')
            }}</strong>
            <span>{{ t('pages.settings.tips.description') }}</span>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </ProfilePageShell>
</template>
