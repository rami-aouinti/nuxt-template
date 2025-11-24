<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import SectionHeader from '../../../components/education/layout/SectionHeader.vue'
import pageService from '../../../services/pageService'
import { useNotification } from '~/composables/education/notification'
import Loading from '../../../components/education/Loading.vue'

definePageMeta({
  title: 'Page Page Public',
})

const route = useRoute()
const { t } = useI18n()
const { showWarningNotification } = useNotification()

const isLoading = ref(true)
const page = ref()

pageService
  .getPublicPageBySlug(route.params.slug)
  .then((result) => {
    if (result) {
      page.value = result

      return
    }

    showWarningNotification(t('Not found'))
  })
  .finally(() => (isLoading.value = false))
</script>

<template>
  <div v-if="page">
    <SectionHeader :title="page.title" />

    <div class="wysiwyg" v-html="page.content" />
  </div>
  <Loading :visible="isLoading" />
</template>
