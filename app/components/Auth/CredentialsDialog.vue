<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'

const model = defineModel<boolean>({ required: true })

const { t } = useI18n()

const mode = ref<'login' | 'register'>('login')

const credentials = reactive({
  username: '',
  password: '',
})

const registration = reactive({
  email: '',
  password: '',
  repeatPassword: '',
})

const loading = ref(false)
const errorMessage = ref('')

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

const { fetch } = useUserSession()
const profileCache = useAuthProfileCache()

const isRegisterMode = computed(() => mode.value === 'register')

const passwordMismatch = computed(
  () =>
    isRegisterMode.value &&
    registration.password.length > 0 &&
    registration.repeatPassword.length > 0 &&
    registration.password !== registration.repeatPassword,
)

const canSubmit = computed(() => {
  if (loading.value) return false
  if (isRegisterMode.value) {
    return Boolean(
      registration.email &&
        registration.password &&
        registration.repeatPassword &&
        !passwordMismatch.value,
    )
  }
  return Boolean(credentials.username && credentials.password)
})

const headerIcon = computed(() =>
  isRegisterMode.value ? 'mdi-account-plus' : 'mdi-lock-open-variant',
)

const headerTitle = computed(() =>
  isRegisterMode.value ? t('auth.register') : t('auth.login'),
)

const headerSubtitle = computed(() =>
  isRegisterMode.value ? t('auth.registerSubtitle') : t('auth.loginSubtitle'),
)

function resetState() {
  credentials.username = ''
  credentials.password = ''
  registration.email = ''
  registration.password = ''
  registration.repeatPassword = ''
  errorMessage.value = ''
}

watch(
  () => model.value,
  (value) => {
    if (!value) {
      resetState()
      loading.value = false
      mode.value = 'login'
    }
  },
)

watch(
  () => mode.value,
  () => {
    errorMessage.value = ''
    loading.value = false
    if (isRegisterMode.value) {
      credentials.username = ''
      credentials.password = ''
    } else {
      registration.email = ''
      registration.password = ''
      registration.repeatPassword = ''
    }
  },
)

