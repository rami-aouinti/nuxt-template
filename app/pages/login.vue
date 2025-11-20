<script setup lang="ts">
import { Notify } from '~/stores/notification'
import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'

const { t } = useI18n()
const { fetch } = useAppUserSession()
const profileCache = useAuthProfileCache()

const oauthProviders = [
  {
    key: 'github',
    icon: 'mdi-github',
    href: '/api/auth/github',
    translationKey: 'auth.loginWithGithub',
  },
  {
    key: 'google',
    icon: 'mdi-google',
    href: '/api/auth/google',
    translationKey: 'auth.loginWithGoogle',
  },
  {
    key: 'facebook',
    icon: 'mdi-facebook',
    href: '/api/auth/facebook',
    translationKey: 'auth.loginWithFacebook',
  },
] as const

const form = reactive({
  email: '',
  password: '',
  remember: true,
})
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const canSubmit = computed(
  () => Boolean(form.email.trim() && form.password.trim()) && !loading.value,
)

const onSubmit = async () => {
  if (!canSubmit.value) return
  loading.value = true
  errorMessage.value = null
  try {
    const { data } = await axios.post<LoginResponse>('/api/auth/login', {
      username: form.email,
      password: form.password,
    })
    profileCache.value = data.profile
    await fetch()
    Notify.success(t('auth.loginSuccess'))
    window.location.href = '/'
  } catch (error) {
    let message = t('auth.loginFailed')
    if (error instanceof AxiosError) {
      const responseMessage =
        (error.response?.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : null) ||
        error.response?.statusText ||
        null
      if (responseMessage) {
        message = responseMessage
      }
    } else if (error instanceof Error) {
      message = error.message
    }
    errorMessage.value = message
    Notify.error(message)
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'auth',
  title: 'auth.login',
})
</script>

<template>
  <div class="auth-card">
    <div class="auth-card__header">
      <h2>{{ t('pages.auth.login.title') }}</h2>
      <p>{{ t('pages.auth.login.subtitle') }}</p>
    </div>
    <v-alert
      v-if="errorMessage"
      class="mb-4"
      type="error"
      variant="tonal"
      density="comfortable"
    >
      {{ errorMessage }}
    </v-alert>

    <div class="credentials-dialog__providers">
      <v-btn
        v-for="provider in oauthProviders"
        :key="provider.key"
        icon
        size="small"
        variant="outlined"
        color="primary"
        class="text-none"
        :href="provider.href"
        rel="external"
        :aria-label="t(provider.translationKey)"
        :disabled="loading"
      >
        <v-icon :icon="provider.icon" />
      </v-btn>
    </div>
    <div class="credentials-dialog__divider">
      <v-divider class="flex-grow-1" />
      <span class="text-caption text-medium-emphasis px-3">
        {{ t('auth.credentialsSignInPrompt') }}
      </span>
      <v-divider class="flex-grow-1" />
    </div>
    <v-form class="d-flex flex-column ga-4" @submit.prevent="onSubmit">
      <v-text-field
        v-model="form.email"
        :label="t('pages.auth.login.emailLabel')"
        type="email"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-text-field
        v-model="form.password"
        :label="t('pages.auth.login.passwordLabel')"
        type="password"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <v-checkbox-btn
          v-model="form.remember"
          :label="t('pages.auth.login.rememberMe')"
          density="compact"
        />
        <NuxtLink
          class="text-primary text-decoration-none"
          to="/forgot-password"
        >
          {{ t('pages.auth.login.forgotPassword') }}
        </NuxtLink>
      </div>
      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        :loading="loading"
        :disabled="!canSubmit"
      >
        {{ t('pages.auth.login.submit') }}
      </v-btn>
    </v-form>
    <p class="auth-card__footer">
      {{ t('pages.auth.login.signupPrompt') }}
      <NuxtLink class="text-primary text-decoration-none" to="/register">
        {{ t('pages.auth.login.signupCta') }}
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.auth-card {
  width: min(420px, 100%);
}

.auth-card__header {
  text-align: left;
  margin-bottom: 32px;
}

.auth-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary));
  color: rgba(var(--v-theme-primary), 0.04);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.65rem;
}

.credentials-dialog__providers {
  justify-content: center;
  display: flex;
  gap: 12px;
}

.credentials-dialog__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.auth-card__header h2 {
  font-size: 2rem;
  margin-top: 16px;
  margin-bottom: 8px;
}

.auth-card__footer {
  margin-top: 24px;
  text-align: center;
}
</style>
