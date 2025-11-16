<script setup lang="ts">
const router = useRouter()
const form = reactive({
  company: '',
  email: '',
  password: '',
  agree: false,
})
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1400))
  loading.value = false
  router.push('/verify-email')
}

definePageMeta({
  layout: 'auth',
  title: "Créer un compte",
})
</script>

<template>
  <div class="auth-card">
    <div class="auth-card__header">
      <div class="auth-card__badge">Nouveau</div>
      <h2>Créez un espace de travail</h2>
      <p>Invitez votre équipe et centralisez vos opérations en quelques secondes.</p>
    </div>
    <v-form class="d-flex flex-column ga-4" @submit.prevent="onSubmit">
      <v-text-field
        v-model="form.company"
        label="Nom de l'organisation"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
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
        label="Créer un mot de passe"
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
        label="J'accepte les conditions d'utilisation"
        required
      />
      <v-btn type="submit" color="primary" size="large" block :loading="loading">Commencer</v-btn>
    </v-form>
    <p class="auth-card__footer">
      Déjà inscrit ?
      <NuxtLink class="text-primary text-decoration-none" to="/login">Se connecter</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.auth-card {
  width: min(460px, 100%);
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
  background: rgba(16, 185, 129, 0.12);
  color: #6ee7b7;
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
