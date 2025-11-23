<template>
  <div v-if="courses.length" class="mb-6">
    <SectionHeader :title="t('Sticky courses')" />
    <div
      v-if="courses.length"
      class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2"
    >
      <CourseCardList :courses="courses" />
    </div>

    <BaseDivider />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import CourseCardList from '../../../../components/education/course/CourseCardList.vue'
import SectionHeader from '../../../../components/education/layout/SectionHeader.vue'
import BaseDivider from '../../../../components/education/basecomponents/BaseDivider.vue'

import { useSecurityStore } from '../~/stores/securityStore'

import { useQuery } from '@vue/apollo-composable'

import { GET_STICKY_COURSES } from '../../../graphql/queries/Course'

const securityStore = useSecurityStore()

const queryResponse = ref({})

const { t } = useI18n()

if (securityStore.isAuthenticated) {
  const { result } = useQuery(GET_STICKY_COURSES)

  watchEffect(() => {
    queryResponse.value = result.value
  })
}

const courses = computed(
  () => queryResponse.value?.courses?.edges?.map(({ node }) => node) ?? [],
)
</script>
