<script setup lang="ts">
import { computed } from 'vue'
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
const route = useRoute()
const localePath = useLocalePath()
const { navLinks } = useEducationNavigation()
const { categories, findCategory } = useEducationAdministrationData()

const activeCategory = computed(() => findCategory(route.params.category as string))
const otherCategories = computed(() =>
  categories.value.filter((category) => category.key !== route.params.category),
)

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

    <v-row class="gy-6" justify="center">
      <v-col cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="animated-badge mb-4">
            <span class="animated-badge__pulse" />
            {{ t('pages.education.administration.badge') }}
          </div>
          <div class="d-flex align-center justify-space-between gap-4 flex-wrap">
            <div>
              <h1 class="text-h5 font-weight-bold mb-1">
                {{ activeCategory?.title || 'Administration area' }}
              </h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{
                  activeCategory?.description ||
                    'Choisissez une catégorie valide pour afficher les endpoints correspondants.'
                }}
              </p>
            </div>
            <v-btn
              variant="tonal"
              color="primary"
              prepend-icon="mdi-view-dashboard-outline"
              :to="localePath('education-administration')"
            >
              {{ t('pages.education.actions.backToOverview') }}
            </v-btn>
          </div>
        </AppCard>
      </v-col>

      <v-col v-if="activeCategory" cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center gap-3">
              <v-avatar color="surface-variant" size="44">
                <v-icon :icon="activeCategory.icon" :color="activeCategory.color || 'primary'" />
              </v-avatar>
              <div>
                <h2 class="text-subtitle-1 font-weight-semibold mb-1">
                  {{ activeCategory.title }}
                </h2>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ activeCategory.description }}
                </p>
              </div>
            </div>
            <v-chip :color="activeCategory.color || 'primary'" variant="tonal" size="small" label>
              {{ activeCategory.items.length }} endpoints
            </v-chip>
          </div>

          <v-list density="comfortable" lines="two">
            <v-list-item
              v-for="item in activeCategory.items"
              :key="item.label"
              :title="item.label"
              :subtitle="item.description"
              :href="item.href"
              target="_blank"
              rel="noreferrer"
            >
              <template #prepend>
                <v-avatar color="transparent" size="32">
                  <v-icon :icon="item.icon || 'mdi-open-in-new'" :color="activeCategory.color || 'primary'" />
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

      <v-col v-else cols="12" md="8">
        <AppCard class="pa-6" elevation="2">
          <div class="text-center">
            <v-icon icon="mdi-alert" color="warning" size="48" class="mb-3" />
            <h3 class="text-h6 font-weight-semibold mb-2">{{ t('common.notFound') }}</h3>
            <p class="text-body-2 text-medium-emphasis">
              Aucun domaine ne correspond à cette catégorie. Revenez au tableau pour choisir une carte valide.
            </p>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-view-dashboard-outline"
              :to="localePath('education-administration')"
            >
              {{ t('pages.education.actions.backToOverview') }}
            </v-btn>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" md="4">
        <AppCard class="pa-5" elevation="2">
          <h3 class="text-subtitle-1 font-weight-semibold mb-3">Autres domaines</h3>
          <p class="text-body-2 text-medium-emphasis mb-3">
            Accédez rapidement aux autres cartes d'administration et à leurs endpoints dédiés.
          </p>
          <v-list density="compact">
          <v-list-item
            v-for="category in otherCategories"
            :key="category.key"
            :title="category.title"
            :subtitle="category.description"
            :to="localePath({ name: `education-administration-${category.key}` })"
            :prepend-icon="category.icon"
          >
              <template #append>
                <v-chip color="primary" variant="tonal" size="x-small" label>
                  {{ category.items.length }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
