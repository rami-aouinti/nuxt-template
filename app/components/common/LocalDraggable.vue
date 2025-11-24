<template>
  <component :is="tag" class="local-draggable" @dragover.prevent>
    <template
      v-for="(element, index) in items"
      :key="itemKeyValue(element, index)"
    >
      <div
        :draggable="!disabled"
        :class="[
          draggingIndex === index && dragClass,
          draggingIndex === index && ghostClass,
          draggingIndex === index && chosenClass,
        ]"
        @dragstart="onDragStart(index, $event)"
        @dragenter.prevent="onDragEnter(index, $event)"
        @dragover.prevent
        @drop.prevent="onDrop(index, $event)"
        @dragend="onDragEnd($event)"
      >
        <slot name="item" :element="element" :index="index" />
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type ItemKey = string | ((item: unknown) => string | number)

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  itemKey: { type: [String, Function] as () => ItemKey, default: undefined },
  disabled: { type: Boolean, default: false },
  handle: { type: String, default: '' },
  animation: { type: Number, default: 0 },
  tag: { type: String, default: 'div' },
  ghostClass: { type: String, default: '' },
  chosenClass: { type: String, default: '' },
  dragClass: { type: String, default: '' },
})

const emit = defineEmits<{
  (event: 'update:modelValue' | 'change', value: unknown[]): void
  (event: 'start', value: DragEvent): void
  (event: 'end', value: DragEvent | undefined): void
}>()

const items = ref([...props.modelValue])

watch(
  () => props.modelValue,
  (value) => {
    items.value = [...value]
  },
  { deep: true },
)

const draggingIndex = ref<number | null>(null)

const itemKeyValue = computed(() => (item: unknown, index: number) => {
  if (!props.itemKey) return index
  if (typeof props.itemKey === 'function') return props.itemKey(item)
  const candidate = (item as Record<string, unknown> | null)?.[props.itemKey]
  return typeof candidate === 'string' || typeof candidate === 'number'
    ? candidate
    : index
})

const isHandleValid = (event: DragEvent) => {
  if (!props.handle) return true
  return (event.target as HTMLElement | null)?.closest(props.handle) !== null
}

const onDragStart = (index: number, event: DragEvent) => {
  if (props.disabled || !isHandleValid(event)) {
    event.preventDefault()
    return
  }
  draggingIndex.value = index
  emit('start', event)
}

const onDragEnter = (index: number, event: DragEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  // Provide feedback via ghost class when hovering over new index
  draggingIndex.value = draggingIndex.value ?? index
}

const onDrop = (index: number, event: DragEvent) => {
  if (props.disabled || draggingIndex.value === null) return

  const updated = [...items.value]
  const [moved] = updated.splice(draggingIndex.value, 1)
  updated.splice(index, 0, moved)

  items.value = updated
  emit('update:modelValue', updated)
  emit('change', updated)
  emit('end', event)
  draggingIndex.value = null
}

const onDragEnd = (event?: DragEvent) => {
  emit('end', event)
  draggingIndex.value = null
}
</script>
