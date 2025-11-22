<script setup lang="ts">
import { computed, ref } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'
import {
  type AdminListItem,
  useEducationAdministrationData,
} from '~/composables/useEducationAdministrationData'

definePageMeta({
  layout: 'default',
  title: 'navigation.educationAdministration',
  icon: 'mdi-shield-crown-outline',
  drawerIndex: 3,
})

const { t } = useI18n()
const { navLinks } = useEducationNavigation()
const { categories } = useEducationAdministrationData()

const searchTerm = ref('')

const filteredCategories = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  if (!term) return categories.value

  return categories.value
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.label.toLowerCase().includes(term)),
    }))
    .filter((category) => category.items.length > 0)
})

const drawerHighlights = computed(() => [
  {
    icon: 'mdi-view-dashboard-outline',
    label: '9 administration domains',
  },
  {
    icon: 'mdi-link-variant-plus',
    label: '50+ shortcuts to platform endpoints',
  },
  {
    icon: 'mdi-animation-outline',
    label: 'Animated badges and drawer guidance included',
  },
])

const typeLabel = (itemType?: AdminListItem['type']) => {
  if (itemType === 'form') return 'Form'
  if (itemType === 'api') return 'API'
  return 'Page'
}
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer">
        <AppNavigationList
          :items="navLinks"
          :title="t('pages.education.navigation.title')"
          :description="t('pages.education.navigation.description')"
        />
      </teleport>
    </client-only>

    <client-only>
      <teleport to="#app-drawer-right">
        <AppCard class="pa-4" elevation="1">
          <div class="animated-badge mb-3">
            <span class="animated-badge__pulse" />
            {{ t('pages.education.administration.badge') }}
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Quick overview of the administration workspace. All links open in a new
            tab so you can keep this guide nearby.
          </p>
          <v-list density="compact">
            <v-list-item
              v-for="highlight in drawerHighlights"
              :key="highlight.label"
              :title="highlight.label"
              :prepend-icon="highlight.icon"
            />
          </v-list>
        </AppCard>
      </teleport>
    </client-only>

    <v-row class="gy-6" justify="center">
      <v-col cols="12">
        <AppCard class="pa-6" elevation="2">
          <div class="animated-badge mb-4">
            <span class="animated-badge__pulse" />
            {{ t('pages.education.administration.badge') }}
          </div>
          <div class="d-flex flex-wrap align-center justify-space-between gap-4">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">
                {{ t('pages.education.administration.title') }}
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-0">
                {{ t('pages.education.administration.subtitle') }}
              </p>
            </div>
            <v-text-field
              v-model="searchTerm"
              style="max-width: 320px"
              density="comfortable"
              color="primary"
              variant="outlined"
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              label="Keyword"
              placeholder="Search cards or endpoints"
            />
          </div>
        </AppCard>
      </v-col>

      <template v-if="filteredCategories.length">
        <v-col
          v-for="category in filteredCategories"
          :key="category.key"
          cols="12"
          md="6"
          lg="4"
        >
          <AppCard class="pa-5 h-100" elevation="2">
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="d-flex align-center gap-3">
                <v-avatar color="surface-variant" size="44">
                  <v-icon :icon="category.icon" :color="category.color || 'primary'" />
                </v-avatar>
                <div>
                  <h3 class="text-subtitle-1 font-weight-semibold mb-1">
                    {{ category.title }}
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ category.description }}
                  </p>
                </div>
              </div>
              <div class="d-flex align-center gap-2">
                <v-chip :color="category.color || 'primary'" variant="tonal" size="small" label>
                  {{ category.items.length }} links
                </v-chip>
                <v-btn
                  size="small"
                  variant="text"
                  color="primary"
                  :to="{ name: 'education-administration-category', params: { category: category.key } }"
                  prepend-icon="mdi-eye-arrow-right"
                >
                  Voir la page
                </v-btn>
              </div>
            </div>

            <v-list density="comfortable" lines="one">
              <v-list-item
                v-for="item in category.items"
                :key="item.label"
                :title="item.label"
                :href="item.href"
                target="_blank"
                rel="noreferrer"
              >
                <template #prepend>
                  <v-avatar color="transparent" size="32">
                    <v-icon :icon="item.icon || 'mdi-open-in-new'" :color="category.color || 'primary'" />
                  </v-avatar>
                </template>
                <template #append>
                  <v-chip
                    color="primary"
                    variant="tonal"
                    size="x-small"
                    class="text-uppercase font-weight-medium"
                    label
                  >
                    {{ typeLabel(item.type) }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </AppCard>
        </v-col>
      </template>

      <v-col v-else cols="12">
        <AppCard class="pa-6" elevation="2">
          <div class="text-center">
            <v-icon icon="mdi-magnify-close" size="48" class="mb-3" color="primary" />
            <h3 class="text-h6 font-weight-semibold mb-2">No matching items</h3>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Adjust your keywords or clear the search to see all administration cards.
            </p>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
