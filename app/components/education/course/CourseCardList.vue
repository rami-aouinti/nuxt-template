<template>
  <CourseCard v-for="course in courses" :key="course.id" :course="course" />
</template>

<script setup lang="ts">
import CourseCard from './CourseCard.vue'

defineProps({
  courses: {
    type: Array,
    default: () => [],
  },
})
</script>
