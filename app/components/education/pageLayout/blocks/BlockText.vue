<template>
  <div class="text-gray-800">
    {{ block.content || 'Empty Text Block' }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})
</script>
