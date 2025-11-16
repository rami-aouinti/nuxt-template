<script setup lang="ts">
const currentYear = new Date().getFullYear()
const { t } = useI18n()

type HeroStat = {
  labelKey: string
  valueKey: string
}

const heroStats: HeroStat[] = [
  {
    labelKey: 'layouts.auth.hero.stats.availability.label',
    valueKey: 'layouts.auth.hero.stats.availability.value',
  },
  {
    labelKey: 'layouts.auth.hero.stats.clients.label',
    valueKey: 'layouts.auth.hero.stats.clients.value',
  },
  {
    labelKey: 'layouts.auth.hero.stats.updates.label',
    valueKey: 'layouts.auth.hero.stats.updates.value',
  },
]
</script>

<template>
  <v-app class="auth-app">
    <v-main class="auth-main">
      <div class="auth-shell">
        <section class="auth-hero justify-center align-center text-center text-white">
          <div class="auth-hero__glow" />
          <div class="auth-hero__content">
            <v-icon size="92">mdi-earth</v-icon>
            <h1>{{ t('layouts.auth.hero.title') }}</h1>
            <p>{{ t('layouts.auth.hero.description') }}</p>
            <div class="auth-hero__stats">
              <div v-for="stat in heroStats" :key="stat.labelKey">
                <p class="auth-hero__stats-label">{{ t(stat.labelKey) }}</p>
                <p class="auth-hero__stats-value">{{ t(stat.valueKey) }}</p>
              </div>
            </div>
            <v-divider class="my-4" opacity="0.3" />
            <p class="auth-hero__footnote">
              {{ t('layouts.auth.footer', { year: currentYear }) }}
            </p>
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
}

.auth-hero h1 {
  font-size: clamp(2rem, 3vw, 2.6rem);
  margin-bottom: 16px;
}

.auth-hero__stats {
  justify-content: center;
  display: flex;
  gap: 24px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.auth-hero__stats-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
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
