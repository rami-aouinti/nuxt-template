<script setup lang="ts">
const route = useRoute()

const items = computed(() =>
  route.matched
    ?.filter((v) => v.path === route.path)[0]
    ?.children.filter((c) => c.path)
    .toSorted(
      (a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98),
    )
    .map((c) => ({
      title: c.meta?.title,
      to: c.name ? c : `${route.path}/${c.path}`,
      prependIcon: c.meta?.icon,
      subtitle: c.meta?.subtitle,
    })),
)
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="item in items" :key="item.title" cols="12" md="6" lg="4">
        <v-card class="mb-1">
          <v-list-item
            v-bind="item"
            :ripple="false"
            class="py-4"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
