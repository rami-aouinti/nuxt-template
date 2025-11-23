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
            <v-card-title class="text-h5 font-weight-bold">Glossaire & définitions</v-card-title>
            <v-card-subtitle class="text-body-1">
              Synchronisation directe avec <code>/api/glossaries</code> sur
              <strong>education.bro-world.org</strong> pour exposer les termes dans Nuxt 4.
            </v-card-subtitle>
          </v-card-item>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="elevated"
              :to="legacyGlossaryPath"
            >
              Ouvrir les vues legacy
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              prepend-icon="mdi-refresh"
              @click="refreshGlossary"
            >
              Recharger les termes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <v-alert
          v-if="glossaryError"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ glossaryError }}
        </v-alert>

        <v-skeleton-loader
          v-else-if="isLoadingGlossary"
          type="article, list-item-three, actions"
        />

        <div v-else class="d-flex flex-column gap-4">
          <v-card
            v-for="term in glossaryTerms"
            :key="term['@id'] ?? term.id ?? term.name"
            variant="outlined"
          >
            <v-card-item>
              <div class="d-flex align-start justify-space-between">
                <div>
                  <div class="text-caption text-medium-emphasis">{{ term.category || 'Terme' }}</div>
                  <v-card-title class="text-h6 font-weight-bold">{{ term.name || 'Entrée du glossaire' }}</v-card-title>
                  <v-card-subtitle class="text-body-2 text-medium-emphasis">
                    {{ term.definition || term.description || 'Définition fournie par l’API glossaires.' }}
                  </v-card-subtitle>
                </div>

                <v-chip
                  v-if="term.language"
                  color="primary"
                  label
                  size="small"
                  variant="tonal"
                >
                  {{ term.language.toUpperCase() }}
                </v-chip>
              </div>
            </v-card-item>

            <v-divider />

            <v-card-text class="d-flex flex-wrap gap-3 align-center">
              <v-chip
                v-if="term.keyword"
                label
                size="small"
                variant="outlined"
              >
                {{ term.keyword }}
              </v-chip>
              <v-chip
                v-if="term['@id']"
                label
                size="small"
                variant="outlined"
              >
                {{ term['@id'] }}
              </v-chip>
            </v-card-text>
          </v-card>

          <v-alert
            v-if="!glossaryTerms.length"
            type="info"
            variant="tonal"
          >
            Aucun terme n’a été retourné par l’API.
          </v-alert>
        </div>
      </v-col>

      <v-col cols="12" lg="4" class="d-flex flex-column gap-4">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold">Statistiques</v-card-title>
          </v-card-item>
          <v-divider />
          <v-card-text>
            <v-list density="compact">
              <v-list-item :title="`${glossaryTerms.length}`" subtitle="Entrées de glossaire" />
              <v-list-item :title="languageCount" subtitle="Langues détectées" />
              <v-list-item :title="categoryCount" subtitle="Catégories repérées" />
            </v-list>
          </v-card-text>
        </v-card>

        <v-alert type="info" variant="tonal">
          Les termes sont récupérés via <strong>{{ apiBase }}</strong> et prêts à être consommés par des
          modules Nuxt/Vuetify.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { extractHydraMembers } from '~/utils/education/hydra'
import { legacyViewSlugToPath } from '~/utils/education/legacyRoutes'

type GlossaryTerm = {
  '@id'?: string
  id?: string | number
  name?: string
  definition?: string
  description?: string
  language?: string
  category?: string
  keyword?: string
}

type GlossaryCollection = {
  hydraMember?: GlossaryTerm[]
  hydraTotalItems?: number
}

const educationApi = useEducationApi()
const apiBase = computed(() => educationApi.baseUrl.value)
const legacyGlossaryPath = legacyViewSlugToPath('glossary')

const {
  data: glossaryResponse,
  pending: isLoadingGlossary,
  error: glossaryFetchError,
  refresh: refreshGlossary,
} = useAsyncData('education-glossary', () => educationApi.glossaries.list<GlossaryCollection>())

const glossaryTerms = computed(() => extractHydraMembers<GlossaryTerm>(glossaryResponse.value))

const glossaryError = computed(() => glossaryFetchError.value?.message ?? '')

const languageCount = computed(() => new Set(glossaryTerms.value.map((term) => term.language).filter(Boolean)).size)

const categoryCount = computed(() => new Set(glossaryTerms.value.map((term) => term.category).filter(Boolean)).size)

useHead({
  title: 'Glossaire | Education',
  meta: [
    {
      name: 'description',
      content: 'Consommation des termes du glossaire education.bro-world.org dans une page Nuxt 4 / Vuetify 3.',
    },
  ],
})
</script>
