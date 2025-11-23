<template>
  <LayoutFormGeneric>
    <template #header>
      <BaseIcon icon="link-add" />
      {{ t('Add a link') }}
    </template>

    <LinkForm @back-pressed="goBack" />
  </LayoutFormGeneric>
</template>

<script setup lang="ts">
import LinkForm from '../../../components/education/links/LinkForm.vue'
import { useRoute, useRouter } from 'vue-router'

import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'
import LayoutFormGeneric from '../../../components/education/layout/LayoutFormGeneric.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const goBack = () => {
  router.push({
    name: 'LinksList',
    query: route.query,
  })
}
</script>
