<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import AppModal from '~/components/App/AppModal.vue'
import documentsService from '~/services/documents'

const { t } = useI18n()

const documents = ref<any[]>([])
const loadingDocuments = ref(false)

async function loadDocuments() {
  loadingDocuments.value = true
  try {
    const response = await documentsService.findAll()
    const items =
      response?.['hydra:member'] ?? response?.items ?? response ?? []
    documents.value = Array.isArray(items)
      ? items.map((doc) => ({
          ...doc,
          id: doc.id,
          title: doc.title || doc.name,
          type: doc.type || doc.filetype,
          owner: doc.owner?.username || doc.owner || doc.uploader,
          tags: doc.tags || doc.keywords,
        }))
      : []
  } catch (error) {
    console.warn('[Documents] Failed to load documents', error)
    documents.value = []
  } finally {
    loadingDocuments.value = false
  }
}

const libraryDocuments = computed(() =>
  documents.value.map((doc) => ({
    ...doc,
    owner: doc.owner === 'Admin' ? 'Médiathèque' : doc.owner,
  })),
)

const modalState = reactive({
  create: false,
  upload: false,
  detail: false,
  edit: false,
  variation: false,
})

const activeDocument = ref<(typeof documents.value)[number] | null>(null)
const newDocument = reactive({
  title: '',
  type: 'PDF',
  tags: '',
  owner: 'Admin',
})
const uploadPayload = reactive({ fileName: '', target: 'Admin' })
const variationPayload = reactive({ variationTitle: '', notes: '' })

const headers = [
  { title: t('Titre'), key: 'title' },
  { title: t('Type'), key: 'type', width: 120 },
  { title: t('Propriétaire'), key: 'owner', width: 140 },
  { title: t('Tags'), key: 'tags' },
  { title: t('Actions'), key: 'actions', sortable: false, width: 200 },
]

onMounted(loadDocuments)

function openCreateModal() {
  modalState.create = true
}

function openUploadModal() {
  modalState.upload = true
}

function openDetail(item) {
  activeDocument.value = item
  modalState.detail = true
}

function openEdit(item) {
  activeDocument.value = { ...item }
  modalState.edit = true
}

function openVariation(item) {
  activeDocument.value = item
  modalState.variation = true
}

async function saveCreatedDocument() {
  if (!newDocument.title) return
  try {
    await documentsService.create({
      ...newDocument,
      tags: newDocument.tags,
    })
    await loadDocuments()
  } catch (error) {
    console.warn('[Documents] Failed to create document', error)
  } finally {
    modalState.create = false
    newDocument.title = ''
    newDocument.type = 'PDF'
    newDocument.tags = ''
    newDocument.owner = 'Admin'
  }
}

async function saveEditedDocument() {
  if (!activeDocument.value) return
  const iri =
    activeDocument.value['@id'] || `/api/documents/${activeDocument.value.id}`
  try {
    await documentsService.update({ ...activeDocument.value, '@id': iri })
    await loadDocuments()
  } catch (error) {
    console.warn('[Documents] Failed to update document', error)
  } finally {
    modalState.edit = false
  }
}

async function removeDocument(item) {
  const iri = item?.['@id'] || `/api/documents/${item?.id}`
  try {
    await documentsService.del({ '@id': iri })
    await loadDocuments()
  } catch (error) {
    console.warn('[Documents] Failed to delete document', error)
  }
}

function uploadDocument() {
  if (!uploadPayload.fileName) return
  const nextId = Math.max(...documents.value.map((d) => d.id)) + 1
  documents.value.push({
    id: nextId,
    title: uploadPayload.fileName,
    type: 'Fichier',
    owner: uploadPayload.target,
    tags: ['upload'],
  })
  modalState.upload = false
  uploadPayload.fileName = ''
  uploadPayload.target = 'Admin'
}

function addVariation() {
  modalState.variation = false
  variationPayload.variationTitle = ''
  variationPayload.notes = ''
}
</script>

