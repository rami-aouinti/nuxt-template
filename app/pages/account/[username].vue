<script setup lang="ts">
import { computed, ref } from 'vue'
import { createError } from 'nuxt/app'

import type { PublicProfileData } from '~/types/profile'
import type { ConversationSummary } from '~/types/messenger'
import { useMessengerApi } from '~/composables/useMessengerApi'
import { Notify } from '~/stores/notification'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'

definePageMeta({
  title: 'navigation.profile',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()
const { session } = useAppUserSession()
const messengerApi = useMessengerApi()

const isOpeningConversation = ref(false)

const usernameParam = computed(() => {
  const value = route.params.username
  if (Array.isArray(value)) {
    return value.join('/')
  }

  return typeof value === 'string' ? value : ''
})

const normalizedUsername = computed(() => usernameParam.value.trim())

const { data, pending, error, refresh } = await useAsyncData(
  () => `public-profile-${normalizedUsername.value}`,
  async () => {
    const username = normalizedUsername.value

    if (!username) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Profile not found',
        data: { message: t('profile.public.errors.notFound') },
      })
    }

    return await $fetch<PublicProfileData>(
      `/api/profile/${encodeURIComponent(username)}`,
    )
  },
  {
    watch: [normalizedUsername],
  },
)

const profile = computed(() => data.value ?? null)

const currentUserId = computed(() => session.value?.profile?.id ?? '')

const isOwnProfile = computed(
  () => profile.value?.id && profile.value.id === currentUserId.value,
)

const messengerButtonVisible = computed(
  () => Boolean(profile.value) && !isOwnProfile.value,
)

const messengerButtonDisabled = computed(
  () => isOpeningConversation.value || !profile.value,
)

const contactItems = computed(() => {
  if (!profile.value) {
    return []
  }

  return [
    {
      label: t('profile.public.labels.email'),
      value: profile.value.email,
      icon: 'mdi-email-outline',
    },
    {
      label: t('profile.public.labels.language'),
      value: profile.value.language,
      icon: 'mdi-translate',
    },
    {
      label: t('profile.public.labels.locale'),
      value: profile.value.locale,
      icon: 'mdi-earth',
    },
    {
      label: t('profile.public.labels.timezone'),
      value: profile.value.timezone,
      icon: 'mdi-clock-outline',
    },
  ].map((item) => ({
    ...item,
    value: item.value || t('profile.public.labels.empty'),
  }))
})

const displayName = computed(() => {
  if (!profile.value) {
    return normalizedUsername.value
  }

  const { firstName, lastName, username } = profile.value
  const nameParts = [firstName, lastName]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value) => value.length > 0)

  if (nameParts.length) {
    return nameParts.join(' ')
  }

  return username
})

const profileTitle = computed(
  () => `${displayName.value} • ${t('profile.public.page.title')}`,
)

useHead(() => ({
  title: profileTitle.value,
}))

const errorMessage = computed(() => {
  if (!error.value) {
    return ''
  }

  const dataMessage =
    typeof error.value.data === 'object' && error.value.data
      ? (error.value.data as { message?: unknown }).message
      : undefined

  if (typeof dataMessage === 'string' && dataMessage.trim().length) {
    return dataMessage
  }

  if (error.value.statusCode === 404) {
    return t('profile.public.errors.notFound')
  }

  return t('profile.public.errors.load')
})

const accountStatusLabel = computed(() =>
  profile.value?.enabled
    ? t('profile.public.labels.enabled')
    : t('profile.public.labels.disabled'),
)

const accountStatusColor = computed(() =>
  profile.value?.enabled ? 'success' : 'warning',
)

const roles = computed(() =>
  Array.isArray(profile.value?.roles)
    ? (profile.value?.roles ?? []).filter(
        (role): role is string =>
          typeof role === 'string' && role.trim().length > 0,
      )
    : [],
)

const friendsCount = computed(() =>
  Array.isArray(profile.value?.friends) ? profile.value!.friends.length : 0,
)

const storiesCount = computed(() =>
  Array.isArray(profile.value?.stories) ? profile.value!.stories.length : 0,
)

