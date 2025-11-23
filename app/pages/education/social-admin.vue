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
            <v-card-title class="text-h5 font-weight-bold">Social & administration</v-card-title>
            <v-card-subtitle class="text-body-1">
              Agrégation des flux <code>/api/social_posts</code> et de la configuration admin
              (<code>third_parties</code>) exposés par <strong>education.bro-world.org</strong>.
            </v-card-subtitle>
          </v-card-item>
          <v-card-actions class="d-flex flex-wrap gap-2">
            <v-btn
              color="primary"
              variant="elevated"
              :to="legacySocialPath"
            >
              Fil d’actualité legacy
            </v-btn>
            <v-btn
              color="primary"
              variant="tonal"
              :to="legacyAdminPath"
            >
              Gestion admin legacy
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              variant="text"
              prepend-icon="mdi-refresh"
              @click="refreshAll"
            >
              Recharger
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="7" class="d-flex flex-column gap-4">
        <v-alert
          v-if="socialPostsError"
          type="error"
          variant="tonal"
        >
          {{ socialPostsError }}
        </v-alert>

        <v-skeleton-loader
          v-else-if="isLoadingSocialPosts"
          type="article, list-item-three, actions"
        />

        <div v-else class="d-flex flex-column gap-3">
          <v-card
            v-for="post in socialPosts"
            :key="post['@id'] ?? post.id ?? post.title"
            variant="outlined"
          >
            <v-card-item>
              <div class="d-flex align-start justify-space-between">
                <div class="pe-4">
                  <div class="text-caption text-medium-emphasis">{{ post.status || 'Publication' }}</div>
                  <v-card-title class="text-h6 font-weight-bold">{{ post.title || 'Social post' }}</v-card-title>
                  <v-card-subtitle class="text-body-2 text-medium-emphasis">
                    {{ post.content || post.message || 'Contenu retourné par /api/social_posts.' }}
                  </v-card-subtitle>
                </div>

                <div class="d-flex flex-column gap-2 align-end">
                  <v-chip
                    v-if="post.visibility"
                    color="primary"
                    label
                    size="small"
                    variant="tonal"
                  >
                    {{ post.visibility }}
                  </v-chip>
                  <v-chip
                    v-if="post.createdAt"
                    label
                    size="small"
                    variant="outlined"
                  >
                    {{ formatDate(post.createdAt) }}
                  </v-chip>
                </div>
              </div>
            </v-card-item>

            <v-divider />

            <v-card-text class="d-flex flex-wrap gap-2 align-center">
              <v-chip
                v-if="post.author?.username || post.author?.name"
                label
                size="small"
                variant="outlined"
              >
                Auteur : {{ post.author?.username || post.author?.name }}
              </v-chip>
              <v-chip
                v-if="typeof post.likes === 'number'"
                color="primary"
                label
                size="small"
                variant="tonal"
              >
                {{ post.likes }} mention(s) j’aime
              </v-chip>
              <v-chip
                v-if="post['@id']"
                label
                size="small"
                variant="outlined"
              >
                {{ post['@id'] }}
              </v-chip>
            </v-card-text>
          </v-card>

          <v-alert
            v-if="!socialPosts.length"
            type="info"
            variant="tonal"
          >
            Aucun post social récupéré depuis l’API.
          </v-alert>
        </div>
      </v-col>

      <v-col cols="12" lg="5" class="d-flex flex-column gap-4">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold">Tiers & intégrations</v-card-title>
          </v-card-item>
          <v-divider />
          <v-card-text>
            <v-alert
              v-if="thirdPartiesError"
              type="error"
              variant="tonal"
              class="mb-3"
            >
              {{ thirdPartiesError }}
            </v-alert>

            <v-skeleton-loader
              v-else-if="isLoadingThirdParties"
              type="card, list-item-two"
            />

            <div v-else class="d-flex flex-column gap-3">
              <v-list density="compact">
                <v-list-item
                  v-for="thirdParty in thirdParties"
                  :key="thirdParty['@id'] ?? thirdParty.id ?? thirdParty.name"
                  :title="thirdParty.name || thirdParty.provider || 'Fournisseur'"
                  :subtitle="thirdParty.description || thirdParty['@id']"
                >
                  <template #append>
                    <v-chip
                      v-if="thirdParty.status"
                      color="primary"
                      label
                      size="x-small"
                      variant="tonal"
                    >
                      {{ thirdParty.status }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>

              <v-alert
                v-if="!thirdParties.length"
                type="info"
                variant="tonal"
              >
                Aucun tiers déclaré dans l’API.
              </v-alert>
            </div>
          </v-card-text>
        </v-card>

        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold">Indicateurs</v-card-title>
          </v-card-item>
          <v-divider />
          <v-card-text>
            <v-list density="compact">
              <v-list-item :title="socialPosts.length" subtitle="Posts sociaux" />
              <v-list-item :title="publishedCount" subtitle="Posts publiés" />
              <v-list-item :title="thirdParties.length" subtitle="Tiers configurés" />
            </v-list>
          </v-card-text>
        </v-card>

        <v-alert type="info" variant="tonal">
          Toutes les données sont servies depuis <strong>{{ apiBase }}</strong> et restent alignées avec les vues
          legacy via les liens ci-dessus.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { extractHydraMembers } from '~/utils/education/hydra'
import { legacyViewSlugToPath } from '~/utils/education/legacyRoutes'

type SocialAuthor = {
  username?: string
  name?: string
}

type SocialPost = {
  '@id'?: string
  id?: string | number
  title?: string
  content?: string
  message?: string
  visibility?: string
  createdAt?: string
  likes?: number
  status?: string
  author?: SocialAuthor
}

type ThirdParty = {
  '@id'?: string
  id?: string | number
  name?: string
  provider?: string
  description?: string
  status?: string
}

type HydraCollection<T> = {
  hydraMember?: T[]
  hydraTotalItems?: number
}

const educationApi = useEducationApi()
const apiBase = computed(() => educationApi.baseUrl.value)
const legacySocialPath = legacyViewSlugToPath('social/List')
const legacyAdminPath = legacyViewSlugToPath('admin/UserList')

const {
  data: socialPostsResponse,
  pending: isLoadingSocialPosts,
  error: socialPostsFetchError,
  refresh: refreshSocialPosts,
} = useAsyncData('education-social-posts', () =>
  educationApi.socialPosts.list<HydraCollection<SocialPost>>(),
)

const {
  data: thirdPartiesResponse,
  pending: isLoadingThirdParties,
  error: thirdPartiesFetchError,
  refresh: refreshThirdParties,
} = useAsyncData('education-third-parties', () =>
  educationApi.thirdParties.list<HydraCollection<ThirdParty>>(),
)

const socialPosts = computed(() => extractHydraMembers<SocialPost>(socialPostsResponse.value))
const thirdParties = computed(() => extractHydraMembers<ThirdParty>(thirdPartiesResponse.value))

const socialPostsError = computed(() => socialPostsFetchError.value?.message ?? '')
const thirdPartiesError = computed(() => thirdPartiesFetchError.value?.message ?? '')

const publishedCount = computed(() =>
  socialPosts.value.filter((post) => (post.status || '').toLowerCase() === 'published').length,
)

function formatDate(value?: string) {
  if (!value) return ''

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

function refreshAll() {
  refreshSocialPosts()
  refreshThirdParties()
}

useHead({
  title: 'Social & admin | Education',
  meta: [
    {
      name: 'description',
      content:
        'Vue Nuxt/Vuetify regroupant les posts sociaux et les intégrations tierces depuis education.bro-world.org.',
    },
  ],
})
</script>
