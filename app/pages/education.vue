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
    <AppCard v-if="useAppCardLayout" class="pa-6" elevation="3" hover>
      <NuxtPage />
    </AppCard>
    <div v-else>
      <NuxtPage />
    </div>
  </EducationShell>
</template>

<style scoped></style>
