<template>
  <form @submit.prevent="$emit('submit', $event)">
    <slot />
  </form>
</template>

<script setup>
defineEmits(["submit"])
</script>
