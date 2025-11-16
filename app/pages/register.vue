<script setup lang="ts">
import { Notify } from '~/stores/notification'
import { axios, AxiosError } from '~/utils/axios'

const router = useRouter()
const { t } = useI18n()
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
})
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const canSubmit = computed(
  () =>
    Boolean(
        form.email.trim() &&
        form.password.trim() &&
        form.confirmPassword.trim() &&
        form.agree,
    ) && !loading.value,
)

const onSubmit = async () => {
  if (!canSubmit.value) return
  if (form.password !== form.confirmPassword) {
    errorMessage.value = t('auth.passwordMismatch')
    Notify.error(errorMessage.value)
    return
  }
  loading.value = true
  errorMessage.value = null
  try {
    await axios.post('/api/auth/register', {
      email: form.email,
      password: form.password,
      repeatPassword: form.confirmPassword,
    })
    Notify.success(t('auth.registerSuccess'))
    router.push('/login?registered=true')
  } catch (error) {
    let message = t('auth.registerFailed')
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
  title: 'auth.register',
})
</script>

<template>
  <div class="auth-card">
    <div class="auth-card__header">
      <h2>{{ t('pages.auth.register.title') }}</h2>
      <p>{{ t('pages.auth.register.subtitle') }}</p>
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
        :label="t('pages.auth.register.emailLabel')"
        type="email"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-text-field
        v-model="form.password"
        :label="t('pages.auth.register.passwordLabel')"
        type="password"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-text-field
        v-model="form.confirmPassword"
        :label="t('pages.auth.register.confirmPasswordLabel')"
        type="password"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-switch
        v-model="form.agree"
        color="primary"
        hide-details
        inset
        :true-value="true"
        :false-value="false"
        class="text-caption"
        :label="t('pages.auth.register.termsLabel')"
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
        {{ t('pages.auth.register.submit') }}
      </v-btn>
    </v-form>
    <p class="auth-card__footer">
      {{ t('pages.auth.register.signinPrompt') }}
      <NuxtLink class="text-primary text-decoration-none" to="/login">
        {{ t('pages.auth.register.signinCta') }}
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.auth-card {
  width: min(460px, 100%);
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
