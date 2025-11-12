<script setup lang="ts">
import SidebarSection from './SidebarSection.vue'
import type { BlogSummary } from '~/types/blog'

defineProps<{
  title: string
  description: string
  loginMessage: string
  loggedIn: boolean
  loading: boolean
  error: string | null
  blogs: BlogSummary[]
  filteredBlogs: BlogSummary[]
  hasSearchTerm: boolean
  noResultsMessage: string
  emptyMessage: string
  createLabel: string
  editLabel: string
  deleteLabel: string
  getInitials: (title: string | null | undefined) => string
  isMenuDisabled: (blogId: string) => boolean
  isDeleting: (blogId: string) => boolean
}>()

const emit = defineEmits<{
  (event: 'create'): void
  (event: 'edit' | 'delete', blog: BlogSummary): void
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
          prepend-icon="mdi-note-plus"
          :disabled="!loggedIn"
          @click="emit('create')"
        >
          {{ createLabel }}
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
      <template v-else-if="filteredBlogs.length">
        <AppListingCard v-for="blog in filteredBlogs" :key="blog.id">
          <NuxtLink
            style="color: rgba(var(--v-theme-on-surface), 0.92)"
            class="d-flex align-center gap-3 flex-grow-1 text-decoration-none"
            :to="`/blog/${blog.id}`"
          >
            <AppAvatar
              :src="blog.logo || undefined"
              :alt="blog.title"
              size="36"
              class="mr-3"
              color="primary"
              variant="tonal"
            >
              <template #fallback>
                <span class="blog-avatar__initials">
                  {{ getInitials(blog.title) }}
                </span>
              </template>
            </AppAvatar>
            {{ blog.title }}
          </NuxtLink>
          <v-spacer />
          <v-menu location="bottom end" offset="8">
            <template #activator="{ props: activatorProps }">
              <v-btn
                icon
                variant="text"
                size="small"
                density="compact"
                class="blog-sidebar__menu-btn"
                v-bind="activatorProps"
                :disabled="activatorProps.disabled || isMenuDisabled(blog.id)"
                :loading="isDeleting(blog.id)"
                @click.stop="activatorProps.onClick?.($event)"
              >
                <v-icon size="small" icon="mdi-dots-vertical" />
              </v-btn>
            </template>
            <v-list density="compact" nav>
              <v-list-item
                :disabled="isMenuDisabled(blog.id)"
                @click.stop="emit('edit', blog)"
              >
                <template #prepend>
                  <v-icon size="small" icon="mdi-pencil" />
                </template>
                <v-list-item-title>
                  {{ editLabel }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                :disabled="isMenuDisabled(blog.id)"
                @click.stop="emit('delete', blog)"
              >
                <template #prepend>
                  <v-icon
                    v-if="!isDeleting(blog.id)"
                    size="small"
                    icon="mdi-trash-can-outline"
                  />
                  <v-progress-circular
                    v-else
                    indeterminate
                    size="16"
                    width="2"
                  />
                </template>
                <v-list-item-title>
                  {{ deleteLabel }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </AppListingCard>
      </template>
      <v-alert
        v-else-if="hasSearchTerm && blogs.length"
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