async function submit() {
  if (!canSubmit.value) return
  loading.value = true
  try {
    if (isRegisterMode.value) {
      if (passwordMismatch.value) {
        throw new Error(t('auth.passwordMismatch'))
      }
      await axios.post('https://bro-world.org/api/v1/auth/register', {
        email: registration.email,
        password: registration.password,
        repeatPassword: registration.repeatPassword,
      })
      Notify.success(t('auth.registerSuccess'))
      credentials.username = registration.email
      mode.value = 'login'
      return
    }

    const { data } = await axios.post<LoginResponse>('/api/auth/login', {
      username: credentials.username,
      password: credentials.password,
    })
    profileCache.value = data.profile
    await fetch()
    Notify.success(t('auth.loginSuccess'))
    model.value = false
  } catch (error) {
    if (error instanceof AxiosError) {
      const responseMessage =
        (error.response?.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : null) || error.response?.statusText

      errorMessage.value =
        responseMessage ||
        (isRegisterMode.value ? t('auth.registerFailed') : t('auth.loginFailed'))
    } else if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = t('common.unexpectedError')
    }
    Notify.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

function close() {
  if (loading.value) return
  model.value = false
}

function toggleMode() {
  mode.value = isRegisterMode.value ? 'login' : 'register'
}
</script>

<template>
  <v-dialog v-model="model" max-width="460" persistent>
    <v-card class="credentials-dialog">
      <div class="credentials-dialog__header">
        <v-avatar color="white" size="46" class="credentials-dialog__header-avatar">
          <v-icon :icon="headerIcon" color="primary" size="30" />
        </v-avatar>
        <div>
          <div class="text-h5 font-weight-bold">{{ headerTitle }}</div>
          <div class="text-body-2">{{ headerSubtitle }}</div>
        </div>
      </div>
      <v-card-text class="pt-6 pb-0 px-6">
        <v-expand-transition>
          <div v-if="!isRegisterMode" key="login" class="mb-6">
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ t('auth.oauthSignInPrompt') }}
            </p>
            <div class="credentials-dialog__providers">
              <v-btn
                v-for="provider in oauthProviders"
                :key="provider.key"
                block
                variant="outlined"
                color="primary"
                class="text-none"
                :href="provider.href"
                rel="external"
                :aria-label="t(provider.translationKey)"
                :disabled="loading"
              >
                <template #prepend>
                  <v-icon :icon="provider.icon" />
                </template>
              </v-btn>
            </div>
            <div class="credentials-dialog__divider">
              <v-divider class="flex-grow-1" />
              <span class="text-caption text-medium-emphasis px-3">
                {{ t('auth.credentialsSignInPrompt') }}
              </span>
              <v-divider class="flex-grow-1" />
            </div>
          </div>
        </v-expand-transition>
        <v-expand-transition>
          <div v-if="isRegisterMode" key="register" class="mb-6">
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ t('auth.credentialsRegisterPrompt') }}
            </p>
          </div>
        </v-expand-transition>
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          density="compact"
        >
          {{ errorMessage }}
        </v-alert>
        <v-form class="credentials-dialog__form" @submit.prevent="submit">
          <template v-if="!isRegisterMode">
            <v-text-field
              v-model="credentials.username"
              :label="t('auth.username')"
              autocomplete="username"
              prepend-inner-icon="mdi-account"
              variant="solo-filled"
              color="primary"
              class="mb-4"
              density="comfortable"
              required
              :disabled="loading"
            />
            <v-text-field
              v-model="credentials.password"
              :label="t('auth.password')"
              type="password"
              autocomplete="current-password"
              prepend-inner-icon="mdi-lock"
              variant="solo-filled"
              color="primary"
              class="mb-2"
              density="comfortable"
              required
              :disabled="loading"
            />
          </template>
          <template v-else>
            <v-text-field
              v-model="registration.email"
              type="email"
              :label="t('auth.email')"
              autocomplete="email"
              prepend-inner-icon="mdi-email"
              variant="solo-filled"
              color="primary"
              class="mb-4"
              density="comfortable"
              required
              :disabled="loading"
            />
            <v-text-field
              v-model="registration.password"
              :label="t('auth.password')"
              type="password"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock"
              variant="solo-filled"
              color="primary"
              class="mb-4"
              density="comfortable"
              required
              :disabled="loading"
            />
            <v-text-field
              v-model="registration.repeatPassword"
              :label="t('auth.repeatPassword')"
              type="password"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock-check"
              variant="solo-filled"
              color="primary"
              class="mb-2"
              density="comfortable"
              required
              :disabled="loading"
              :error="passwordMismatch"
              :error-messages="passwordMismatch ? [t('auth.passwordMismatch')] : []"
            />
          </template>
        </v-form>
      </v-card-text>
      <v-card-actions class="credentials-dialog__actions">
        <div class="credentials-dialog__switch">
          <span class="text-body-2 text-medium-emphasis">
            {{
              isRegisterMode
                ? t('auth.haveAccountPrompt')
                : t('auth.noAccountPrompt')
            }}
          </span>
          <v-btn variant="plain" color="primary" class="px-1 text-none" @click="toggleMode">
            {{
              isRegisterMode
                ? t('auth.switchToLogin')
                : t('auth.switchToRegister')
            }}
          </v-btn>
        </div>
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="close">
          {{ t('common.actions.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          size="large"
          class="text-none"
          :loading="loading"
          :disabled="!canSubmit"
          @click="submit"
        >
          {{ isRegisterMode ? t('auth.registerAction') : t('auth.login') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.credentials-dialog {
  overflow: hidden;
  border-radius: 18px;
}

.credentials-dialog__header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 32px 24px;
  background: linear-gradient(
    135deg,
    var(--v-theme-primary),
    var(--v-theme-primary-darken-1, #1a237e)
  );
  color: rgba(255, 255, 255, 0.92);
}

.credentials-dialog__header-avatar {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.credentials-dialog__providers {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.credentials-dialog__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.credentials-dialog__form {
  display: flex;
  flex-direction: column;
}

.credentials-dialog__actions {
  padding: 24px 24px 28px;
  align-items: center;
}

.credentials-dialog__switch {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 480px) {
  .credentials-dialog__header {
    padding: 24px;
  }

  .credentials-dialog__actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .credentials-dialog__actions .v-btn:last-of-type {
    align-self: stretch;
  }
}
</style>
