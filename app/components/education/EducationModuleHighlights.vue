<template>
  <AppCard class="pa-5 d-flex flex-column gap-4" variant="outlined">
    <header class="d-flex flex-column gap-1">
      <div class="text-subtitle-1 font-weight-bold">Parcours proposé</div>
      <p class="text-body-2 text-medium-emphasis mb-0">
        Synthèse des fonctionnalités clés issues de la migration.
      </p>
    </header>

    <div class="module-highlights__divider" />

    <ul class="module-highlights__list">
      <li v-for="highlight in highlights" :key="highlight">
        <v-icon icon="mdi-check-circle-outline" size="18" class="text-primary" />
        <span class="text-body-2">{{ highlight }}</span>
      </li>
    </ul>
  </AppCard>
</template>

<script setup lang="ts">
defineProps<{
  highlights: string[]
}>()
</script>

<style scoped>
.module-highlights__divider {
  height: 1px;
  background: rgba(var(--v-theme-primary), 0.12);
}

.module-highlights__list {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.module-highlights__list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-primary), 0.06);
}
</style>
