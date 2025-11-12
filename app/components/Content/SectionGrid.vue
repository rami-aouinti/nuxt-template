<script setup lang="ts">
import { computed } from 'vue'

export interface SectionGridItem {
  icon?: string
  title: string
  description: string
}

type GenericProps = Record<string, unknown>

type ClassValue =
  | string
  | Record<string, boolean>
  | (string | Record<string, boolean> | null | undefined)[]
  | null
  | undefined

const toClassArray = (value: ClassValue) => {
  if (Array.isArray(value)) {
    return value.filter((entry) => entry !== null && entry !== undefined)
  }

  if (value === null || value === undefined) {
    return []
  }

  return [value]
}

const props = withDefaults(
  defineProps<{
    items: SectionGridItem[]
    rowProps?: GenericProps
    itemProps?: GenericProps
    sheetProps?: GenericProps
    iconSize?: number | string
    iconColor?: string
    iconClass?: ClassValue
    titleClass?: ClassValue
    descriptionClass?: ClassValue
  }>(),
  {
    iconSize: 32,
    iconColor: 'primary',
    iconClass: undefined,
    titleClass: () => ['text-h6', 'font-weight-medium', 'mb-0'],
    descriptionClass: () => ['text-body-1', 'mb-0'],
  },
)

const rowProps = computed(() => ({
  dense: true,
  ...(props.rowProps ?? {}),
}))

const itemProps = computed(() => {
  const incoming = props.itemProps ?? {}
  return {
    cols: 12,
    sm: 4,
    ...incoming,
    class: ['d-flex', ...toClassArray(incoming.class as ClassValue)],
  }
})

const sheetProps = computed(() => {
  const incoming = props.sheetProps ?? {}
  return {
    elevation: 1,
    rounded: 'lg',
    ...incoming,
    class: ['pa-4', 'flex-grow-1', ...toClassArray(incoming.class as ClassValue)],
  }
})

const iconClasses = computed(() => {
  const classes: ClassValue[] = []
  if (props.iconClass) {
    classes.push(props.iconClass)
  }
  if (props.iconColor) {
    classes.push(`text-${props.iconColor}`)
  }

  return classes
})
</script>

<template>
  <v-row v-bind="rowProps">
    <v-col v-for="item in items" :key="item.title" v-bind="itemProps">
      <v-sheet v-bind="sheetProps">
        <div class="d-flex align-center mb-3">
          <v-icon
            :icon="item.icon ? item.icon : 'mdi-earth'"
            :size="iconSize ?? '32px'"
            :class="iconClasses"
          />
          <h2 :class="titleClass" class="ml-3">
            {{ item.title }}
          </h2>
        </div>
        <p :class="descriptionClass">
          {{ item.description }}
        </p>
        <slot name="item" :item="item" />
      </v-sheet>
    </v-col>
  </v-row>
</template>
