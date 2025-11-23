<template>
  <div>
    <Toolbar v-if="item" :handle-delete="del" :handle-edit="editHandler" />

    <p v-if="item" class="text-lg">
      {{ item['title'] }}
    </p>

    <Loading :visible="isLoading" />
  </div>
</template>

<script setup lang="ts">
import Loading from '../../../components/education/Loading.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import { useSecurityStore } from '~/stores/securityStore'
import { storeToRefs } from 'pinia'
import { useShowResource } from '~/composables/education/useShowResource'

const securityStore = useSecurityStore()
const { isAuthenticated, isAdmin, isCurrentTeacher } = storeToRefs(securityStore)

const { item, isLoading, del, editHandler } = useShowResource({
  namespace: 'ccalendarevent',
  servicePrefix: 'CCalendarEvent',
})
</script>