<template>
  <div class="documents-page">
    <div class="documents-page__header">
      <div>
        <p class="text-caption text-medium-emphasis mb-1">
          {{ t('Espace documents centralisé') }}
        </p>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">
          {{ t('Documents') }}
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          {{
            t(
              'Toutes les actions (liste, création, variation, upload, édition) sont disponibles depuis cette page unique.',
            )
          }}
        </p>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-btn color="primary" variant="flat" @click="openCreateModal">
          <v-icon icon="mdi-plus" start />
          {{ t('Créer un document') }}
        </v-btn>
        <v-btn color="secondary" variant="tonal" @click="openUploadModal">
          <v-icon icon="mdi-upload" start />
          {{ t('Téléverser un fichier') }}
        </v-btn>
      </div>
    </div>

    <div class="documents-page__grid">
      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ t('Vue administration') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{
                t(
                  'Gestion des documents maîtres et variations pour les enseignants.',
                )
              }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="documents"
          :headers="headers"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.tags="{ item }">
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                v-for="tag in item?.raw?.tags ?? []"
                :key="tag"
                size="x-small"
                color="primary"
                variant="tonal"
              >
                {{ tag }}
              </v-chip>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openDetail(item.raw)"
              >
                <v-icon icon="mdi-eye-outline" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openEdit(item.raw)"
              >
                <v-icon icon="mdi-pencil-outline" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="secondary"
                @click="openVariation(item.raw)"
              >
                <v-icon icon="mdi-shape" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="error"
                @click="removeDocument(item.raw)"
              >
                <v-icon icon="mdi-delete-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>

      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ t('Vue médiathèque') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{
                t(
                  'Sélection des documents prêts à être intégrés aux cours ou HTML editor.',
                )
              }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="libraryDocuments"
          :headers="headers"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.tags="{ item }">
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                v-for="tag in item?.raw?.tags ?? []"
                :key="tag"
                size="x-small"
                color="primary"
                variant="tonal"
              >
                {{ tag }}
              </v-chip>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openDetail(item.raw)"
              >
                <v-icon icon="mdi-eye-outline" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="secondary"
                @click="openVariation(item.raw)"
              >
                <v-icon icon="mdi-file-document-edit-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>
    </div>

    <AppModal
      v-model="modalState.create"
      :title="t('Créer un document')"
      :icon="'mdi-plus'"
      max-width="720"
      scrollable
    >
      <v-form class="pa-2" @submit.prevent="saveCreatedDocument">
        <v-text-field
          v-model="newDocument.title"
          :label="t('Titre')"
          required
        />
        <v-select
          v-model="newDocument.type"
          :items="['PDF', 'DOCX', 'PPTX', 'Lien', 'Fichier']"
          :label="t('Type')"
        />
        <v-select
          v-model="newDocument.owner"
          :items="['Admin', 'Éducation']"
          :label="t('Espace')"
        />
        <v-text-field
          v-model="newDocument.tags"
          :label="t('Tags (séparés par des virgules)')"
          prepend-inner-icon="mdi-tag"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.create = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" type="submit">{{ t('Enregistrer') }}</v-btn>
        </div>
      </v-form>
    </AppModal>

    <AppModal
      v-model="modalState.upload"
      :title="t('Téléverser un fichier')"
      :icon="'mdi-upload'"
      max-width="640"
      scrollable
    >
      <div class="pa-2">
        <v-text-field
          v-model="uploadPayload.fileName"
          :label="t('Nom du fichier ou lien')"
          prepend-inner-icon="mdi-file"
        />
        <v-select
          v-model="uploadPayload.target"
          :items="['Admin', 'Éducation']"
          :label="t('Destination')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.upload = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" @click="uploadDocument">{{
            t('Ajouter')
          }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.detail"
      :title="activeDocument?.title || t('Détail du document')"
      :icon="'mdi-eye-outline'"
      max-width="680"
      scrollable
    >
      <div v-if="activeDocument" class="py-4 px-2">
        <div class="mb-2 text-body-2 text-medium-emphasis">
          ID: {{ activeDocument.id }}
        </div>
        <div class="text-subtitle-1 font-weight-bold mb-1">
          {{ activeDocument.title }}
        </div>
        <div class="text-body-2 mb-3">
          {{ t('Type') }}: {{ activeDocument.type }}
        </div>
        <div class="text-body-2 mb-3">
          {{ t('Propriétaire') }}: {{ activeDocument.owner }}
        </div>
        <div class="d-flex flex-wrap gap-1 mb-3">
          <v-chip
            v-for="tag in activeDocument.tags"
            :key="tag"
            size="x-small"
            color="primary"
            variant="tonal"
          >
            {{ tag }}
          </v-chip>
        </div>
        <div class="text-body-2 text-medium-emphasis">
          {{
            t(
              'Prévisualisez ou insérez ce document directement depuis cette fenêtre.',
            )
          }}
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.edit"
      :title="t('Modifier le document')"
      :icon="'mdi-pencil-outline'"
      max-width="720"
      scrollable
    >
      <div v-if="activeDocument" class="pa-2">
        <v-text-field v-model="activeDocument.title" :label="t('Titre')" />
        <v-text-field v-model="activeDocument.type" :label="t('Type')" />
        <v-text-field
          v-model="activeDocument.owner"
          :label="t('Propriétaire')"
          prepend-inner-icon="mdi-account"
        />
        <v-combobox
          v-model="activeDocument.tags"
          :label="t('Tags')"
          chips
          multiple
          prepend-inner-icon="mdi-tag"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.edit = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" @click="saveEditedDocument">{{
            t('Mettre à jour')
          }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.variation"
      :title="t('Ajouter une variation / HTML')"
      :icon="'mdi-shape'"
      max-width="720"
      scrollable
    >
      <div v-if="activeDocument" class="pa-2">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Préparez une déclinaison ou un contenu pour l’éditeur HTML') }}:
          {{ activeDocument.title }}
        </div>
        <v-text-field
          v-model="variationPayload.variationTitle"
          :label="t('Nom de la variation')"
          prepend-inner-icon="mdi-creation"
        />
        <v-textarea
          v-model="variationPayload.notes"
          :label="t('Notes / instructions')"
          rows="3"
          auto-grow
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.variation = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" @click="addVariation">{{
            t('Enregistrer')
          }}</v-btn>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.documents-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.documents-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  border-radius: var(--app-rounded, 22px);
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.08),
    rgba(0, 0, 0, 0.02)
  );
  border: 1px solid rgba(var(--v-border-color), 0.1);
}

.documents-page__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
</style>
