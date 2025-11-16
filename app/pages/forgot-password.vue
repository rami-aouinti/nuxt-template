<script setup lang="ts">
const email = ref('')
const loading = ref(false)
const message = ref('')

const onSubmit = async () => {
  loading.value = true
  message.value = ''
  await new Promise((resolve) => setTimeout(resolve, 1200))
  loading.value = false
  message.value =
    'Un lien sécurisé vient de vous être envoyé. Vérifiez votre boîte mail pour continuer.'
}

definePageMeta({
  layout: 'auth',
  title: 'Réinitialiser le mot de passe',
})
</script>

<template>
  <div class="auth-card">
    <div class="auth-card__header">
      <div class="auth-card__badge">Assistance</div>
      <h2>Réinitialisez votre mot de passe</h2>
      <p>Nous vous guiderons pour retrouver l'accès à votre espace en quelques instants.</p>
    </div>
    <v-form class="d-flex flex-column ga-4" @submit.prevent="onSubmit">
      <v-text-field
        v-model="email"
        label="Email professionnel"
        type="email"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        required
      />
      <v-btn type="submit" color="primary" size="large" block :loading="loading">
        Envoyer le lien sécurisé
      </v-btn>
    </v-form>
    <v-alert v-if="message" class="mt-4" type="success" variant="tonal">{{ message }}</v-alert>
    <p class="auth-card__footer">
      Se souvenir de votre mot de passe ?
      <NuxtLink class="text-primary text-decoration-none" to="/login">Retour à la connexion</NuxtLink>
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
