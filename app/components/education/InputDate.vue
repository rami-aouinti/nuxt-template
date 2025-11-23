<template>
  <v-menu v-model="showMenu" :close-on-content-click="false" transition="scale-transition">
    <template #activator="{ props: menuProps }">
      <v-text-field
        v-bind="menuProps"
        :label="label"
        :model-value="formattedDate"
        prepend-icon="mdi-calendar"
        readonly
        variant="outlined"
      />
    </template>

    <v-date-picker v-model="date" color="primary" @update:model-value="handleInput" />
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatDateTime } from '../../utils/dates.js'

const props = defineProps<{ label?: string; modelValue?: string | null }>()
const emit = defineEmits(['update:modelValue'])

const date = ref(props.modelValue ?? new Date().toISOString().slice(0, 10))
const showMenu = ref(false)

watch(
  () => props.modelValue,
  (value) => {
    if (value) date.value = value
  },
)

const formattedDate = computed(() => formatDateTime(date.value))

const handleInput = (value: string) => {
  date.value = value
  showMenu.value = false
  emit('update:modelValue', value)
}
</script>
