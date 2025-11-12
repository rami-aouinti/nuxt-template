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
const { session } = useUserSession()
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
          <v-card-text class="pa-6">
            <div
              class="d-flex flex-column flex-md-row align-md-center gap-4 mb-6"
            >
              <AppAvatar :src="profilePhoto" :alt="displayName" size="96">
                <template #fallback>
                  <v-icon icon="mdi-account-circle" size="96" />
                </template>
              </AppAvatar>
              <div class="flex-grow-1">
                <h2 class="text-h4 text-h5-sm mb-1">{{ displayName }}</h2>
                <p class="text-medium-emphasis mb-2">{{ usernameLabel }}</p>
                <div class="d-flex flex-wrap align-center gap-3">
                  <v-chip
                    :color="accountStatusColor"
                    size="small"
                    variant="tonal"
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
                    @click="openMessengerConversation"
                  >
                    {{ t('profile.public.actions.message') }}
                  </AppButton>
                </div>
              </div>
            </div>

            <v-divider v-if="hasContactInfo" class="mb-6" />

            <div v-if="hasContactInfo" class="mb-6">
              <h3 class="text-subtitle-1 font-weight-medium mb-4">
                {{ t('profile.sections.personalInfo.title') }}
              </h3>
              <v-row>
                <v-col cols="12" md="6">
                  <p class="text-caption text-medium-emphasis mb-1">
                    {{ t('profile.public.labels.email') }}
                  </p>
                  <p class="text-body-2 mb-0">
                    {{ profile.email || t('profile.public.labels.empty') }}
                  </p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-caption text-medium-emphasis mb-1">
                    {{ t('profile.public.labels.language') }}
                  </p>
                  <p class="text-body-2 mb-0">
                    {{ profile.language || t('profile.public.labels.empty') }}
                  </p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-caption text-medium-emphasis mb-1">
                    {{ t('profile.public.labels.locale') }}
                  </p>
                  <p class="text-body-2 mb-0">
                    {{ profile.locale || t('profile.public.labels.empty') }}
                  </p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-caption text-medium-emphasis mb-1">
                    {{ t('profile.public.labels.timezone') }}
                  </p>
                  <p class="text-body-2 mb-0">
                    {{ profile.timezone || t('profile.public.labels.empty') }}
                  </p>
                </v-col>
              </v-row>
            </div>

            <div class="mb-6">
              <h3 class="text-subtitle-1 font-weight-medium mb-3">
                {{ t('profile.sections.roles.title') }}
              </h3>
              <div v-if="hasRoles" class="d-flex flex-wrap gap-2">
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

            <div v-if="showMetadata" class="profile-public__metadata">
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
