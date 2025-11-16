<script setup lang="ts">
import { computed } from 'vue'

type BarPoint = {
  label: string
  value: number
}

const props = defineProps<{ items?: BarPoint[] }>()

const fallbackItems: BarPoint[] = [
  ['Mon', 79],
  ['Tue', 52],
  ['Wed', 200],
  ['Thu', 334],
  ['Fri', 390],
  ['Sat', 330],
  ['Sun', 220],
].map(([label, value]) => ({ label, value }))

const chartItems = computed(() =>
  props.items && props.items.length > 0 ? props.items : fallbackItems,
)

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    top: 20,
    left: '2%',
    right: '2%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: chartItems.value.map((item) => item.label),
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: 'value',
      type: 'bar',
      stack: 'visitors',
      barWidth: '60%',
      data: chartItems.value.map((item) => item.value),
    },
  ],
}))
</script>

<template>
  <v-chart :option="option" autoresize />
</template>
