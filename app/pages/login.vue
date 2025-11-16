<script setup lang="ts">
const router = useRouter()
const form = reactive({
  email: '',
  password: '',
  remember: true,
})
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1200))
  loading.value = false
  router.push('/')
}

definePageMeta({
  layout: 'auth',
  title: 'Connexion',
})
</script>

<template>
  <div class="auth-card">
    <div class="auth-card__header">
      <div class="auth-card__badge">Bienvenue</div>
      <h2>Connexion</h2>
      <p>Reprenez la main sur vos projets avec un espace de travail parfaitement organisé.</p>
    </div>
    <v-form class="d-flex flex-column ga-4" @submit.prevent="onSubmit">
      <v-text-field
        v-model="form.email"
        label="Email professionnel"
        type="email"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-text-field
        v-model="form.password"
        label="Mot de passe"
        type="password"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <v-checkbox-btn v-model="form.remember" label="Se souvenir de moi" density="compact" />
        <NuxtLink class="text-primary text-decoration-none" to="/forgot-password">
          Mot de passe oublié ?
        </NuxtLink>
      </div>
      <v-btn type="submit" color="primary" size="large" block :loading="loading">Se connecter</v-btn>
      <v-btn
        color="white"
        class="text-primary"
        size="large"
        block
        variant="outlined"
        prepend-icon="mdi-google"
      >
        Continuer avec Google
      </v-btn>
    </v-form>
    <p class="auth-card__footer">
      Pas encore de compte ?
      <NuxtLink class="text-primary text-decoration-none" to="/register">Créer un compte</NuxtLink>
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