const hasRoles = computed(() => roles.value.length > 0)

const hasContactInfo = computed(() => {
  if (!profile.value) {
    return false
  }

  return [
    profile.value.email,
    profile.value.language,
    profile.value.locale,
    profile.value.timezone,
  ].some((value) => typeof value === 'string' && value.trim().length > 0)
})

const showMetadata = computed(
  () => friendsCount.value > 0 || storiesCount.value > 0,
)

const quickStats = computed(() => [
  {
    label: t('profile.public.labels.friends'),
    value: friendsCount.value,
    icon: 'mdi-account-multiple-outline',
  },
  {
    label: t('profile.public.labels.stories'),
    value: storiesCount.value,
    icon: 'mdi-book-open-page-variant',
  },
])

const profilePhoto = computed(() => {
  const value = profile.value?.photo
  return typeof value === 'string' && value.trim().length > 0 ? value : null
})

const usernameLabel = computed(
  () => `@${profile.value?.username ?? normalizedUsername.value}`,
)

const findConversationByParticipant = (
  conversations: ConversationSummary[],
  participantId: string,
) =>
  conversations.find((conversation) =>
    conversation.participants.some(
      (participant) => participant.id === participantId,
    ),
  )

const openMessengerConversation = async () => {
  if (!profile.value) {
    return
  }

  if (isOwnProfile.value) {
    return
  }

  if (!messengerApi.isAuthenticated.value) {
    Notify.warning(t('profile.public.errors.authenticationRequired'))
    return
  }

  const receiverId = profile.value.id
  if (!receiverId) {
    Notify.error(t('profile.public.errors.messengerUnavailable'))
    return
  }

  isOpeningConversation.value = true

  try {
    const response = await messengerApi.fetchConversations({
      limit: 50,
    })

    let conversation = findConversationByParticipant(response.items, receiverId)

    if (!conversation) {
      conversation = await messengerApi.createDirectConversation(receiverId)
    }

    if (!conversation?.id) {
      throw new Error('CONVERSATION_NOT_AVAILABLE')
    }

    const messengerRoute =
      localePath({
        name: 'messenger',
        query: { conversationId: conversation.id },
      }) || '/messenger'

    await router.push(messengerRoute)
  } catch (error) {
    console.error('Unable to open messenger conversation', error)
    Notify.error(t('profile.public.errors.messengerUnavailable'))
  } finally {
    isOpeningConversation.value = false
  }
}
</script>

