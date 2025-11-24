<template>
  <LayoutFormGeneric>
    <template #header>
      <BaseIcon icon="plus" />
      {{ t('Add new glossary term') }}
    </template>

    <GlossaryForm @back-pressed="goBack" />
  </LayoutFormGeneric>
</template>

<script setup lang="ts">
import GlossaryForm from '../../../components/education/glossary/GlossaryForm.vue'
import { useRoute, useRouter } from 'vue-router'
import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'

import LayoutFormGeneric from '../../../components/education/layout/LayoutFormGeneric.vue'

definePageMeta({
  title: 'Glossary Glossary Term Create',
  middleware: 'auth',
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const goBack = () => {
  router.push({
    name: 'GlossaryList',
    query: route.query,
  })
}
</script>
