<template>
  <EducationPlaceholder title="Create" category="Course Category" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Coursecategory Create',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
