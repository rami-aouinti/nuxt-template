<script setup lang="ts">
import { computed } from 'vue'
import AppNavigationList from '~/components/AppNavigationList.vue'
import { useEducationNavigation } from '~/composables/useEducationNavigation'

const { t } = useI18n()
const { navLinks, platformRoutes } = useEducationNavigation()

const quickAccessItems = computed(() =>
  platformRoutes.value.map((route) => ({
    ...route,
    external: route.external ?? false,
  })),
)
</script>

<template>
  <div class="education-shell">
    <client-only>
      <teleport to="#app-drawer">
        <AppNavigationList
          :items="navLinks"
          :title="t('pages.education.navigation.title')"
          :description="t('pages.education.navigation.description')"
        >
          <template #item="{ item }">
            <component
              :is="item.external ? 'a' : NuxtLink"
              class="nav-pill text-decoration-none"
              :href="item.external ? item.to : undefined"
              :to="item.external ? undefined : item.to"
              style="color: inherit"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noopener noreferrer' : undefined"
            >
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center gap-3">
                  <v-icon v-if="item.icon" :icon="item.icon" size="22" />
                  <span class="text-subtitle-2 font-weight-medium">
                    {{ item.label }}
                  </span>
                </div>
                <v-chip v-if="item.external" color="primary" size="x-small" variant="tonal">
                  {{ t('pages.education.hero.badge') }}
                </v-chip>
              </div>
            </component>
          </template>
        </AppNavigationList>
      </teleport>
    </client-only>

    <client-only>
      <teleport to="#app-drawer-right">
        <AppNavigationList
          :items="quickAccessItems"
          :title="t('pages.education.navigation.quickAccess.title')"
          :description="t('pages.education.navigation.quickAccess.description')"
        >
          <template #item="{ item }">
            <component
              :is="item.external ? 'a' : NuxtLink"
              class="nav-pill text-decoration-none"
              :href="item.external ? item.to : undefined"
              :to="item.external ? undefined : item.to"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noopener noreferrer' : undefined"
              style="color: inherit"
            >
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center gap-3">
                  <v-icon v-if="item.icon" :icon="item.icon" size="22" />
                  <span class="text-subtitle-2 font-weight-medium">
                    {{ item.label }}
                  </span>
                </div>
                <v-chip color="primary" size="x-small" variant="tonal">
                  {{ t('pages.education.hero.badge') }}
                </v-chip>
              </div>
            </component>
          </template>
        </AppNavigationList>
      </teleport>
    </client-only>

    <slot />
  </div>
</template>
