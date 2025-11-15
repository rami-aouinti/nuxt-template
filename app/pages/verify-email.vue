<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import { useRoute } from 'vue-router'
import { Notify } from '~/stores/notification'
import {axios, AxiosError} from "~/utils/axios";
import type {LoginResponse} from "~/types/auth";
const { t } = useI18n()
const credentials = reactive({
  username: '',
  password: '',
})

const { fetch } = useAppUserSession()
const profileCache = useAuthProfileCache()

const loading = ref(false)

const canSubmit = computed(() => {
  if (loading.value) return false
  return Boolean(credentials.username && credentials.password)
})

const route = useRoute()

const token = computed(() => {
  const rawToken = route.query.token

  if (Array.isArray(rawToken)) {
    return rawToken[0]
  }

  return rawToken as string | undefined
})
const isLoading = ref(false)
const error = ref<string | null>(null)
const verificationResult = ref<Any | null>(null)


const hasVerifiedSuccessfully = computed(() =>
  Boolean(verificationResult.value),
)

const handleVerification = async () => {
  if (!token.value) {
    error.value = 'Token is missing in the URL.'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const data = await $fetch<Any>('/api/auth/verify', {
      method: 'POST',
      body: {
        token: token.value,
      },
    })

    if (data) {
      console.log('Verification successful:', data)
      verificationResult.value = true
      Notify.success(
        data.message || 'Your email has been verified successfully.',
      )
    } else {
      error.value =
        data?.message ||
        'Verification failed. Please contact support if the issue persists.'
    }
  } catch (err: any) {
    console.error('Verification error:', err)

    error.value =
      err?.data?.message ||
      err?.message ||
      'An error occurred during verification. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function submit() {
  if (!canSubmit.value) return
  loading.value = true
  try {
    const { data } = await axios.post<LoginResponse>('/api/auth/login', {
      username: credentials.username,
      password: credentials.password,
    })
    profileCache.value = data.profile
    await fetch()
    Notify.success(t('auth.loginSuccess'))
    await navigateTo('/')
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
        (isRegisterMode.value
          ? t('auth.registerFailed')
          : t('auth.loginFailed'))
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

onMounted(() => {
  if (!token.value) {
    error.value = 'Token is missing in the URL.'
  } else {
    handleVerification()
  }
})
</script>

<template>
  <div>
    <v-alert v-if="error" type="error" class="mb-6">{{ error }}</v-alert>

    <v-container v-if="isLoading">
      <v-row>
        <v-col class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            class="mb-4"
          />
          <h2>Email Verification</h2>
          <p>Your email is being verified...</p>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else-if="hasVerifiedSuccessfully">
      <v-row>
        <v-col class="text-center">
          <v-icon color="success" size="64" class="mb-4">mdi-check</v-icon>
          <h2>Email Verified</h2>
          <p class="mb-6">
            Your email has been verified successfully. Use the credentials below
            to sign in.
          </p>

          <v-card class="mx-auto" max-width="400">
            <v-card-text>
              <v-form class="credentials-dialog__form" @submit.prevent="submit">
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
              </v-form>
              <v-btn
                color="primary"
                size="large"
                class="text-none"
                :loading="loading"
                :disabled="!canSubmit"
                @click="submit"
              >
                {{ t('auth.login') }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
