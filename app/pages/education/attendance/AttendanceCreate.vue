<template>
  <LayoutFormGeneric>
    <template #header>
      <BaseIcon icon="plus" />
      {{ t('Add attendance') }}
    </template>

    <AttendanceForm @back-pressed="goBack" />
  </LayoutFormGeneric>
</template>

<script setup lang="ts">
import AttendanceForm from '../../../components/education/attendance/AttendanceForm.vue'
import { useRoute, useRouter } from 'vue-router'

import LayoutFormGeneric from '../../../components/education/layout/LayoutFormGeneric.vue'
import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const goBack = (query = {}) => {
  router.push({
    name: 'AttendanceList',
    query: {
      ...route.query,
      ...query,
    },
  })
}
</script>
