<script setup lang="ts">
import { Notify } from '~/stores/notification'
import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'

const router = useRouter()
const { t } = useI18n()
const { fetch } = useAppUserSession()
const profileCache = useAuthProfileCache()

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
    router.push('/')
  } catch (error) {
    let message = t('auth.loginFailed')
    if (error instanceof AxiosError) {
      const responseMessage =
        (error.response?.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : null) || error.response?.statusText || null
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
      <div class="auth-card__badge">{{ t('pages.auth.login.badge') }}</div>
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
        <NuxtLink class="text-primary text-decoration-none" to="/forgot-password">
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
      <v-btn
        color="white"
        class="text-primary"
        size="large"
        block
        variant="outlined"
        prepend-icon="mdi-google"
      >
        {{ t('pages.auth.login.google') }}
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
  color: rgba(255, 255, 255, 0.9);
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
  background: rgba(99, 102, 241, 0.12);
  color: #a5b4fc;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.65rem;
}

.auth-card__header h2 {
  font-size: 2rem;
  margin-top: 16px;
  margin-bottom: 8px;
}

.auth-card__header p {
  color: rgba(255, 255, 255, 0.7);
}

.auth-card__footer {
  margin-top: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}
</style>
