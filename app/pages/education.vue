<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import EducationShell from '~/components/education/EducationShell.vue'

const route = useRoute()

const useAppCardLayout = computed(() => route.meta?.appCardLayout !== false)
</script>

<template>
  <EducationShell>
    <v-container fluid class="education-layout py-8">
      <AppCard v-if="useAppCardLayout" class="pa-6" elevation="3" hover>
        <NuxtPage />
      </AppCard>
      <div v-else class="education-layout__content">
        <NuxtPage />
      </div>
    </v-container>
  </EducationShell>
</template>

<style scoped>
.education-layout {
  max-width: 1280px;
  margin: 0 auto;
}

.education-layout__content {
  width: 100%;
}
</style>
