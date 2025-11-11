<script setup lang="ts">
import AppAvatar from '~/components/AppAvatar.vue'
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
  >
    <template #default>
      <div class="d-flex flex-column gap-3 mb-4">
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
      </div>

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
        <div
          v-for="workplace in filteredWorkplaces"
          :key="workplace.id || workplace.slug"
          class="stat-card d-flex align-center gap-3 mb-3 w-100 px-3"
        >
          <NuxtLink
            style="color: rgba(var(--v-theme-on-surface), 0.92)"
            class="d-flex align-center gap-3 flex-grow-1 text-decoration-none"
            :to="`/world/${encodeURIComponent(workplace.slug)}`"
          >
            <AppAvatar
              :alt="workplace.name || workplace.slug"
              size="36"
              class="mr-3"
              color="primary"
              variant="tonal"
            >
              <template #fallback>
                <span class="blog-avatar__initials">
                  {{ getInitials(workplace.name || workplace.slug) }}
                </span>
              </template>
            </AppAvatar>
            <span class="text-body-1 font-weight-medium text-truncate">
              {{ workplace.name || workplace.slug }}
            </span>
          </NuxtLink>
          <v-spacer />
          <WorkplaceActionMenu
            :workplace="workplace"
            @refresh="emit('refresh')"
            @deleted="emit('refresh')"
          />
        </div>
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
  </SidebarSection>
</template>
