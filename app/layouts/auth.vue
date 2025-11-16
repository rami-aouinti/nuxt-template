<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <v-app class="auth-app">
    <v-main class="auth-main">
      <div class="auth-shell">
        <section class="auth-hero">
          <div class="auth-hero__glow" />
          <div class="auth-hero__content">
            <p class="auth-eyebrow">Nuxt + Vuetify</p>
            <h1>Créez des expériences modernes rapidement.</h1>
            <p>
              Accédez à votre tableau de bord et commencez à piloter votre produit avec une interface
              raffinée, rapide et responsive.
            </p>
            <div class="auth-hero__stats">
              <div>
                <p class="auth-hero__stats-label">Disponibilité</p>
                <p class="auth-hero__stats-value">99.9%</p>
              </div>
              <div>
                <p class="auth-hero__stats-label">Clients actifs</p>
                <p class="auth-hero__stats-value">25k+</p>
              </div>
              <div>
                <p class="auth-hero__stats-label">Mises à jour</p>
                <p class="auth-hero__stats-value">Hebdomadaires</p>
              </div>
            </div>
            <v-divider class="my-4" opacity="0.3" />
            <p class="auth-hero__footnote">© {{ currentYear }} Nuxt Template. Tous droits réservés.</p>
          </div>
        </section>
        <section class="auth-panel">
          <slot />
        </section>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.auth-app {
  background: radial-gradient(circle at top, rgba(var(--v-theme-primary)), transparent), rgba(var(--v-theme-primary), 0.14);
  color: rgba(255, 255, 255, 0.9);
}

.auth-main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-shell {
  width: min(1200px, 100%);
  margin-inline: auto;
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  padding: 32px;
}

.auth-hero {
  position: relative;
  border-radius: 24px;
  padding: 40px;
  background: rgba(var(--v-theme-primary));
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  min-height: 420px;
}

.auth-hero__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(var(--v-theme-primary), 0.14), transparent 60%),
    radial-gradient(circle at 80% 0%, rgba(236, 72, 153, 0.4), transparent 55%);
  filter: blur(35px);
  opacity: 0.7;
}

.auth-hero__content {
  position: relative;
  z-index: 1;
}

.auth-eyebrow {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.auth-hero h1 {
  font-size: clamp(2rem, 3vw, 2.6rem);
  margin-bottom: 16px;
}

.auth-hero p {
  color: rgba(255, 255, 255, 0.75);
}

.auth-hero__stats {
  display: flex;
  gap: 24px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.auth-hero__stats-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.6);
}

.auth-hero__stats-value {
  font-size: 1.4rem;
  font-weight: 600;
}

.auth-panel {
  backdrop-filter: blur(18px);
  border-radius: 24px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 600px) {
  .auth-shell {
    padding: 16px;
  }

  .auth-panel,
  .auth-hero {
    padding: 24px;
  }
}
</style>
