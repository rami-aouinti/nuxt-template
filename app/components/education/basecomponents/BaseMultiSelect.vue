<template>
  <div class="field">
    <FloatLabel variant="on">
      <MultiSelect
        v-model="selectedValues"
        :options="options"
        display="chip"
        fluid
        input-id="multiSelect"
        option-label="name"
        option-value="id"
        panel-class="multi-select-panel"
        @blur="isFocused = false"
        @focus="isFocused = true"
        @update:model-value="updateModelValue"
      />
      <label :for="inputId" v-text="label" />
    </FloatLabel>
    <small
      v-if="isInvalid"
      :class="{ 'p-error': isInvalid }"
      v-text="errorText"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import MultiSelect from 'primevue/multiselect'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: String,
  inputId: {
    type: String,
    required: true,
    default: '',
  },
  label: {
    type: String,
    required: true,
    default: '',
  },
  errorText: {
    type: String,
    required: false,
    default: null,
  },
  isInvalid: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
const selectedValues = ref([...props.modelValue])
const isFocused = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValues.value = [...newValue]
  },
)

const updateModelValue = (newValue) => {
  emit('update:modelValue', newValue)
}
</script>
