<template>
  <div />
</template>
<script setup lang="ts">
const localePath = useLocalePath()

const redirectTarget = localePath('home')

if (redirectTarget) {
  await navigateTo(redirectTarget)
}
</script>
