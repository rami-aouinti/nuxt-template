<script setup lang="ts">
import { computed, toRefs } from 'vue'

const props = withDefaults(
  defineProps<{
    icon: string
    iconClass?: string
    color: string
    title: string
    url: string
    value?: number | null
    unit?: string
    formatter?: (v: number) => string
  }>(),
  {
    iconClass: '',
    value: null,
    unit: '',
    formatter: (v: number) => v.toString(),
  },
)

const localePath = useLocalePath()
const localizedUrl = computed(() => localePath(props.url))

const { icon, iconClass, color, title, value, unit, formatter } = toRefs(props)
</script>

<template>
  <v-card class="stats-card v-alert--border-top">
    <v-icon
      size="x-large"
      class="stats-icon"
      :color="color"
      :class="iconClass"
      :icon="icon"
    />
    <div class="card-title ml-auto text-right">
      <NuxtLink
        :class="`text-${color}`"
        :to="localizedUrl"
        class="d-block text-decoration-none"
      >
        <span
          class="card-title--name font-weight-bold"
          v-text="title"
        />

        <h3
          class="font-weight-regular d-inline-block ml-2"
          style="font-size: 18px"
        >
          {{ value != null ? formatter(value) : '' }}
          <small v-if="unit">{{ unit }}</small>
        </h3>
      </NuxtLink>
      <v-divider />
    </div>
    <div class="v-alert__border" :class="`text-${color}`" />
    <div
      v-if="$slots.footer"
      class="text-grey text-right stats-footer text-caption"
    >
      <slot name="footer" />
    </div>
  </v-card>
</template>

<style scoped>
.stats-card {
  padding: 5px;
  padding-top: 10px;
  .card-title {
    width: fit-content;
    .card-title--name {
      display: inline-block;
      backdrop-filter: blur(3px);
    }
  }
  .caption {
    font-size: 12px;
    letter-spacing: 0;
  }
  .stats-icon {
    position: absolute;
    opacity: 0.3;
  }
  .stats-footer {
    :deep(span) {
      display: inline-block;
      font-size: 12px !important;
      letter-spacing: 0 !important;
    }
  }
}
</style>
