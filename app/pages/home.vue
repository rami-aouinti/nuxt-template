<script setup lang="ts">
definePageMeta({
  title: 'navigation.home',
})

const features = [
  {
    title: 'Intuitive UI',
    description:
      'Une navigation fluide avec des composants prêts à l’emploi et une cohérence visuelle soignée.',
    icon: 'mdi-palette',
  },
  {
    title: 'Performance',
    description:
      'Optimisations côté client et côté serveur pour un chargement rapide et sans accroc.',
    icon: 'mdi-speedometer',
  },
  {
    title: 'Nuxt + Vuetify',
    description:
      'Profitez de la puissance de Nuxt 3 et de la flexibilité de Vuetify pour accélérer vos projets.',
    icon: 'mdi-vuetify',
  },
]

const testimonials = [
  {
    name: 'Alex Martin',
    role: 'Product Designer',
    quote:
      '"Le thème offre une base solide pour concevoir des interfaces élégantes en un temps record."',
  },
  {
    name: 'Camille Dupont',
    role: 'Développeuse Frontend',
    quote:
      '"J’apprécie la propreté du code et la cohérence visuelle. C’est un vrai gain de temps."',
  },
]
</script>

<template>
  <v-container
    fluid
    class="home-page pa-0"
  >
    <section class="hero py-16">
      <div class="hero__decor hero__decor--one" />
      <div class="hero__decor hero__decor--two" />
      <div class="hero__decor hero__decor--three" />
      <v-container class="px-6 px-md-12 text-center text-md-start">
        <v-row
          align="center"
          justify="space-between"
          class="g-8 hero__grid"
        >
          <v-col
            cols="12"
            md="6"
            class="hero__content"
          >
            <span class="hero__badge">Nuxt Template</span>
            <h1 class="text-h3 text-md-h1 font-weight-bold mt-6 mb-4">
              Améliorez vos expériences utilisateur avec un design moderne
            </h1>
            <p class="text-body-1 text-md-h6 text-medium-emphasis mb-8">
              Construisez rapidement des interfaces élégantes grâce à une base Nuxt + Vuetify
              structurée, modulable et soigneusement conçue pour répondre aux attentes actuelles.
            </p>
            <div class="d-flex flex-column flex-sm-row gap-4 hero__actions">
              <v-btn
                color="primary"
                size="x-large"
                class="px-8 hero__cta"
              >
                Commencer maintenant
              </v-btn>
              <v-btn
                size="x-large"
                variant="outlined"
                class="px-8 hero__cta hero__cta--ghost"
              >
                Voir la démo
              </v-btn>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="5"
          >
            <v-card class="hero-card mx-auto floating-card">
              <v-card-text class="pa-8">
                <h2 class="text-h5 text-md-h4 font-weight-medium mb-4">
                  Design raffiné, code structuré
                </h2>
                <p class="text-body-1 text-medium-emphasis">
                  Des palettes de couleurs harmonieuses, une typographie équilibrée et des composants
                  bien pensés pour offrir une expérience utilisateur mémorable.
                </p>
                <v-divider class="my-6" />
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <p class="text-caption text-uppercase text-medium-emphasis mb-1">
                      Temps d’intégration
                    </p>
                    <p class="text-h4 font-weight-bold">2x plus rapide</p>
                  </div>
                  <v-avatar
                    size="64"
                    color="primary"
                    class="elevation-3"
                  >
                    <v-icon size="32">
                      mdi-lightning-bolt
                    </v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="features py-16">
      <v-container class="px-6 px-md-12">
        <div class="text-center mb-12">
          <span class="section-eyebrow">Fonctionnalités</span>
          <h2 class="text-h4 text-md-h2 font-weight-bold mt-4">
            Une base solide pour vos prochaines interfaces
          </h2>
          <p class="text-body-1 text-medium-emphasis mt-4">
            Des composants soignés, un thème harmonieux et des pratiques modernes prêtes à l’emploi.
          </p>
        </div>
        <v-row class="g-6 feature-grid">
          <v-col
            v-for="(feature, index) in features"
            :key="feature.title"
            cols="12"
            md="4"
          >
            <v-card
              class="feature-card h-100"
              :style="{ '--index': index }"
            >
              <v-card-text class="pa-8">
                <v-avatar
                  color="primary"
                  size="56"
                  class="mb-6 avatar-glow"
                >
                  <v-icon size="32">
                    {{ feature.icon }}
                  </v-icon>
                </v-avatar>
                <h3 class="text-h5 font-weight-semibold mb-3">
                  {{ feature.title }}
                </h3>
                <p class="text-body-2 text-medium-emphasis">
                  {{ feature.description }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="testimonials py-16">
      <v-container class="px-6 px-md-12">
        <v-row class="g-6 testimonial-grid">
          <v-col
            cols="12"
            md="5"
          >
            <span class="section-eyebrow">Ils recommandent</span>
            <h2 class="text-h4 text-md-h2 font-weight-bold mt-4 mb-6">
              Un design qui séduit les équipes produit et développement
            </h2>
            <p class="text-body-1 text-medium-emphasis">
              Les retours positifs soulignent la rapidité d’adaptation du thème, la clarté du code et la
              qualité des composants disponibles.
            </p>
          </v-col>
          <v-col
            cols="12"
            md="7"
          >
            <v-row class="g-4">
              <v-col
                v-for="(testimonial, index) in testimonials"
                :key="testimonial.name"
                cols="12"
                sm="6"
              >
                <v-card
                  class="testimonial-card h-100"
                  :style="{ '--index': index }"
                >
                  <v-card-text class="pa-6">
                    <p class="text-body-2 mb-6">
                      {{ testimonial.quote }}
                    </p>
                    <div>
                      <p class="text-subtitle-1 font-weight-semibold mb-1">
                        {{ testimonial.name }}
                      </p>
                      <p class="text-caption text-medium-emphasis">
                        {{ testimonial.role }}
                      </p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-container>
</template>

<style scoped>
.home-page {
  position: relative;
  background: linear-gradient(180deg, rgba(33, 150, 243, 0.08), rgba(25, 118, 210, 0.12));
  overflow: hidden;
  color: rgb(var(--v-theme-on-surface));
  --home-hero-card-background: rgba(255, 255, 255, 0.85);
  --home-feature-card-background: rgba(255, 255, 255, 0.92);
  --home-card-hover-shadow: 0 16px 40px rgba(25, 118, 210, 0.16);
  --home-testimonials-background: rgba(255, 255, 255, 0.6);
  --home-testimonials-text-color: inherit;
  --home-testimonials-overlay: linear-gradient(
    135deg,
    rgba(33, 150, 243, 0.08),
    rgba(156, 39, 176, 0.08)
  );
}

.hero {
  position: relative;
  overflow: hidden;
}

.hero__grid {
  position: relative;
  z-index: 1;
}

.hero__content {
  animation: fadeSlideUp 0.8s ease forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

.hero__actions {
  gap: 1.25rem;
}

.hero__cta {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero__cta::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.25), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hero__cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(33, 150, 243, 0.24);
}

.hero__cta:hover::after {
  opacity: 1;
}

.hero__cta--ghost {
  border-width: 2px;
}

.hero__decor {
  position: absolute;
  border-radius: 50%;
  filter: blur(0);
  opacity: 0.85;
  animation: pulseGlow 10s ease-in-out infinite;
}

.hero__decor--one {
  width: 420px;
  height: 420px;
  top: -120px;
  right: -160px;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.32) 0%, rgba(33, 150, 243, 0) 65%);
}

