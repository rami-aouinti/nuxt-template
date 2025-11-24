<script setup lang="ts">
import { computed, ref } from 'vue'
import { NuxtLink } from '#components'
import AppNavigationList from '~/components/AppNavigationList.vue'
import {
  type EducationNavItem,
  useEducationNavigation,
} from '~/composables/useEducationNavigation'

const { t } = useI18n()
const { navLinks, platformRoutes } = useEducationNavigation()

const expandedGroups = ref<string[]>([
  'reporting',
  'social',
  'session-admin',
  'administration',
])

const navigationItems = computed<EducationNavItem[]>(() => navLinks.value)

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
        <div class="education-nav">
          <div class="animated-badge mb-4">
            <span class="animated-badge__pulse" />
            {{ t('pages.education.navigation.title') }}
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('pages.education.navigation.description') }}
          </p>

          <v-list
            v-model:opened="expandedGroups"
            class="education-nav__list"
            color="primary"
            density="comfortable"
            nav
          >
            <template v-for="item in navigationItems" :key="item.value ?? item.to ?? item.label">
              <v-list-item
                v-if="!item.children"
                :prepend-icon="item.icon"
                :title="item.label"
                :to="item.to"
                rounded
                class="education-nav__item"
              />

              <v-list-group
                v-else
                :value="item.value ?? item.label"
                class="education-nav__group"
              >
                <template #activator="{ props, isOpen }">
                  <v-list-item
                    v-bind="props"
                    :prepend-icon="item.icon"
                    :title="item.label"
                    :class="['education-nav__item', { 'education-nav__item--open': isOpen }]"
                    rounded
                  />
                </template>

                <v-list-item
                  v-for="child in item.children"
                  :key="child.to ?? child.label"
                  :prepend-icon="child.icon"
                  :title="child.label"
                  :to="child.to"
                  class="education-nav__child"
                  rounded
                />
              </v-list-group>
            </template>
          </v-list>
        </div>
      </teleport>
    </client-only>

    <client-only>
      <teleport to="#app-drawer-right">
        <AppNavigationList
          :items="quickAccessItems"
        >
          <template #title>
            <span class="animated-badge__pulse" />
            {{ t('pages.education.navigation.quickAccess.title') }}
          </template>
          <template #description>
            {{ t('pages.education.navigation.quickAccess.description') }}
          </template>
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

<style scoped>
.education-nav {
  padding: 8px 12px;
}

.education-nav__list {
  background-color: #f6f8fb;
  border-radius: 8px;
  padding: 4px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.education-nav__item {
  margin: 2px 4px;
  min-height: 44px;
  font-weight: 600;
  color: #6b7280;
}

.education-nav__item--open {
  color: #0f172a;
}

.education-nav__child {
  margin: 1px 8px 1px 16px;
  min-height: 40px;
  font-weight: 500;
  color: #6b7280;
}

.education-nav :deep(.v-list-group__items) {
  padding-left: 8px;
}

.education-nav :deep(.v-list-item--active) {
  background-color: rgba(30, 136, 229, 0.12);
  color: #0f172a;
}

@media (min-width: 960px) {
  .education-nav {
    padding: 12px 16px;
  }
}
</style>
