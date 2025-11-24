<template>
  <div>
    <h2 class="text-h3 font-small text-gray-800 mb-4">
      <BaseIcon icon="folder-plus" />
      {{ t('Add a category') }}
    </h2>
    <hr class="m-0 mb-4" />
    <LinkCategoryForm @back-pressed="goBack" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import LinkCategoryForm from '../../../components/education/links/LinkCategoryForm.vue'
import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'

definePageMeta({
  title: 'Links Links Category Create',
})

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
