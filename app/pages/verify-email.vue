<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Notify } from '~/stores/notification'

interface VerificationCredentials {
  email?: string
  password?: string
}

interface VerificationResponse {
  success: boolean
  message?: string
  credentials?: VerificationCredentials | null
  [key: string]: unknown
}

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
const verificationResult = ref<VerificationResponse | null>(null)

const credentials = computed<VerificationCredentials | null>(() => {
  const result = verificationResult.value
  if (!result) {
    return null
  }

  if (result.credentials && typeof result.credentials === 'object') {
    return result.credentials
  }

  const possibleEmail =
    (result as Record<string, unknown>).email as string | undefined
  const possiblePassword =
    (result as Record<string, unknown>).password as string | undefined

  if (possibleEmail || possiblePassword) {
    return {
      email: possibleEmail,
      password: possiblePassword,
    }
  }

  return null
})

const hasVerifiedSuccessfully = computed(() =>
  Boolean(verificationResult.value?.success),
)

const handleVerification = async () => {
  if (!token.value) {
    error.value = 'Token is missing in the URL.'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await useFetch<VerificationResponse>(
      '/api/auth/verify',
      {
        method: 'POST',
        body: {
          token: token.value,
        },
      },
    )

    if (fetchError.value) {
      const message =
        (fetchError.value.data as { message?: string } | null | undefined)
          ?.message || fetchError.value.statusMessage ||
        'Verification failed. Please try again later.'

      error.value = message
      return
    }

    if (!data.value) {
      error.value = 'No response received from the verification service.'
      return
    }

    verificationResult.value = data.value

    if (data.value.success) {
      Notify.success('Your email has been verified successfully.')
    } else {
      error.value =
        data.value.message ||
        'Verification failed. Please contact support if the issue persists.'
    }
  } catch (err) {
    console.error('Verification error:', err)
    error.value = 'An error occurred during verification. Please try again.'
  } finally {
    isLoading.value = false
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
              <v-list density="comfortable">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-email</v-icon>
                  </template>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ credentials?.email || 'Unavailable' }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider class="my-2" />

                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-lock</v-icon>
                  </template>
                  <v-list-item-title>Password</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ credentials?.password || 'Unavailable' }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
