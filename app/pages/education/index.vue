<script setup lang="ts">
definePageMeta({
  title: 'Index',
  appCardLayout: false,
})

const { t } = useI18n()
const localePath = useLocalePath()

type NewsItem = {
  id: number
  title: string
  content: string
  readMore: string | null
}

const {
  data: news,
  pending,
  error,
  refresh,
} = await useFetch<NewsItem[]>('https://education.bro-world.org/news/list')
</script>

<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" variant="tonal">
      Impossible de charger les news.
      <v-btn variant="text" size="small" @click="refresh"> Reload </v-btn>
    </v-alert>

    <v-row v-else>
      <v-col v-for="item in news" :key="item.id" cols="12">
        <AppCard variant="text" class="news-card">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            class="edit-btn"
            :to="localePath('/education/news/edit')"
          />

          <v-card-title class="text-wrap">
            {{ item.title }}
          </v-card-title>

          <v-card-text>
            <div v-html="item.content" />
          </v-card-text>

          <v-card-actions v-if="item.readMore">
            <v-btn
              :href="item.readMore"
              target="_blank"
              rel="noopener"
              variant="text"
            >
              Lire plus
            </v-btn>
          </v-card-actions>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.news-card {
  position: relative;
}

.edit-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.v-card-title {
  white-space: normal;
}
</style>
