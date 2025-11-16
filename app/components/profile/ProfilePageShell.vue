<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProfileNavigation from '~/components/profile/ProfileNavigation.vue'

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <v-container fluid>
    <Teleport v-if="isMounted" to="#app-drawer">
      <ProfileNavigation class="mb-6" />
    </Teleport>
    <slot />
  </v-container>
</template>
