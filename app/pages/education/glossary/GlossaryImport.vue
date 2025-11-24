<template>
  <LayoutFormGeneric>
    <template #header>
      <BaseIcon icon="import" />
      {{ t('Import glossary') }}
    </template>

    <GlossaryImportForm @back-pressed="goBack" />
  </LayoutFormGeneric>
</template>

<script setup lang="ts">
import GlossaryImportForm from '../../../components/education/glossary/GlossaryImportForm.vue'
import { useRoute, useRouter } from 'vue-router'
import LayoutFormGeneric from '../../../components/education/layout/LayoutFormGeneric.vue'
import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'

definePageMeta({
  title: 'Glossary Glossary Import',
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