<template>
  <v-container class="py-8" fluid>
    <v-row class="justify-center">
      <v-col cols="12" lg="8" xl="7">
        <div
          class="d-flex align-center justify-space-between flex-wrap gap-2 mb-6"
        >
          <div>
            <h1 class="text-h4 text-h3-md font-weight-bold mb-1">
              {{ t('profile.public.page.title') }}
            </h1>
            <p class="text-medium-emphasis mb-0">
              {{ t('profile.public.page.description') }}
            </p>
          </div>
          <AppButton
            v-if="error"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-refresh"
            @click="refresh"
          >
            {{ t('profile.public.actions.retry') }}
          </AppButton>
        </div>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          border="start"
          prominent
          class="mb-4"
        >
          {{ errorMessage }}
        </v-alert>

        <v-skeleton-loader
          v-if="pending && !profile"
          type="heading, paragraph, list-item-two-line"
          class="rounded-xl"
        />

        <AppCard v-else-if="profile" class="rounded-xl" elevation="2">
          <div class="profile-public__hero">
            <div class="profile-public__hero-overlay" />
            <div class="profile-public__hero-content">
              <AppAvatar :src="profilePhoto" :alt="displayName" size="104">
                <template #fallback>
                  <v-icon icon="mdi-account-circle" size="104" />
                </template>
              </AppAvatar>
              <div class="profile-public__hero-text">
                <h2 class="text-h4 text-h5-sm mb-1">{{ displayName }}</h2>
                <p class="text-medium-emphasis mb-3">{{ usernameLabel }}</p>
                <div class="d-flex flex-wrap align-center gap-2">
                  <v-chip
                    :color="accountStatusColor"
                    size="small"
                    variant="elevated"
                    class="text-body-2"
                  >
                    {{ accountStatusLabel }}
                  </v-chip>
                  <AppButton
                    v-if="messengerButtonVisible"
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-message-text-outline"
                    :loading="isOpeningConversation"
                    :disabled="messengerButtonDisabled"
                    size="small"
                    @click="openMessengerConversation"
                  >
                    {{ t('profile.public.actions.message') }}
                  </AppButton>
                </div>
              </div>
              <div v-if="showMetadata" class="profile-public__stats">
                <div
                  v-for="stat in quickStats"
                  :key="stat.label"
                  class="profile-public__stat-card"
                >
                  <v-icon :icon="stat.icon" size="18" class="mr-2" />
                  <div>
                    <p class="text-caption mb-0 text-medium-emphasis">
                      {{ stat.label }}
                    </p>
                    <p class="text-body-1 font-weight-medium mb-0">
                      {{ stat.value }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <v-card-text class="pa-6">
            <v-row class="g-6">
              <v-col cols="12" md="6">
                <div class="profile-public__section">
                  <div class="d-flex align-center justify-space-between mb-4">
                    <div>
                      <p class="text-overline mb-1">
                        {{ t('profile.sections.personalInfo.title') }}
                      </p>
                      <h3 class="text-subtitle-1 font-weight-medium mb-0">
                        {{ t('profile.public.page.title') }}
                      </h3>
                    </div>
                    <v-icon icon="mdi-information-outline" size="22" />
                  </div>

                  <div v-if="hasContactInfo" class="profile-public__list">
                    <div
                      v-for="item in contactItems"
                      :key="item.label"
                      class="profile-public__list-item"
                    >
                      <div class="profile-public__list-icon">
                        <v-icon :icon="item.icon" size="18" />
                      </div>
                      <div>
                        <p class="text-caption text-medium-emphasis mb-1">
                          {{ item.label }}
                        </p>
                        <p class="text-body-2 mb-0">{{ item.value }}</p>
                      </div>
                    </div>
                  </div>
                  <p v-else class="text-body-2 text-medium-emphasis mb-0">
                    {{ t('profile.public.labels.empty') }}
                  </p>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="profile-public__section">
                  <div class="d-flex align-center justify-space-between mb-4">
                    <div>
                      <p class="text-overline mb-1">
                        {{ t('profile.sections.roles.title') }}
                      </p>
                      <h3 class="text-subtitle-1 font-weight-medium mb-0">
                        {{ t('profile.public.labels.enabled') }}
                      </h3>
                    </div>
                    <v-icon icon="mdi-shield-account-outline" size="22" />
                  </div>

                  <div v-if="hasRoles" class="d-flex flex-wrap gap-2 mb-1">
                    <v-chip
                      v-for="role in roles"
                      :key="role"
                      color="primary"
                      variant="tonal"
                      size="small"
                    >
                      {{ role }}
                    </v-chip>
                  </div>
                  <p v-else class="text-body-2 text-medium-emphasis mb-0">
                    {{ t('profile.sections.roles.empty') }}
                  </p>
                </div>

                <div v-if="showMetadata" class="profile-public__metadata mt-4">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="profile-public__stat">
                        <span class="text-caption text-medium-emphasis">
                          {{ t('profile.public.labels.friends') }}
                        </span>
                        <span class="text-body-1 font-weight-medium">{{
                          friendsCount
                        }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="profile-public__stat">
                        <span class="text-caption text-medium-emphasis">
                          {{ t('profile.public.labels.stories') }}
                        </span>
                        <span class="text-body-1 font-weight-medium">{{
                          storiesCount
                        }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </AppCard>

        <v-sheet
          v-else
          class="d-flex flex-column align-center justify-center py-16 text-center"
          elevation="1"
          rounded="xl"
        >
          <v-icon icon="mdi-account-question" size="64" class="mb-4" />
          <h2 class="text-h5 mb-2">
            {{ t('profile.public.errors.notFound') }}
          </h2>
          <p class="text-medium-emphasis mb-0">
            {{ t('profile.public.page.description') }}
          </p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped src="~/assets/styles/pages/account/username.css"></style>
