<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import AppModal from '~/components/App/AppModal.vue'
import glossaryService from '~/services/glossaryService'

const { t } = useI18n()

const terms = ref<any[]>([])
const loadingTerms = ref(false)

async function loadGlossary() {
  loadingTerms.value = true
  try {
    const response = await glossaryService.getGlossaryTerms()
    const items = response?.['hydra:member'] ?? response?.items ?? response ?? []
    terms.value = Array.isArray(items)
      ? items.map((term) => ({
          ...term,
          id: term.id,
          term: term.name || term.term,
          definition: term.definition || term.description,
          language: term.language || term.lang,
        }))
      : []
  } catch (error) {
    console.warn('[Glossary] Failed to load terms', error)
    terms.value = []
  } finally {
    loadingTerms.value = false
  }
}

const filters = reactive({ query: '', language: 'Tous' })

const modalState = reactive({
  create: false,
  update: false,
  import: false,
  export: false,
})

const activeTerm = ref<typeof terms.value[number] | null>(null)
const termPayload = reactive({ term: '', definition: '', language: 'Français' })
const importPayload = reactive({ file: '' })

const headers = [
  { title: t('Terme'), key: 'term' },
  { title: t('Définition'), key: 'definition' },
  { title: t('Langue'), key: 'language', width: 140 },
  { title: t('Actions'), key: 'actions', sortable: false, width: 180 },
]

onMounted(loadGlossary)

const filteredTerms = computed(() =>
  terms.value.filter((item) => {
    const matchQuery =
      !filters.query ||
      item.term.toLowerCase().includes(filters.query.toLowerCase()) ||
      item.definition.toLowerCase().includes(filters.query.toLowerCase())
    const matchLang = filters.language === 'Tous' || item.language === filters.language
    return matchQuery && matchLang
  }),
)

function openCreate() {
  termPayload.term = ''
  termPayload.definition = ''
  termPayload.language = 'Français'
  modalState.create = true
}

function openUpdate(item) {
  activeTerm.value = { ...item }
  modalState.update = true
}

function openImport() {
  modalState.import = true
}

function openExport() {
  modalState.export = true
}

async function saveTerm() {
  if (!termPayload.term || !termPayload.definition) return
  try {
    await glossaryService.createGlossaryTerm({
      name: termPayload.term,
      definition: termPayload.definition,
      language: termPayload.language,
    })
    await loadGlossary()
  } catch (error) {
    console.warn('[Glossary] Failed to create term', error)
  } finally {
    modalState.create = false
  }
}

async function saveUpdate() {
  if (!activeTerm.value) return
  try {
    await glossaryService.updateGlossaryTerm(activeTerm.value.id, {
      ...activeTerm.value,
    })
    await loadGlossary()
  } catch (error) {
    console.warn('[Glossary] Failed to update term', error)
  } finally {
    modalState.update = false
  }
}

async function removeTerm(item) {
  try {
    await glossaryService.deleteTerm(item.id)
    await loadGlossary()
  } catch (error) {
    console.warn('[Glossary] Failed to delete term', error)
  }
}

async function importGlossary() {
  modalState.import = false
  importPayload.file = ''
}

async function exportGlossary() {
  modalState.export = false
}
</script>

<template>
  <div class="glossary-page">
    <div class="glossary-page__header">
      <div>
        <p class="text-caption text-medium-emphasis mb-1">{{ t('Espace glossaire centralisé') }}</p>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">{{ t('Glossaire') }}</h1>
        <p class="text-body-2 text-medium-emphasis">
          {{ t('Importez, exportez, créez ou modifiez les termes dans des modals sur une seule page.') }}
        </p>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-btn color="primary" variant="flat" @click="openCreate">
          <v-icon icon="mdi-plus" start />
          {{ t('Ajouter un terme') }}
        </v-btn>
        <v-btn color="secondary" variant="tonal" @click="openImport">
          <v-icon icon="mdi-database-import" start />
          {{ t('Importer') }}
        </v-btn>
        <v-btn color="secondary" variant="tonal" @click="openExport">
          <v-icon icon="mdi-database-export" start />
          {{ t('Exporter') }}
        </v-btn>
      </div>
    </div>

    <AppCard class="pa-4" elevation="2">
      <div class="d-flex flex-wrap align-center gap-3 mb-4">
        <v-text-field
          v-model="filters.query"
          :label="t('Rechercher')"
          prepend-inner-icon="mdi-magnify"
          hide-details
          density="comfortable"
          class="flex-grow-1"
        />
        <v-select
          v-model="filters.language"
          :items="['Tous', 'Français', 'Anglais']"
          :label="t('Langue')"
          hide-details
          density="comfortable"
          style="max-width: 220px"
        />
      </div>

      <v-data-table :items="filteredTerms" :headers="headers" density="comfortable" class="elevation-0">
        <template #item.definition="{ item }">
          <span class="text-body-2">{{ item?.raw?.definition ?? '—' }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn icon variant="text" size="small" @click="openUpdate(item.raw)">
              <v-icon icon="mdi-pencil-outline" size="20" />
            </v-btn>
            <v-btn icon variant="text" size="small" color="error" @click="removeTerm(item.raw)">
              <v-icon icon="mdi-delete-outline" size="20" />
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </AppCard>

    <AppModal
      v-model="modalState.create"
      :title="t('Créer un terme')"
      :icon="'mdi-plus'"
      max-width="680"
      scrollable
    >
      <v-form class="pa-2" @submit.prevent="saveTerm">
        <v-text-field v-model="termPayload.term" :label="t('Terme')" required />
        <v-textarea v-model="termPayload.definition" :label="t('Définition')" rows="4" auto-grow required />
        <v-select v-model="termPayload.language" :items="['Français', 'Anglais']" :label="t('Langue')" />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.create = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" type="submit">{{ t('Enregistrer') }}</v-btn>
        </div>
      </v-form>
    </AppModal>

    <AppModal
      v-model="modalState.update"
      :title="t('Mettre à jour le terme')"
      :icon="'mdi-pencil-outline'"
      max-width="680"
      scrollable
    >
      <div v-if="activeTerm" class="pa-2">
        <v-text-field v-model="activeTerm.term" :label="t('Terme')" />
        <v-textarea v-model="activeTerm.definition" :label="t('Définition')" rows="4" auto-grow />
        <v-select v-model="activeTerm.language" :items="['Français', 'Anglais']" :label="t('Langue')" />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.update = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="saveUpdate">{{ t('Mettre à jour') }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.import"
      :title="t('Importer un glossaire')"
      :icon="'mdi-database-import'"
      max-width="640"
      scrollable
    >
      <div class="pa-2">
        <v-text-field
          v-model="importPayload.file"
          :label="t('Fichier ou chemin')"
          prepend-inner-icon="mdi-file-import"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.import = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="importGlossary">{{ t('Importer') }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.export"
      :title="t('Exporter le glossaire')"
      :icon="'mdi-database-export'"
      max-width="520"
      scrollable
    >
      <div class="pa-2">
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ t('Générez un fichier pour partager ou sauvegarder votre glossaire complet.') }}
        </p>
        <div class="d-flex justify-end gap-2">
          <v-btn variant="text" @click="modalState.export = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="exportGlossary">{{ t('Exporter') }}</v-btn>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.glossary-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.glossary-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  border-radius: var(--app-rounded, 22px);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(0, 0, 0, 0.02));
  border: 1px solid rgba(var(--v-border-color), 0.1);
}
</style>
