<template>
  <i
    :class="iconClass"
    aria-hidden="true"
    class="cursor-pointer"
    :title="title"
    @click="$emit('click', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { chamiloIconToClass } from './ChamiloIcons.js'

const props = defineProps({
  icon: {
    type: String,
    required: true,
    validator: (value) =>
      typeof value === 'string' &&
      Object.keys(chamiloIconToClass).includes(value),
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['big', 'normal', 'small'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
})

const iconClass = computed(() => {
  let iconClass = chamiloIconToClass[props.icon] + ' '
  switch (props.size) {
    case 'big':
      iconClass += 'text-3xl/4 '
      break
    case 'normal':
      iconClass += 'text-xl/4 '
      break
    case 'small':
      iconClass += 'text-base/4 '
      break
  }
  return iconClass
})
</script>
