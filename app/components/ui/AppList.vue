<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

type ListLines = 'one' | 'two' | 'three'
type ListDensity = 'default' | 'comfortable' | 'compact'

type AppListItem = {
  title: string
  subtitle?: string
  prependIcon?: string
  appendIcon?: string
  value?: string | number
  to?: RouteLocationRaw
  disabled?: boolean
  active?: boolean
}

const props = defineProps<{
  items?: AppListItem[]
  lines?: ListLines
  density?: ListDensity
  nav?: boolean
  border?: boolean
  shadow?: boolean
}>()

const normalizedLines = computed<ListLines>(() => props.lines ?? 'one')
const normalizedDensity = computed<ListDensity>(() => props.density ?? 'comfortable')
const isNav = computed(() => props.nav ?? false)
const hasShadow = computed(() => props.shadow ?? false)
const hasBorder = computed(() => props.border ?? false)

const listClasses = computed(() => [
  'app-list',
  hasShadow.value ? 'app-list--shadow' : 'app-list--no-shadow',
  { 'app-list--bordered': hasBorder.value },
])
</script>

<template>
  <v-list
    :items="props.items"
    :lines="normalizedLines"
    :density="normalizedDensity"
    :nav="isNav"
    :class="listClasses"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.subheader" #subheader>
      <slot name="subheader" />
    </template>
    <template v-if="$slots.title" #title="slotProps">
      <slot name="title" v-bind="slotProps" />
    </template>
    <template v-if="$slots.subtitle" #subtitle="slotProps">
      <slot name="subtitle" v-bind="slotProps" />
    </template>
    <template v-if="$slots.prepend" #prepend="slotProps">
      <slot name="prepend" v-bind="slotProps" />
    </template>
    <template v-if="$slots.append" #append="slotProps">
      <slot name="append" v-bind="slotProps" />
    </template>
    <template v-if="$slots.item" #item="slotProps">
      <slot name="item" v-bind="slotProps" />
    </template>
    <slot />
  </v-list>
</template>

<style scoped>
.app-list {
  border-radius: var(--app-rounded, 18px) !important;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.app-list--shadow {
  box-shadow: var(--app-shadow, 0 10px 26px rgba(var(--v-theme-primary), 0.14)) !important;
}

.app-list--shadow:hover {
  box-shadow: var(--app-shadow-hover, 0 18px 44px rgba(var(--v-theme-primary), 0.2)) !important;
}

.app-list--no-shadow {
  box-shadow: none !important;
}

.app-list--bordered {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
