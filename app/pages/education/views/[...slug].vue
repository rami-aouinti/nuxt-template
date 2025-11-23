<template>
  <v-container class="py-8 py-sm-12" fluid>
    <v-breadcrumbs
      :items="breadcrumbs"
      class="px-0 mb-6"
    />

    <v-row>
      <v-col cols="12" lg="8">
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ errorMessage }}
        </v-alert>

        <v-skeleton-loader
          v-else-if="isLoading"
          type="article, actions"
        />

        <div v-else-if="resolvedView">
          <component :is="resolvedView.component" />
        </div>

        <v-alert
          v-else
          type="info"
          variant="tonal"
        >
          Choisissez une vue dans la liste pour la charger dans Nuxt.
        </v-alert>
      </v-col>

      <v-col cols="12" lg="4">
        <LegacyViewList
          :views="legacyViewsIndex"
          title="Vues education"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import LegacyViewList from '~/components/education/LegacyViewList.vue'
import { legacyViewsIndex, resolveLegacyView } from '~/utils/education/legacyViews'

const route = useRoute()
const router = useRouter()

const resolvedView = shallowRef<Awaited<ReturnType<typeof resolveLegacyView>> | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

const slugParam = computed(() => route.params.slug)
const slug = computed(() =>
  Array.isArray(slugParam.value) ? slugParam.value.join('/') : slugParam.value,
)

const breadcrumbs = computed(() => [
  { title: 'Education', to: '/education' },
  { title: 'Vues legacy', to: '/education/views' },
  resolvedView.value?.entry && { title: resolvedView.value.entry.slug, disabled: true },
].filter(Boolean))

watchEffect(() => {
  if (!slug.value) {
    resolvedView.value = null
    errorMessage.value = ''
    isLoading.value = false
    return
  }

  const normalized = String(slug.value)
  const knownSlugs = legacyViewsIndex.map((entry) => entry.slug.toLowerCase())

  if (!knownSlugs.includes(normalized.toLowerCase())) {
    resolvedView.value = null
    errorMessage.value = `Aucune vue trouvée pour "${slug.value}"`
    isLoading.value = false
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  resolveLegacyView(normalized)
    .then((result) => {
      if (result) {
        resolvedView.value = result
      } else {
        resolvedView.value = null
        errorMessage.value = `Aucune vue trouvée pour "${slug.value}"`
      }
    })
    .catch((error) => {
      console.error('Erreur lors du chargement de la vue education', error)
      resolvedView.value = null
      errorMessage.value = 'Impossible de charger cette vue pour le moment.'
    })
    .finally(() => {
      isLoading.value = false
    })
})

onBeforeRouteUpdate((to) => {
  if (Array.isArray(to.params.slug)) {
    return
  }

  if (!to.params.slug && legacyViewsIndex.length > 0) {
    router.replace(`/education/views/${legacyViewsIndex[0].slug}`)
  }
})

useHead(() => ({
  title: resolvedView.value?.entry?.name
    ? `${resolvedView.value.entry.name} | Education`
    : 'Vues legacy education',
}))
</script>
