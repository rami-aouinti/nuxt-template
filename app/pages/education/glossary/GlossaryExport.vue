<template>
  <LayoutFormGeneric>
    <template #header>
      <BaseIcon icon="file-export" />
      {{ t('Export glossary') }}
    </template>

    <GlossaryExportForm @back-pressed="goBack" />
  </LayoutFormGeneric>
</template>

<script setup lang="ts">
import GlossaryExportForm from '../../../components/education/glossary/GlossaryExportForm.vue'
import { useRoute, useRouter } from 'vue-router'
import LayoutFormGeneric from '../../../components/education/layout/LayoutFormGeneric.vue'
import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'

definePageMeta({
  title: 'Glossary Glossary Export',
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
