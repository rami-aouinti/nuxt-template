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
            <v-card-title class="text-h5 font-weight-bold">Portails Access URL</v-card-title>
            <v-card-subtitle class="text-body-1">
              Accès en direct aux données <code>/api/access_urls</code> exposées par
              <strong>education.bro-world.org</strong> et rendues dans Nuxt 4 / Vuetify 3.
            </v-card-subtitle>
          </v-card-item>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="elevated"
              :to="accessUrlLegacyPath"
            >
              Voir les vues legacy
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              prepend-icon="mdi-refresh"
              @click="refreshAccessUrls"
            >
              Recharger les données
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <v-alert
          v-if="accessUrlsError"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ accessUrlsError }}
        </v-alert>

        <v-skeleton-loader
          v-else-if="isLoadingAccessUrls"
          type="article, list-item-three, actions"
        />

        <div v-else class="d-flex flex-column gap-4">
          <v-card
            v-for="item in accessUrlItems"
            :key="item['@id'] ?? item.id ?? item.url"
            variant="outlined"
          >
            <v-card-item>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption text-medium-emphasis">{{ item.code || 'Access URL' }}</div>
                  <v-card-title class="text-h6 font-weight-bold">
                    {{ item.url || item.name || item.title || 'Portail' }}
                  </v-card-title>
                  <v-card-subtitle class="text-body-2 text-medium-emphasis">
                    {{ item.description || 'Portail d’accès configuré depuis l’API.' }}
                  </v-card-subtitle>
                </div>

                <div class="d-flex flex-column gap-2 text-right">
                  <v-chip
                    v-if="item.colorTheme?.name"
                    color="primary"
                    label
                    size="small"
                    variant="tonal"
                  >
                    Thème {{ item.colorTheme.name }}
                  </v-chip>
                  <v-chip
                    v-if="typeof item.isActive === 'boolean'"
                    :color="item.isActive ? 'success' : 'warning'"
                    label
                    size="small"
                    variant="tonal"
                  >
                    {{ item.isActive ? 'Actif' : 'Désactivé' }}
                  </v-chip>
                </div>
              </div>
            </v-card-item>

            <v-divider />

            <v-card-text class="d-flex flex-wrap gap-3 align-center">
              <v-chip
                v-if="item.portalName"
                label
                size="small"
                variant="outlined"
              >
                Portail : {{ item.portalName }}
              </v-chip>
              <v-chip
                v-if="item.language"
                label
                size="small"
                variant="outlined"
              >
                Langue : {{ item.language }}
              </v-chip>
              <v-chip
                v-if="item['@id']"
                label
                size="small"
                variant="outlined"
              >
                {{ item['@id'] }}
              </v-chip>
            </v-card-text>
          </v-card>

          <v-alert
            v-if="!accessUrlItems.length"
            type="info"
            variant="tonal"
          >
            Aucun portail Access URL n’a été retourné par l’API.
          </v-alert>
        </div>
      </v-col>

      <v-col cols="12" lg="4" class="d-flex flex-column gap-4">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold">Indicateurs</v-card-title>
          </v-card-item>
          <v-divider />
          <v-card-text>
            <v-list density="compact">
              <v-list-item :title="`${accessUrlItems.length}`" subtitle="Portails recensés" />
              <v-list-item
                :title="withThemeCount"
                subtitle="Portails avec thème personnalisé"
              />
              <v-list-item
                :title="activeCount"
                subtitle="Portails actifs"
              />
            </v-list>
          </v-card-text>
        </v-card>

        <v-alert
          type="info"
          variant="tonal"
        >
          Les données sont récupérées à chaque chargement depuis
          <strong>{{ apiBase }}</strong>. Configurez <code>public.educationApiBaseUrl</code>
          pour pointer vers un autre environnement si besoin.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { extractHydraMembers } from '~/utils/education/hydra'
import { legacyViewSlugToPath } from '~/utils/education/legacyRoutes'

type AccessUrl = {
  '@id'?: string
  id?: string | number
  url?: string
  name?: string
  title?: string
  code?: string
  description?: string
  isActive?: boolean
  portalName?: string
  colorTheme?: { name?: string }
  language?: string
}

type AccessUrlCollection = {
  hydraMember?: AccessUrl[]
  hydraTotalItems?: number
}

const educationApi = useEducationApi()

const accessUrlLegacyPath = legacyViewSlugToPath('accessurl')
const apiBase = computed(() => educationApi.baseUrl.value)

const {
  data: accessUrlResponse,
  pending: isLoadingAccessUrls,
  error: accessUrlError,
  refresh: refreshAccessUrls,
} = useAsyncData('education-access-urls', () =>
  educationApi.accessUrls.list<AccessUrlCollection>(),
)

const accessUrlItems = computed(() => extractHydraMembers<AccessUrl>(accessUrlResponse.value))

const accessUrlsError = computed(() => accessUrlError.value?.message ?? '')

const withThemeCount = computed(() =>
  accessUrlItems.value.filter((item) => Boolean(item.colorTheme)).length,
)

const activeCount = computed(() =>
  accessUrlItems.value.filter((item) => item.isActive || item.isActive === undefined).length,
)

useHead({
  title: 'Access URL | Education',
  meta: [
    {
      name: 'description',
      content: 'Vue Vuetify 3 consommant les portails Access URL via https://education.bro-world.org/api.',
    },
  ],
})
</script>
