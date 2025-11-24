<template>
  <EducationPlaceholder title="Create" category="Tool Intro" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Ctoolintro Create',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
