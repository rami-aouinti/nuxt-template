<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw | null
    icon?: string | null
    label?: string | null
    component?: string | Component
  }>(),
  {
    to: null,
    icon: null,
    label: null,
    component: undefined,
  },
)

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

const rootTag = computed(() => {
  if (props.component) {
    return props.component
  }

  if (props.to) {
    return 'NuxtLink'
  }

  return 'div'
})

const rootProps = computed(() => {
  if (!props.component && props.to) {
    return { to: props.to }
  }

  return {}
})

const componentProps = computed(() => ({
  ...attrs,
  ...rootProps.value,
}))

</script>

<template>
  <component
    :is="rootTag"
    v-bind="componentProps"
    class="app-listing-card stat-card d-flex align-center gap-3 mb-3 w-100 px-3"
  >
    <slot name="leading">
      <v-icon v-if="icon" :icon="icon" size="24" />
    </slot>

    <slot>
      <span v-if="label" class="app-listing-card__label">
        {{ label }}
      </span>
    </slot>

    <slot name="append" />
  </component>
</template>

<style scoped>
.app-listing-card {
  text-decoration: none;
}

.app-listing-card__label {
  padding-inline: 8px;
}
</style>
