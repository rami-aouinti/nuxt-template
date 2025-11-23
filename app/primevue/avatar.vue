<template>
  <v-avatar v-bind="$attrs" :color="color" :size="size">
    <v-img v-if="image" :src="image" cover />
    <v-icon v-else-if="icon" :icon="icon" />
    <slot v-else />
  </v-avatar>
</template>

<script setup>
const props = defineProps({
  image: { type: String, default: '' },
  icon: { type: String, default: '' },
  size: { type: [String, Number], default: '40' },
  color: { type: String, default: 'primary' },
})
</script>
