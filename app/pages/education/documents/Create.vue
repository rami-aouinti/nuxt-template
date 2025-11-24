<template>
  <EducationPlaceholder title="Create" category="Documents" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Documents Create',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
