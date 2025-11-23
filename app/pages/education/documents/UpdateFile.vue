<template>
  <v-container class="py-10 education-modern-shell">
    <v-row class="mb-8" align="center" justify="space-between">
      <v-col cols="12" md="8">
        <div class="text-caption text-uppercase text-primary mb-2">Education</div>
        <div class="text-h4 font-weight-bold">Update File</div>
        <div class="text-body-1 text-medium-emphasis">Interface modernisée pour Nuxt 4 et Vuetify 3.</div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end gap-2">
        <v-btn color="primary" prepend-icon="mdi-play-circle" size="large" variant="elevated">
          Découvrir
        </v-btn>
        <v-btn color="secondary" prepend-icon="mdi-pencil" size="large" variant="tonal">
          Configurer
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="g-4">
      <v-col cols="12" md="8">
        <v-card class="pa-6 glass-card" rounded="xl" elevation="4">
          <div class="d-flex align-center mb-4 gap-3">
            <v-avatar color="primary" variant="tonal">
              <v-icon icon="mdi-school-outline" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-semibold">Page simplifiée</div>
              <div class="text-body-2 text-medium-emphasis">
                Retrouvez une base élégante, prête à être branchée sur vos données.
              </div>
            </div>
          </div>

          <v-row>
            <v-col v-for="action in quickActions" :key="action.label" cols="12" md="6">
              <v-card variant="tonal" :color="action.color" class="pa-4" rounded="lg">
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="text-subtitle-2 font-weight-semibold">{{ action.label }}</div>
                  <v-icon :icon="action.icon" :color="action.color" />
                </div>
                <div class="text-body-2 text-medium-emphasis">{{ action.description }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-5" rounded="xl" elevation="2">
          <div class="text-subtitle-1 font-weight-semibold mb-3">Points clés</div>
          <v-timeline density="compact" side="end" truncate-line="both">
            <v-timeline-item v-for="item in highlights" :key="item.title" dot-color="primary">
              <div class="text-subtitle-2 font-weight-semibold mb-1">{{ item.title }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ item.description }}</div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const quickActions = [
  { label: 'Créer', icon: 'mdi-plus-circle-outline', color: 'primary', description: 'Ajoutez rapidement de nouveaux contenus.' },
  { label: 'Organiser', icon: 'mdi-view-grid-plus', color: 'secondary', description: 'Classez vos ressources par catégories.' },
  { label: 'Collaborer', icon: 'mdi-account-group-outline', color: 'tertiary', description: 'Partagez en toute sécurité avec votre équipe.' },
  { label: 'Suivre', icon: 'mdi-chart-line', color: 'success', description: 'Gardez un œil sur les performances et les accès.' },
]

const highlights = [
  { title: 'Nuxt 4 Ready', description: 'Structure en <script setup> prête pour la nouvelle pile.' },
  { title: 'Vuetify 3', description: 'Composants harmonisés avec la charte graphique actuelle.' },
  { title: 'Accessibilité', description: 'Couleurs contrastées et hiérarchie claire pour tous.' },
]
</script>

<style scoped>
.education-modern-shell {
  background: radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.08), transparent 35%),
    radial-gradient(circle at 80% 0%, rgba(34, 197, 94, 0.08), transparent 30%),
    var(--v-theme-surface);
}

.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.86));
  border: 1px solid rgba(99, 102, 241, 0.08);
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
}
</style>
