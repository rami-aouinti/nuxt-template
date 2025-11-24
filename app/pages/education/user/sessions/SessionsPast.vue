<template>
  <SessionTabs class="mb-4" />
  <SessionsLoading :is-loading="isLoading" />
  <!--  <SessionListWrapper :sessions="sessions"/>-->
  <SessionCategoryView
    v-if="!isLoading"
    :categories="categories"
    :categories-with-sessions="categoriesWithSessions"
    :uncategorized-sessions="uncategorizedSessions"
  />
  <div ref="sentinel" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import SessionCategoryView from '../../../../components/education/session/SessionCategoryView'
import SessionTabs from '../../../../components/education/session/SessionTabs.vue'
import { useSession } from './session'
import SessionsLoading from './SessionsLoading.vue'

definePageMeta({
  title: 'Sessions Sessions Past',
})

const {
  isLoading,
  uncategorizedSessions,
  categories,
  categoriesWithSessions,
  reload,
} = useSession('past')

let observer = null
const sentinel = ref(null)

const initObserver = () => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isLoading.value) {
        reload()
      }
    },
    {
      rootMargin: '0px',
      threshold: 1.0,
    },
  )

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
}

onMounted(() => {
  initObserver()
})

onUnmounted(() => {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value)
  }
})
</script>
