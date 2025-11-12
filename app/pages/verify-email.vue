<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const token = route.query.token
const isLoading = ref(false)
const error = ref(null)

const handleVerification = async () => {
  if (!token) {
    error.value = 'Token is missing in the URL.'
    return
  }

  isLoading.value = true

  try {
    const { data, error } = await useFetch('/api/verify', {
      method: 'POST',
      body: {
        token: route.query.token,
      },
    })
    if (data) {
      console.log(data)
      Notify.success('Success logged !')
      router.push('/')
    }
    if (error.value) {
      console.error('Failed:', error.value)
    }
  } catch (err) {
    error.value = 'An error occurred during verification. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!token) {
    error.value = 'Token is missing in the URL.'
  } else {
    handleVerification()
  }
})
</script>

<template>
  <div>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-progress-circular v-if="isLoading" indeterminate color="primary" />
    <v-container v-if="!isLoading && !error">
      <v-row>
        <v-col>
          <h2>Email Verification</h2>
          <p>Your email is being verified...</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
