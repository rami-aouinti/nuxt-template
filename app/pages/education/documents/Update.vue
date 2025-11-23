<template>
  <div v-if="item && canEditItem">
    <DocumentsForm v-model="item" @submit="updateItemWithFormData">
      <EditLinks
        v-model="item"
        :show-share-with-user="false"
        :show-status="false"
        links-type="users"
      />
    </DocumentsForm>
    <Loading :visible="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DocumentsForm from '../../../components/education/documents/Form.vue'
import Loading from '../../../components/education/Loading.vue'
import EditLinks from '../../../components/education/resource_links/EditLinks.vue'
import { useDatatableUpdate } from '~/composables/education/datatableUpdate'
import { useSecurityStore } from '~/stores/securityStore'
import { useRoute } from 'vue-router'
import { checkIsAllowedToEdit } from '~/composables/education/userPermissions'

const securityStore = useSecurityStore()
const route = useRoute()
const isAllowedToEdit = ref(false)
const isCurrentTeacher = computed(
  () => securityStore.isCurrentTeacher || isAllowedToEdit.value,
)
const { item, retrieve, updateItemWithFormData, isLoading } =
  useDatatableUpdate('Documents')

const canEditItem = computed(() => {
  console.log('item.value ::: ', item.value)

  const resourceLink = item.value?.resourceLinkListFromEntity?.[0]
  const sidFromResourceLink = resourceLink?.session?.['@id']
  return (
    (sidFromResourceLink &&
      sidFromResourceLink === `/api/sessions/${route.query.sid}` &&
      isAllowedToEdit.value) ||
    isCurrentTeacher.value
  )
})

onMounted(async () => {
  isAllowedToEdit.value = await checkIsAllowedToEdit(true, true, true)
  await retrieve()
})
</script>
