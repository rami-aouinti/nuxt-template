<template>
  <div>
    <div class="mb-4">
      <Button
        icon="mdi mdi-arrow-left"
        :label="t('Back to list')"
        class="p-button-secondary"
        @click="router.push({ name: 'PageList', query: $route.query })"
      />
    </div>

    <PageForm v-model="item" @submit="updateItem" />
    <Loading :visible="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

import Loading from '../../../components/education/Loading.vue'
import PageForm from '../../../components/education/page/Form.vue'
import { useDatatableUpdate } from '~/composables/education/datatableUpdate'

const { item, isLoading, retrieve, updateItem } = useDatatableUpdate('Page')
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

retrieve()
</script>
