<template>
  <div class="field-checkbox">
    <Checkbox v-model="proxy" :binary="true" :input-id="id" :name="name" />
    <label :for="id" class="ml-2 cursor-pointer">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Checkbox from 'primevue/checkbox'

const props = defineProps({
  id: { type: String, required: true },
  modelValue: { type: Boolean, required: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])
const proxy = computed({
  get: () => !!props.modelValue,
  set: (val) => emit('update:modelValue', !!val),
})
</script>
<style scoped>
.p-checkbox .p-checkbox-box {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
