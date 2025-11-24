<template>
  <div class="page-layouts">
    <SectionHeader :title="t('Page layouts')">
      <div class="flex gap-4">
        <BaseButton
          :label="t('Create layout')"
          icon="file-add"
          type="success"
          @click="goToCreate"
        />
        <BaseButton
          :label="t('Manage templates')"
          icon="cog"
          type="secondary"
          @click="goToTemplates"
        />
      </div>
    </SectionHeader>

    <BaseTable :values="layouts" data-key="id">
      <Column header-style="width: 80px">
        <template #body="">
          <BaseIcon icon="layout" size="normal" class="text-primary" />
        </template>
      </Column>

      <Column field="id" :header="t('ID')" />
      <Column field="url" :header="t('URL')" />
      <Column field="roles" :header="t('Roles')">
        <template #body="{ data }">
          <span>{{ data.roles || t('All') }}</span>
        </template>
      </Column>

      <Column
        :header="t('Actions')"
        :exportable="false"
        header-style="width: 200px"
      >
        <template #body="{ data }">
          <div class="flex gap-2">
            <BaseButton
              icon="eye-on"
              size="normal"
              type="primary"
              :title="t('View')"
              @click="goToShow(data)"
            />
            <BaseButton
              icon="edit"
              size="normal"
              type="secondary"
              :title="t('Edit')"
              @click="goToEdit(data)"
            />
            <BaseButton
              icon="delete"
              size="normal"
              type="danger"
              :title="t('Delete')"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </BaseTable>

    <BaseDialogConfirmCancel
      v-model:is-visible="isDeleteDialogVisible"
      :title="t('Confirm deletion')"
      @confirm-clicked="deleteLayout"
      @cancel-clicked="isDeleteDialogVisible = false"
    >
      <span>{{ t('Are you sure you want to delete this layout?') }}</span>
    </BaseDialogConfirmCancel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import BaseButton from '../../../components/education/basecomponents/BaseButton.vue'
import SectionHeader from '../../../components/education/layout/SectionHeader.vue'
import BaseIcon from '../../../components/education/basecomponents/BaseIcon.vue'
import BaseDialogConfirmCancel from '../../../components/education/basecomponents/BaseDialogConfirmCancel.vue'
import BaseTable from '../../../components/education/basecomponents/BaseTable.vue'

import pageService from '../../../services/pageService.js'

definePageMeta({
  title: 'Page Layout List',
})

const { t } = useI18n()
const router = useRouter()

const layouts = ref([])
const isDeleteDialogVisible = ref(false)
const layoutToDelete = ref(null)

onMounted(loadLayouts)

async function loadLayouts() {
  try {
    layouts.value = await pageService.getPageLayouts()
  } catch (error) {
    console.error('Error fetching page layouts:', error)
  }
}

function goToCreate() {
  router.push({ name: 'PageLayoutCreate' })
}

function goToTemplates() {
  router.push({ name: 'PageLayoutTemplateList' })
}

function goToEdit(layout) {
  router.push({ name: 'PageLayoutEdit', params: { id: layout.id } })
}

function goToShow(layout) {
  router.push({ name: 'PageLayoutShow', params: { id: layout.id } })
}

function confirmDelete(layout) {
  layoutToDelete.value = layout
  isDeleteDialogVisible.value = true
}

async function deleteLayout() {
  try {
    await pageService.deletePageLayout(
      `/api/page_layouts/${layoutToDelete.value.id}`,
    )
    layouts.value = layouts.value.filter(
      (l) => l.id !== layoutToDelete.value.id,
    )
    isDeleteDialogVisible.value = false
  } catch (error) {
    console.error('Error deleting layout:', error)
  }
}
</script>
