<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  icon: 'mdi-home',
  title: 'navigation.blog',
  drawerIndex: 1,
})

const { t, locale } = useI18n()

const BLOG_POSTS_ENDPOINT = 'https://blog.bro-world.org/public/post'

interface BlogPostUser {
  id: string
  firstName?: string | null
  lastName?: string | null
  username: string
  photo?: string | null
}

interface BlogPost {
  id: string
  title: string
  summary?: string | null
  content?: string
  slug: string
  publishedAt: string
  reactions_count?: number
  totalComments?: number
  user: BlogPostUser
  url?: string | null
}

interface BlogPostResponse {
  data: BlogPost[]
  page: number
  limit: number
  count: number
}

const { data, pending, error, refresh } = await useFetch<BlogPostResponse>(
  BLOG_POSTS_ENDPOINT,
  {
    key: 'blog-posts',
    server: true,
  },
)

const posts = computed(() => data.value?.data ?? [])

const getAuthorName = (user: BlogPostUser) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }

  if (user.firstName) {
    return user.firstName
  }

  return user.username
}

const getAuthorAvatar = (user: BlogPostUser) => user.photo || undefined

const formatPublishedAt = (publishedAt: string) =>
  new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(publishedAt))
</script>

<template>
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="12" md="10" lg="8">
        <v-sheet class="pa-6" elevation="0" rounded="xl" color="transparent">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 text-h3-md font-weight-bold mb-1">
                {{ t('blog.title') }}
              </h1>
              <p class="text-medium-emphasis mb-0">
                {{ t('blog.description') }}
              </p>
            </div>
            <v-btn
              variant="tonal"
              color="primary"
              prepend-icon="mdi-refresh"
              :loading="pending"
              @click="refresh"
            >
              {{ t('blog.actions.refresh') }}
            </v-btn>
          </div>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-6"
            border="start"
            prominent
          >
            {{ t('blog.alerts.loadFailed') }}
          </v-alert>

          <v-row v-if="pending">
            <v-col v-for="index in 3" :key="index" cols="12" class="pb-6">
              <v-skeleton-loader
                type="heading, paragraph, actions"
                elevation="2"
                class="rounded-xl"
              />
            </v-col>
          </v-row>

          <template v-else>
            <v-row v-if="posts.length">
              <v-col
                v-for="post in posts"
                :key="post.id"
                cols="12"
                class="pb-6"
              >
                <v-card class="rounded-xl" elevation="2">
                  <v-card-item>
                    <template #prepend>
                      <v-avatar size="48">
                        <v-img
                          :src="getAuthorAvatar(post.user)"
                          :alt="getAuthorName(post.user)"
                        >
                          <template #error>
                            <v-icon icon="mdi-account-circle" size="48" />
                          </template>
                        </v-img>
                      </v-avatar>
                    </template>
                    <v-card-title class="text-h5 text-wrap">
                      {{ post.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-body-2 text-medium-emphasis">
                      {{
                        t('blog.meta.author', {
                          author: getAuthorName(post.user),
                          date: formatPublishedAt(post.publishedAt),
                        })
                      }}
                    </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <p class="text-body-1 mb-4">
                      {{
                        post.summary ||
                        t('blog.placeholders.noSummary')
                      }}
                    </p>
                    <v-divider class="mb-4" />
                    <div class="d-flex flex-wrap align-center">
                      <div
                        class="d-flex align-center text-medium-emphasis mr-6 mb-2"
                      >
                        <v-icon icon="mdi-thumb-up-outline" class="mr-1" />
                        {{
                          t('blog.stats.reactions', {
                            count: post.reactions_count ?? 0,
                          })
                        }}
                      </div>
                      <div
                        class="d-flex align-center text-medium-emphasis mr-6 mb-2"
                      >
                        <v-icon icon="mdi-comment-text-outline" class="mr-1" />
                        {{
                          t('blog.stats.comments', {
                            count: post.totalComments ?? 0,
                          })
                        }}
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions class="pt-0 pb-4 px-4">
                    <v-btn
                      :href="post.url || undefined"
                      :disabled="!post.url"
                      target="_blank"
                      color="primary"
                      variant="text"
                      append-icon="mdi-open-in-new"
                    >
                      {{ t('blog.actions.read') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <v-sheet
              v-else
              class="d-flex flex-column align-center justify-center py-16 text-center"
              elevation="1"
              rounded="xl"
            >
              <v-icon icon="mdi-post-outline" size="64" class="mb-4" />
              <h2 class="text-h5 mb-2">{{ t('blog.empty.title') }}</h2>
              <p class="text-medium-emphasis mb-0">
                {{ t('blog.empty.description') }}
              </p>
            </v-sheet>
          </template>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
