<template>
  <v-expansion-panels multiple>
    <v-expansion-panel v-for="(item, idx) in model" :key="idx">
      <v-expansion-panel-title>{{ item.label }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list density="compact">
          <v-list-item
            v-for="(child, cidx) in item.items || []"
            :key="cidx"
            :href="child.url"
            @click="child.command?.($event)"
          >
            <v-list-item-title>{{ child.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
const props = defineProps({
  model: { type: Array, default: () => [] },
})
</script>
