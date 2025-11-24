<template>
  <div class="terms-list-view mt-4">
    <BaseToolbar show-top-border>
      <BaseButton
        :label="t('Edit Terms and Conditions')"
        icon="edit"
        type="primary"
        @click="editTerms"
      />
    </BaseToolbar>

    <Message :closable="false" severity="warn">
      {{
        t(
          'You should create the "Term and Conditions" for all the available languages.',
        )
      }}
    </Message>

    <BaseTable :is-loading="isLoading" :values="terms">
      <Column field="version" header="Version" />
      <Column field="language" header="Language" />

      <Column header="Content">
        <template #body="slotProps">
          <div v-html="slotProps.data.content" />
        </template>
      </Column>

      <Column field="changes" header="Changes" />
      <Column field="typeLabel" header="Type" />
      <Column field="date" header="Date">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.date) }}
        </template>
      </Column>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Column from 'primevue/column'
import BaseToolbar from '../../../components/education/basecomponents/BaseToolbar.vue'
import BaseButton from '../../../components/education/basecomponents/BaseButton.vue'
import BaseTable from '../../../components/education/basecomponents/BaseTable.vue'

import Message from 'primevue/message'
import languageService from '../../../services/languageService'
import legalService from '../../../services/legalService'

definePageMeta({
  title: 'Terms Terms List',
})

const { t } = useI18n()
const router = useRouter()
const terms = ref([])
const isLoading = ref(false)

async function fetchLanguageName(languageId) {
  try {
    const response = await languageService.find('/api/languages/' + languageId)
    if (response.ok) {
      const languageData = await response.json()
      return languageData.originalName
    }
  } catch (error) {
    console.error('Error loading language details:', error)
  }
  return null
}

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await legalService.findAll()
    if (response.ok) {
      const data = await response.json()
      terms.value = await Promise.all(
        data['hydra:member'].map(async (term) => {
          const languageName = await fetchLanguageName(term.languageId)
          return {
            ...term,
            language: languageName,
            typeLabel: getTypeLabel(term.type),
          }
        }),
      )
    } else {
      console.error(
        'The request to the API was not successful:',
        response.statusText,
      )
    }
  } catch (error) {
    console.error('Error loading legal terms:', error)
  } finally {
    isLoading.value = false
  }
})

function getTypeLabel(typeValue) {
  const typeMap = {
    0: t('HTML'),
    1: t('Page Link'),
  }
  return typeMap[typeValue] || 'Unknown'
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

function editTerms() {
  router.push({ name: 'TermsConditionsEdit' })
}
</script>
