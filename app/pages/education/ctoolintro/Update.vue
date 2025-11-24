<template>
  <EducationPlaceholder title="Update" category="Tool Intro" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Ctoolintro Update',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
