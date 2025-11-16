<script setup lang="ts">
import { Notify } from '~/stores/notification'
import { axios, AxiosError } from '~/utils/axios'

const { t } = useI18n()
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})
const loading = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const canSubmit = computed(
  () =>
    Boolean(
      form.email.trim() && form.password.trim() && form.confirmPassword.trim(),
    ) && !loading.value,
)

const onSubmit = async () => {
  if (!canSubmit.value) return
  if (form.password !== form.confirmPassword) {
    errorMessage.value = t('auth.passwordMismatch')
    successMessage.value = null
    Notify.error(errorMessage.value)
    return
  }
  loading.value = true
  successMessage.value = null
  errorMessage.value = null
  try {
    const { data } = await axios.post<{ message?: string }>(
      '/api/auth/reset-password',
      {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      },
    )
    successMessage.value =
      data?.message || t('pages.auth.forgotPassword.success')
    Notify.success(successMessage.value)
    form.password = ''
    form.confirmPassword = ''
  } catch (error) {
    let message = t('common.unexpectedError')
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
      } else {
        message = t('auth.loginFailed')
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
  title: 'pages.auth.forgotPassword.metaTitle',
})
</script>

<template>
  <div class="auth-card">
    <div class="auth-card__header">
      <div class="auth-card__badge">{{ t('pages.auth.forgotPassword.badge') }}</div>
      <h2>{{ t('pages.auth.forgotPassword.title') }}</h2>
      <p>{{ t('pages.auth.forgotPassword.subtitle') }}</p>
    </div>
    <v-form class="d-flex flex-column ga-4" @submit.prevent="onSubmit">
      <v-text-field
        v-model="form.email"
        :label="t('pages.auth.forgotPassword.emailLabel')"
        type="email"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-text-field
        v-model="form.password"
        :label="t('pages.auth.forgotPassword.passwordLabel')"
        type="password"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-text-field
        v-model="form.confirmPassword"
        :label="t('pages.auth.forgotPassword.confirmPasswordLabel')"
        type="password"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        :loading="loading"
        :disabled="!canSubmit"
      >
        {{ t('pages.auth.forgotPassword.submit') }}
      </v-btn>
    </v-form>
    <v-alert
      v-if="successMessage"
      class="mt-4"
      type="success"
      variant="tonal"
      density="comfortable"
    >
      {{ successMessage }}
    </v-alert>
    <v-alert
      v-else-if="errorMessage"
      class="mt-4"
      type="error"
      variant="tonal"
      density="comfortable"
    >
      {{ errorMessage }}
    </v-alert>
    <p class="auth-card__footer">
      {{ t('pages.auth.forgotPassword.backPrompt') }}
      <NuxtLink class="text-primary text-decoration-none" to="/login">
        {{ t('pages.auth.forgotPassword.backCta') }}
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
  background: rgba(14, 165, 233, 0.12);
  color: #7dd3fc;
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
