<script setup lang="ts">
import { toRefs } from 'vue'

export interface AppNavigationListItem {
  value?: string | number
  to?: string
  label: string
  icon?: string
}

const props = withDefaults(
  defineProps<{
    items: AppNavigationListItem[]
    title?: string
    description?: string
  }>(),
  {
    title: undefined,
    description: undefined,
  },
)

const { items, title, description } = toRefs(props)

const itemKey = (item: AppNavigationListItem, index: number) =>
  item.value ?? item.to ?? index
</script>

<template>
  <div class="app-navigation-list" v-bind="$attrs">
    <div v-if="$slots.title || title" class="animated-badge mb-4">
      <slot name="title">
        <span class="animated-badge__pulse" />
        {{ title }}
      </slot>
    </div>
    <p
      v-if="$slots.description || description"
      class="text-body-2 text-medium-emphasis mb-4"
    >
      <slot name="description">
        {{ description }}
      </slot>
    </p>
    <div
      v-for="(item, index) in items"
      :key="itemKey(item, index)"
      class="w-100"
    >
      <NuxtLink
        v-if="item.to"
        class="text-decoration-none"
        :to="item.to"
        style="color: inherit"
      >
        <slot name="item" :item="item">
          <div class="stat-card d-flex align-center gap-3 mb-3 w-100 px-3">
            <v-icon v-if="item.icon" :icon="item.icon" size="24" />
            <span class="px-2">{{ item.label }}</span>
          </div>
        </slot>
      </NuxtLink>
      <div v-else>
        <slot name="item" :item="item">
          <div class="stat-card d-flex align-center gap-3 mb-3 w-100 px-3">
            <v-icon v-if="item.icon" :icon="item.icon" size="24" />
            <span class="px-2">{{ item.label }}</span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-navigation-list {
  background-color: transparent !important;
  padding: 8px;
}

@media (min-width: 960px) {
  .app-navigation-list {
    padding: 12px 16px;
  }
}
</style>
