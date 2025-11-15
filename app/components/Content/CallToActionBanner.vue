<script setup lang="ts">
import { computed } from 'vue'

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
    title: string
    description?: string
    type?: string
    variant?: string
    prominent?: boolean
    icon?: string | false
    alertProps?: GenericProps
    contentClass?: ClassValue
    titleClass?: ClassValue
    descriptionClass?: ClassValue
  }>(),
  {
    type: 'primary',
    variant: 'tonal',
    prominent: false,
    icon: undefined,
    description: undefined,
    alertProps: () => ({}),
    contentClass: undefined,
    titleClass: () => ['d-block', 'mb-1'],
    descriptionClass: undefined,
  },
)

const mergedAlertProps = computed(() => {
  const incoming = props.alertProps ?? {}
  return {
    type: props.type,
    variant: props.variant,
    prominent: props.prominent,
    icon: props.icon === false ? undefined : props.icon,
    rounded: 'lg',
    ...incoming,
    class: ['pa-4', ...toClassArray(incoming.class as ClassValue)],
  }
})
</script>

<template>
  <v-alert v-bind="mergedAlertProps">
    <div class="d-flex flex-column flex-sm-row gap-4 align-sm-center">
      <div :class="contentClass">
        <strong v-if="title" :class="titleClass">
          {{ title }}
        </strong>
        <p v-if="description" :class="descriptionClass" class="mb-0">
          {{ description }}
        </p>
        <slot />
      </div>
      <div v-if="$slots.actions" class="ml-sm-auto">
        <slot name="actions" />
      </div>
    </div>
  </v-alert>
</template>
