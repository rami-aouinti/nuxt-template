<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { axios, AxiosError } from '~/utils/axios'
import type { LoginResponse } from '~/types/auth'

const model = defineModel<boolean>({ required: true })

const { t } = useI18n()

const credentials = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

const { fetch } = useUserSession()
const profileCache = useAuthProfileCache()

const canSubmit = computed(() =>
  Boolean(credentials.username && credentials.password && !loading.value),
)

function resetState() {
  credentials.username = ''
  credentials.password = ''
  errorMessage.value = ''
}

watch(
  () => model.value,
  (value) => {
    if (!value) {
      resetState()
      loading.value = false
    }
  },
)

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

      errorMessage.value = responseMessage || t('auth.loginFailed')
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
</script>

<template>
  <v-dialog v-model="model" max-width="420" persistent>
    <v-card>
      <v-card-title class="text-wrap">Connexion par identifiants</v-card-title>
      <v-card-text>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Saisissez votre nom d'utilisateur et votre mot de passe pour vous
          connecter.
        </p>
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          density="compact"
        >
          {{ errorMessage }}
        </v-alert>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="credentials.username"
            label="Nom d'utilisateur"
            autocomplete="username"
            prepend-inner-icon="mdi-account"
            required
            :disabled="loading"
          />
          <v-text-field
            v-model="credentials.password"
            label="Mot de passe"
            type="password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock"
            required
            :disabled="loading"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close"> Annuler </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!canSubmit"
          @click="submit"
        >
          Se connecter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
