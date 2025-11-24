<template>
  <LayoutFormGeneric>
    <template #header>
      <BaseIcon icon="plus" />
      {{ t('Edit glossary term') }}
    </template>

    <GlossaryForm :term-id="termId" @back-pressed="goBack" />
  </LayoutFormGeneric>
</template>

<script setup lang="ts">
import GlossaryForm from '../../../components/education/glossary/GlossaryForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import LayoutFormGeneric from '../../../components/education/layout/LayoutFormGeneric.vue'
import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'

definePageMeta({
  title: 'Glossary Glossary Term Update',
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const termId = computed(() => route.params.id)

const goBack = () => {
  router.push({
    name: 'GlossaryList',
    query: route.query,
  })
}
</script>
