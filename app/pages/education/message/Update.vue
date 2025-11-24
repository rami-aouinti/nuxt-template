<template>
  <EducationPlaceholder title="Update" category="Messages" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Message Update',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
