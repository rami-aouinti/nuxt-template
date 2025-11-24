<template>
  <div class="calendar">
    <div class="cal-head">
      <button
        class="nav"
        :title="t('blogPostsPage.previous')"
        @click="$emit('prev')"
      >
        <i class="mdi mdi-chevron-left" />
      </button>
      <div class="month">{{ monthLabel }} {{ year }}</div>
      <button class="nav" :title="t('blogPostsPage.next')" @click="$emit('next')">
        <i class="mdi mdi-chevron-right" />
      </button>
    </div>

    <div class="grid grid-cols-7 text-[11px] text-gray-500 mb-1">
      <div v-for="d in weekDays" :key="d" class="text-center py-1">{{ d }}</div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div v-for="i in startOffset" :key="'off' + i" />
      <button
        v-for="d in daysInMonth"
        :key="d"
        class="day"
        :class="isSelected(d) ? 'selected' : ''"
        @click="select(d)"
      >
        {{ d }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  year: { type: Number, required: true },
  month: { type: Number, required: true }, // 1-12
  selected: { type: String, default: '' }, // YYYY-MM-DD
})
const emit = defineEmits(['select', 'prev', 'next'])
const { t } = useI18n()

const monthLabel = computed(() =>
  new Date(props.year, props.month - 1, 1).toLocaleString(undefined, {
    month: 'long',
  }),
)
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const firstWeekday = computed(() => {
  // Convert Sunday=0 -> 7
  let w = new Date(props.year, props.month - 1, 1).getDay()
  if (w === 0) w = 7
  return w // 1..7 (Mon..Sun)
})
const startOffset = computed(() => firstWeekday.value - 1)
const daysInMonth = computed(() =>
  new Date(props.year, props.month, 0).getDate(),
)

function pad(n) {
  return String(n).padStart(2, '0')
}
function iso(d) {
  return `${props.year}-${pad(props.month)}-${pad(d)}`
}
function isSelected(d) {
  return props.selected === iso(d)
}
function select(d) {
  emit('select', iso(d))
}
</script>
