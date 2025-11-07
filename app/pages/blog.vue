<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  icon: 'mdi-home',
  title: 'navigation.blog',
  drawerIndex: 1,
})

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
  new Intl.DateTimeFormat('fr-FR', {
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
              <h1 class="text-h4 text-h3-md font-weight-bold mb-1">Blog</h1>
              <p class="text-medium-emphasis mb-0">
                Retrouvez les dernières actualités de Bro World.
              </p>
            </div>
            <v-btn
              variant="tonal"
              color="primary"
              prepend-icon="mdi-refresh"
              :loading="pending"
              @click="refresh"
            >
              Actualiser
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
            Une erreur est survenue lors du chargement des articles. Veuillez
            réessayer.
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
                      Par {{ getAuthorName(post.user) }} •
                      {{ formatPublishedAt(post.publishedAt) }}
                    </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <p class="text-body-1 mb-4">
                      {{
                        post.summary ||
                        'Aucun résumé disponible pour cet article.'
                      }}
                    </p>
                    <v-divider class="mb-4" />
                    <div class="d-flex flex-wrap align-center">
                      <div
                        class="d-flex align-center text-medium-emphasis mr-6 mb-2"
                      >
                        <v-icon icon="mdi-thumb-up-outline" class="mr-1" />
                        {{ post.reactions_count ?? 0 }} réactions
                      </div>
                      <div
                        class="d-flex align-center text-medium-emphasis mr-6 mb-2"
                      >
                        <v-icon icon="mdi-comment-text-outline" class="mr-1" />
                        {{ post.totalComments ?? 0 }} commentaires
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
                      Lire l'article
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
              <h2 class="text-h5 mb-2">Aucun article publié pour le moment</h2>
              <p class="text-medium-emphasis mb-0">
                Revenez plus tard pour découvrir les prochaines publications.
              </p>
            </v-sheet>
          </template>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
