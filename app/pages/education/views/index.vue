<template>
  <v-container class="py-8 py-sm-12" fluid>
    <v-row>
      <v-col cols="12" md="10" lg="8">
        <v-card
          class="mb-8"
          color="primary"
          variant="tonal"
        >
          <v-card-item>
            <v-card-title class="text-h5 font-weight-bold">Catalogue des vues legacy</v-card-title>
            <v-card-subtitle class="text-body-1">
              Toutes les pages de <code>education/views</code> sont disponibles ici pour être consommées dans Nuxt 4 avec Vuetify 3.
            </v-card-subtitle>
          </v-card-item>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="elevated"
              :to="'/education'"
            >
              Retour aux modules
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <LegacyViewList
          :views="legacyViewsIndex"
          title="Vues disponibles"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import LegacyViewList from '~/components/education/LegacyViewList.vue'
import { legacyViewsIndex } from '~/utils/education/legacyViews'

useHead({
  title: 'Vues legacy education',
  meta: [
    {
      name: 'description',
      content: 'Index de toutes les vues du dossier education/views rendues dans Nuxt 4 et Vuetify 3.',
    },
  ],
})
</script>
