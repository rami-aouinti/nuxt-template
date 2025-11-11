<script setup lang="ts">
import SidebarSection from './SidebarSection.vue'
import WorkplaceActionMenu from '~/components/workplace/WorkplaceActionMenu.vue'
import type { Workplace } from '~/types/workplace'

defineProps<{
  title: string
  description: string
  loginMessage: string
  loggedIn: boolean
  loading: boolean
  error: string | null
  workplaces: Workplace[]
  filteredWorkplaces: Workplace[]
  hasSearchTerm: boolean
  noResultsMessage: string
  emptyMessage: string
  addWorldLabel: string
  getInitials: (name: string | null | undefined) => string
}>()

const emit = defineEmits<{
  (event: 'refresh' | 'add-world'): void
}>()
</script>

<template>
  <SidebarSection
    :title="title"
    :description="description"
    :logged-in="loggedIn"
    :login-message="loginMessage"
    actions-class="mt-6 mb-4"
  >
    <template #default>
      <v-skeleton-loader
        v-if="loading"
        type="list-item-two-line@3"
        class="rounded mb-4"
      />
      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        density="comfortable"
        class="mb-4"
      >
        {{ error }}
      </v-alert>
      <template v-else-if="filteredWorkplaces.length">
        <v-card
          v-for="workplace in filteredWorkplaces"
          :key="workplace.id || workplace.slug"
          class="workplace-card mb-3"
          elevation="2"
        >
          <v-card-text class="d-flex align-center gap-3">
            <NuxtLink
              style="color: rgba(var(--v-theme-on-surface), 0.92)"
              class="workplace-card__link d-flex align-center gap-3 flex-grow-1 text-decoration-none"
              :to="`/world/${encodeURIComponent(workplace.slug)}`"
            >
              <v-avatar size="40" color="primary" variant="tonal">
                <span class="blog-avatar__initials">
                  {{ getInitials(workplace.name || workplace.slug) }}
                </span>
              </v-avatar>
              <div class="d-flex flex-column px-2">
                <span class="text-body-1 font-weight-medium text-truncate">
                  {{ workplace.name || workplace.slug }}
                </span>
              </div>
            </NuxtLink>
            <WorkplaceActionMenu
              :workplace="workplace"
              @refresh="emit('refresh')"
              @deleted="emit('refresh')"
            />
          </v-card-text>
        </v-card>
      </template>
      <v-alert
        v-else-if="hasSearchTerm && workplaces.length"
        type="info"
        variant="tonal"
        density="comfortable"
        class="mb-4"
      >
        {{ noResultsMessage }}
      </v-alert>
      <p v-else class="text-body-2 text-medium-emphasis mb-0">
        {{ emptyMessage }}
      </p>
    </template>

    <template #actions>
      <v-btn
        block
        color="primary"
        variant="tonal"
        prepend-icon="mdi-earth-plus"
        :disabled="!loggedIn"
        @click="emit('add-world')"
      >
        {{ addWorldLabel }}
      </v-btn>
    </template>
  </SidebarSection>
</template>
