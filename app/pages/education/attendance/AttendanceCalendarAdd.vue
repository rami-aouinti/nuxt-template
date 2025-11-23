<template>
  <LayoutFormGeneric>
    <div class="bg-blue-100 text-blue-800 p-4 rounded border border-blue-300">
      <strong>{{ t('Information') }}:</strong>
      <span v-if="attendanceTitle">
        {{ t('You are adding calendar events for attendance') }}:
        <strong>{{ attendanceTitle }}</strong
        >.
      </span>
      <span>
        {{
          t(
            'The attendance calendar allows you to register attendance lists (one per real session the students need to attend). Add new attendance lists here.',
          )
        }}
      </span>
    </div>

    <template #header>
      <BaseIcon icon="calendar-plus" />
      {{ t('Add attendance date') }}
    </template>

    <AttendanceCalendarForm @back-pressed="goBack" />
  </LayoutFormGeneric>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

import LayoutFormGeneric from '../../../components/education/layout/LayoutFormGeneric.vue'
import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'
import AttendanceCalendarForm from '../../../components/education/attendance/AttendanceCalendarForm.vue'
import attendanceService from '../../../services/attendanceService'
import { onMounted, ref } from 'vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const attendanceTitle = ref('')

onMounted(async () => {
  try {
    const attendance = await attendanceService.getAttendance(route.params.id)
    attendanceTitle.value = attendance.title
  } catch (error) {
    console.error('Error fetching attendance:', error)
  }
})

const goBack = () => {
  router.push({
    name: 'AttendanceCalendarList',
    params: { node: route.params.node, id: route.params.id },
    query: {
      ...route.query,
    },
  })
}
</script>
