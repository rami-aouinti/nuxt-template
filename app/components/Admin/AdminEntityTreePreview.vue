<script setup lang="ts">
import type { AdminEntityPreviewNode } from '~/types/adminEntityPreview'

withDefaults(
  defineProps<{
    title: string
    emptyText: string
    nodes?: AdminEntityPreviewNode[]
  }>(),
  {
    nodes: () => [],
  },
)
</script>

<template>
  <v-card variant="tonal" class="admin-entity-tree">
    <div class="admin-entity-tree__header">
      <p class="text-subtitle-2 text-medium-emphasis mb-0">{{ title }}</p>
      <slot name="actions" />
    </div>

    <div v-if="nodes?.length" class="admin-entity-tree__content">
      <v-treeview
        :items="nodes"
        item-key="id"
        item-title="title"
        color="primary"
        density="compact"
        open-on-click
        rounded
      >
        <template #label="{ item }">
          <div class="admin-entity-tree__item">
            <span class="admin-entity-tree__key">{{ item.title }}</span>
            <span
              v-if="item.value !== undefined"
              class="admin-entity-tree__value text-high-emphasis"
            >
              {{ item.value }}
            </span>
          </div>
        </template>
      </v-treeview>
    </div>
    <div
      v-else
      class="admin-entity-tree__empty text-body-2 text-medium-emphasis"
    >
      {{ emptyText }}
    </div>
  </v-card>
</template>

<style scoped>
.admin-entity-tree {
  border: 1px solid rgb(var(--v-theme-outline));
  border-radius: 12px;
  padding: 16px;
}

.admin-entity-tree__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.admin-entity-tree__content {
  max-height: 360px;
  overflow: auto;
}

.admin-entity-tree__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.admin-entity-tree__key {
  font-family: var(--v-font-mono);
  font-size: 0.85rem;
}

.admin-entity-tree__value {
  font-weight: 600;
}

.admin-entity-tree__empty {
  padding: 24px 0;
  text-align: center;
}
</style>
