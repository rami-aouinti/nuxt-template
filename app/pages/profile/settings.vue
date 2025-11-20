<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'
import type { AuthProfile } from '~/types/auth'
import { Notify } from '~/stores/notification'
import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'

definePageMeta({
  title: 'navigation.settings',
})

const { t } = useI18n()
const { session } = useAppUserSession()
const profileCache = useAuthProfileCache()

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


const profileEmail = computed(() => {
  if (profile.value) {
    const trimmed = profile.value.email.trim()
    if (trimmed.length > 0) {
      return trimmed
    }
  }

  const fallback = currentUser.value?.email
  if (typeof fallback === 'string') {
    const trimmed = fallback.trim()
    if (trimmed.length > 0) {
      return trimmed
    }
  }

  return ''
})

type PasswordForm = {
  newPassword: string
  confirmPassword: string
}

interface ResetPasswordResponse {
  message?: string
}

const passwordForm = reactive<PasswordForm>({
  newPassword: '',
  confirmPassword: '',
})

const isSubmittingPassword = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccessMessage = ref<string | null>(null)

const canSubmitPassword = computed(() => {
  const newPassword = passwordForm.newPassword.trim()
  const confirmPassword = passwordForm.confirmPassword.trim()

  return (
    Boolean(profileEmail.value) &&
    !isSubmittingPassword.value &&
    newPassword.length > 0 &&
    confirmPassword.length > 0
  )
})

const submitPasswordChange = async () => {
  passwordError.value = null
  passwordSuccessMessage.value = null

  const newPassword = passwordForm.newPassword.trim()
  const confirmPassword = passwordForm.confirmPassword.trim()

  if (!profileEmail.value) {
    passwordError.value = t(
      'pages.settings.sections.security.form.emailMissing',
    )
    return
  }

  if (!newPassword || !confirmPassword) {
    passwordError.value = t('pages.settings.sections.security.form.error')
    return
  }

  if (newPassword !== confirmPassword) {
    passwordError.value = t(
      'pages.settings.sections.security.form.passwordMismatch',
    )
    return
  }

  isSubmittingPassword.value = true

  try {
    const response = await $fetch<ResetPasswordResponse>(
      '/api/auth/reset-password',
      {
        method: 'POST',
        body: {
          email: profileEmail.value,
          password: newPassword,
          confirmPassword,
        },
      },
    )

    const successMessage = (() => {
      if (response?.message) {
        const trimmed = response.message.trim()
        if (trimmed.length > 0) {
          return trimmed
        }
      }

      return t('pages.settings.sections.security.form.success')
    })()

    passwordSuccessMessage.value = successMessage
    Notify.success(successMessage)
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    let message = t('pages.settings.sections.security.form.error')

    if (error instanceof FetchError) {
      const data = error.data as { message?: string } | undefined

      if (data?.message) {
        const trimmed = data.message.trim()
        if (trimmed.length > 0) {
          message = trimmed
        }
      } else if (typeof error.message === 'string') {
        const trimmed = error.message.trim()
        if (trimmed.length > 0) {
          message = trimmed
        }
      }
    } else if (error instanceof Error) {
      const trimmed = error.message.trim()
      if (trimmed.length > 0) {
        message = trimmed
      }
    }

    passwordError.value = message
    Notify.error(message)
  } finally {
    isSubmittingPassword.value = false
  }
}

watch(
  () => [passwordForm.newPassword, passwordForm.confirmPassword],
  ([newPassword, confirmPassword]) => {
    if (passwordError.value) {
      passwordError.value = null
    }

    if (
      passwordSuccessMessage.value &&
      (newPassword.trim().length > 0 || confirmPassword.trim().length > 0)
    ) {
      passwordSuccessMessage.value = null
    }
  },
)
</script>

<template>
  <div class="profile-settings-page">
    <client-only>
      <teleport to="#app-drawer-right">
        <div class="d-flex align-center mb-3">
          <v-icon
            icon="mdi-shield-lock-outline"
            size="32"
            class="mr-3 text-primary"
          />
          <h4 class="text-h6 font-weight-medium mb-0">
            {{ t('pages.settings.sections.security.title') }}
          </h4>
        </div>
        <v-divider class="my-4" />
        <p class="text-body-2 mb-3">
          {{ t('pages.settings.sections.security.form.description') }}
        </p>
        <v-alert
          v-if="profileEmail"
          type="info"
          variant="tonal"
          density="comfortable"
          class="mb-3"
        >
          {{
            t('pages.settings.sections.security.form.emailInfo', {
              email: profileEmail,
            })
          }}
        </v-alert>
        <v-alert
          v-else
          type="warning"
          variant="tonal"
          density="comfortable"
          class="mb-3"
        >
          {{ t('pages.settings.sections.security.form.emailMissing') }}
        </v-alert>
        <v-alert
          v-if="passwordError"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-3"
        >
          {{ passwordError }}
        </v-alert>
        <v-alert
          v-if="passwordSuccessMessage"
          type="success"
          variant="tonal"
          density="compact"
          class="mb-3"
        >
          {{ passwordSuccessMessage }}
        </v-alert>
        <v-form @submit.prevent="submitPasswordChange">
          <v-text-field
            v-model="passwordForm.newPassword"
            :label="t('pages.settings.sections.security.form.newPasswordLabel')"
            type="password"
            autocomplete="new-password"
            :disabled="isSubmittingPassword || !profileEmail"
            rounded
            class="mb-3"
          />
          <v-text-field
            v-model="passwordForm.confirmPassword"
            :label="
              t('pages.settings.sections.security.form.confirmPasswordLabel')
            "
            type="password"
            autocomplete="new-password"
            :disabled="isSubmittingPassword || !profileEmail"
            rounded
            class="mb-4"
          />
          <div class="d-flex justify-end">
            <v-btn
              type="submit"
              color="primary"
              :loading="isSubmittingPassword"
              :disabled="!canSubmitPassword"
            >
              {{ t('pages.settings.sections.security.form.submit') }}
            </v-btn>
          </div>
        </v-form>
      </teleport>
    </client-only>
    <ProfilePageShell>
      <v-row class="d-flex" />
    </ProfilePageShell>
  </div>
</template>
