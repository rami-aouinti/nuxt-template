<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  type EducationNavItem,
  useEducationNavigation,
} from '~/composables/useEducationNavigation'

const { t } = useI18n()
const { navLinks } = useEducationNavigation()

const expandedGroups = ref<string[]>([
  'reporting',
  'social',
  'session-admin',
  'administration',
])

const navigationItems = computed<EducationNavItem[]>(() => navLinks.value)
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

          <v-list
            v-model:opened="expandedGroups"
            class="education-nav__list my-auto"
            color="primary"
            density="compact"
            nav
          >
            <template
              v-for="item in navigationItems"
              :key="item.value ?? item.to ?? item.label"
            >
              <v-list-item
                v-if="!item.children"
                :prepend-icon="item.icon"
                :title="item.label"
                :to="item.to"
                rounded
                class="education-nav__item animated-badge"
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
                    class="animated-badge"
                    :title="item.label"
                    :class="[
                      'education-nav__item',
                      { 'education-nav__item--open': isOpen },
                    ]"
                    rounded
                  />
                </template>

                <v-list-item
                  v-for="child in item.children"
                  :key="child.to ?? child.label"
                  :prepend-icon="child.icon"
                  :title="child.label"
                  :to="child.to"
                  class="education-nav__child animated-badge"
                  rounded
                />
              </v-list-group>
            </template>
          </v-list>
        </div>
      </teleport>
    </client-only>
    <slot />
  </div>
</template>

<style scoped>
.education-nav {
  padding: 4px 4px;
}

.education-nav__list {
  background-color: transparent;
  padding: 2px;
}

.education-nav__item {
  margin: 8px 2px;
  min-height: 44px;
  font-weight: 600;
}

.education-nav__item--open {
  color: rgba(var(--v-theme-primary), 0.82);
}

.education-nav__child {
  margin: 1px 4px 1px 4px;
  min-height: 40px;
}

.education-nav :deep(.v-list-group__items) {
  padding-left: 4px;
}

.education-nav :deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.12);
  color: rgba(var(--v-theme-primary), 0.82);
}
</style>