.hero__decor--two {
  width: 300px;
  height: 300px;
  bottom: 30px;
  left: -140px;
  background: radial-gradient(circle, rgba(0, 188, 212, 0.28) 0%, rgba(0, 188, 212, 0) 70%);
  animation-delay: 1.2s;
}

.hero__decor--three {
  width: 220px;
  height: 220px;
  top: 160px;
  right: 20%;
  background: radial-gradient(circle, rgba(156, 39, 176, 0.25) 0%, rgba(156, 39, 176, 0) 70%);
  animation-delay: 2.4s;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(33, 150, 243, 0.25), transparent 55%),
    radial-gradient(circle at bottom left, rgba(0, 188, 212, 0.2), transparent 60%);
  opacity: 0.9;
  pointer-events: none;
}

.hero-card {
  border-radius: 24px;
  backdrop-filter: blur(12px);
  background: var(--home-hero-card-background);
  animation: fadeScale 0.9s ease forwards;
  opacity: 0;
  animation-delay: 0.25s;
}

.hero__badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.feature-card,
.testimonial-card {
  border-radius: 20px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  background: var(--home-feature-card-background);
  backdrop-filter: blur(10px);
  animation: fadeSlideUp 0.7s ease forwards;
  opacity: 0;
  animation-delay: calc(0.12s * var(--index));
}

.feature-card:hover,
.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--home-card-hover-shadow);
}

.feature-grid,
.testimonial-grid {
  position: relative;
  z-index: 1;
}

.avatar-glow {
  box-shadow: 0 15px 45px rgba(33, 150, 243, 0.25);
  animation: float 6s ease-in-out infinite;
}

.floating-card {
  position: relative;
  animation: floatY 8s ease-in-out infinite 1.2s;
}

.testimonial-card {
  animation: fadeSlideUp 0.7s ease forwards;
  opacity: 0;
  animation-delay: calc(0.18s + 0.12s * var(--index));
}

.testimonials {
  background: var(--home-testimonials-background);
  position: relative;
  color: var(--home-testimonials-text-color);
}

.testimonials::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--home-testimonials-overlay);
  opacity: 0.9;
  z-index: 0;
}

@media (prefers-color-scheme: dark) {
  .home-page {
    --home-hero-card-background: rgba(18, 18, 18, 0.7);
    --home-feature-card-background: rgba(18, 18, 18, 0.7);
    --home-card-hover-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
    --home-testimonials-background: rgba(18, 18, 18, 0.65);
    --home-testimonials-text-color: rgba(255, 255, 255, 0.86);
    --home-testimonials-overlay: linear-gradient(
      135deg,
      rgba(33, 150, 243, 0.12),
      rgba(156, 39, 176, 0.12)
    );
  }
}

:global(.v-theme--dark) .home-page {
  --home-hero-card-background: rgba(18, 18, 18, 0.7);
  --home-feature-card-background: rgba(18, 18, 18, 0.7);
  --home-card-hover-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  --home-testimonials-background: rgba(18, 18, 18, 0.65);
  --home-testimonials-text-color: rgba(255, 255, 255, 0.86);
  --home-testimonials-overlay: linear-gradient(
    135deg,
    rgba(33, 150, 243, 0.12),
    rgba(156, 39, 176, 0.12)
  );
}

@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeScale {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate3d(0, -6px, 0);
  }

  50% {
    transform: translate3d(0, 6px, 0);
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@keyframes floatY {
  0%,
  100% {
    top: 0;
  }

  50% {
    top: -10px;
  }
}
</style>
