<template>
  <v-container class="py-8 py-sm-12" fluid>
    <v-row>
      <v-col cols="12" md="10" lg="8">
        <EducationHero
          title="Suite éducation migrée"
          subtitle="Toutes les vues du dossier legacy sont ré-agrégées en modules clairs, prêts à être branchés sur Nuxt 4 et Vuetify 3."
          @cta-click="scrollToModules"
        />
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold">
              Catalogue complet des vues
            </v-card-title>
            <v-card-subtitle class="text-body-2 text-medium-emphasis">
              Toutes les pages de <code>education/views</code> sont désormais routées sous <code>/education</code>.
            </v-card-subtitle>
          </v-card-item>
          <v-card-actions>
            <v-btn
              color="primary"
              :to="'/education/legacy'"
              variant="tonal"
            >
              Ouvrir le catalogue complet
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row ref="modulesSection" class="mt-10">
      <v-col cols="12" class="d-flex flex-column gap-12">
        <EducationModuleGrid
          v-for="section in educationSections"
          :key="section.key"
          :section="section"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import EducationHero from '~/components/education/EducationHero.vue'
import EducationModuleGrid from '~/components/education/EducationModuleGrid.vue'
import { educationSections } from '~/utils/education/modules'

const modulesSection = ref<HTMLElement | null>(null)

useHead({
  title: 'Education',
  meta: [
    {
      name: 'description',
      content:
        'Réorganisation des vues education (Vuetify 3, Nuxt 4) en modules prêts à être reliés aux API.',
    },
  ],
})

function scrollToModules() {
  if (modulesSection.value) {
    modulesSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
