<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import AppModal from '~/components/App/AppModal.vue'

const { t } = useI18n()

const categories = ref([
  {
    id: 201,
    name: 'Technologie',
    code: 'TECH',
    courses: 12,
    visibility: 'Public',
  },
  {
    id: 202,
    name: 'Gestion',
    code: 'BUS',
    courses: 8,
    visibility: 'Privé',
  },
])

const learnerCategories = computed(() =>
  categories.value.map((category) => ({
    ...category,
    courses: undefined,
    visibility: category.visibility === 'Public' ? t('Ouvert') : t('Restreint'),
  })),
)

const modalState = reactive({
  create: false,
  detail: false,
  edit: false,
  addCourse: false,
  addDocument: false,
})

const activeCategory = ref<typeof categories.value[number] | null>(null)
const newCategory = reactive({ name: '', code: '', description: '', visibility: 'Public' })

const linkPayload = reactive({ course: '', document: '' })

const headers = [
  { title: t('Nom'), key: 'name' },
  { title: t('Code'), key: 'code' },
  { title: t('Visibilité'), key: 'visibility' },
  { title: t('Cours'), key: 'courses', align: 'center' },
  { title: t('Actions'), key: 'actions', sortable: false, align: 'end' },
]

function openCreateModal() {
  modalState.create = true
}

function openDetail(item) {
  activeCategory.value = item
  modalState.detail = true
}

function openEdit(item) {
  activeCategory.value = { ...item }
  modalState.edit = true
}

function openAddCourse(item) {
  activeCategory.value = item
  modalState.addCourse = true
}

function openAddDocument(item) {
  activeCategory.value = item
  modalState.addDocument = true
}

function saveCreatedCategory() {
  if (!newCategory.name || !newCategory.code) return
  const nextId = Math.max(...categories.value.map((c) => c.id)) + 1
  categories.value.push({
    id: nextId,
    name: newCategory.name,
    code: newCategory.code,
    courses: 0,
    visibility: newCategory.visibility,
  })
  modalState.create = false
  newCategory.name = ''
  newCategory.code = ''
  newCategory.description = ''
  newCategory.visibility = 'Public'
}

function saveEditedCategory() {
  if (!activeCategory.value) return
  const index = categories.value.findIndex((item) => item.id === activeCategory.value?.id)
  if (index >= 0) {
    categories.value[index] = { ...activeCategory.value }
  }
  modalState.edit = false
}

function removeCategory(item) {
  categories.value = categories.value.filter((row) => row.id !== item.id)
}

function addCourseToCategory() {
  modalState.addCourse = false
  linkPayload.course = ''
}

function addDocumentToCategory() {
  modalState.addDocument = false
  linkPayload.document = ''
}
</script>

<template>
  <div class="category-page">
    <div class="page-header">
      <div>
        <p class="text-caption text-medium-emphasis mb-1">{{ t('Espace catégories') }}</p>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">{{ t('Catégories de cours') }}</h1>
        <p class="text-body-2 text-medium-emphasis">
          {{ t('Organisation des catégories avec actions show, edit, delete et créations en modals.') }}
        </p>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-btn color="primary" variant="flat" @click="openCreateModal">
          <v-icon icon="mdi-plus" start />
          {{ t('Créer une catégorie') }}
        </v-btn>
      </div>
    </div>

    <div class="page-grid">
      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ t('Vue administration') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('Pilotez les catégories, rattachez des cours ou documents depuis la table.') }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="categories"
          :headers="headers"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.courses="{ item }">
            <v-chip color="primary" variant="tonal" size="small">
              {{ item.raw.courses ?? '—' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn icon variant="text" size="small" @click="openDetail(item.raw)">
                <v-icon icon="mdi-eye-outline" size="20" />
              </v-btn>
              <v-btn icon variant="text" size="small" @click="openEdit(item.raw)">
                <v-icon icon="mdi-pencil-outline" size="20" />
              </v-btn>
              <v-btn icon variant="text" size="small" color="primary" @click="openAddCourse(item.raw)">
                <v-icon icon="mdi-book-plus-outline" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="secondary"
                @click="openAddDocument(item.raw)"
              >
                <v-icon icon="mdi-file-plus-outline" size="20" />
              </v-btn>
              <v-btn icon variant="text" size="small" color="error" @click="removeCategory(item.raw)">
                <v-icon icon="mdi-delete-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>

      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ t('Vue éducation') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('Consultation rapide des catégories visibles pour les apprenants.') }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="learnerCategories"
          :headers="headers"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn icon variant="text" size="small" @click="openDetail(item.raw)">
                <v-icon icon="mdi-eye-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>
    </div>

    <AppModal
      v-model="modalState.create"
      :title="t('Créer une catégorie')"
      :icon="'mdi-plus'"
      max-width="720"
      scrollable
    >
      <v-form class="pa-2" @submit.prevent="saveCreatedCategory">
        <v-text-field v-model="newCategory.name" :label="t('Nom')" required />
        <v-text-field v-model="newCategory.code" :label="t('Code')" required />
        <v-select
          v-model="newCategory.visibility"
          :items="['Public', 'Privé']"
          :label="t('Visibilité')"
        />
        <v-textarea
          v-model="newCategory.description"
          :label="t('Description')"
          rows="4"
          auto-grow
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.create = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" type="submit">{{ t('Enregistrer') }}</v-btn>
        </div>
      </v-form>
    </AppModal>

    <AppModal
      v-model="modalState.detail"
      :title="activeCategory?.name || t('Détail de la catégorie')"
      :icon="'mdi-eye-outline'"
      max-width="680"
      scrollable
    >
      <div v-if="activeCategory" class="py-4 px-2">
        <div class="mb-2 text-body-2 text-medium-emphasis">ID: {{ activeCategory.id }}</div>
        <div class="text-subtitle-1 font-weight-bold mb-1">{{ activeCategory.name }}</div>
        <div class="text-body-2 mb-3">{{ t('Code') }}: {{ activeCategory.code }}</div>
        <div class="text-body-2 mb-3">{{ t('Visibilité') }}: {{ activeCategory.visibility }}</div>
        <div class="text-body-2 text-medium-emphasis">
          {{ t('Utilisez les actions pour modifier, ajouter des cours ou des documents.') }}
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.edit"
      :title="t('Modifier la catégorie')"
      :icon="'mdi-pencil-outline'"
      max-width="720"
      scrollable
    >
      <div v-if="activeCategory" class="pa-2">
        <v-text-field v-model="activeCategory.name" :label="t('Nom')" />
        <v-text-field v-model="activeCategory.code" :label="t('Code')" />
        <v-select
          v-model="activeCategory.visibility"
          :items="['Public', 'Privé']"
          :label="t('Visibilité')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.edit = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="saveEditedCategory">{{ t('Mettre à jour') }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.addCourse"
      :title="t('Associer un cours')"
      :icon="'mdi-book-plus-outline'"
      max-width="640"
      scrollable
    >
      <div v-if="activeCategory" class="pa-2">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Ajouter un cours à la catégorie') }}: {{ activeCategory.name }}
        </div>
        <v-text-field
          v-model="linkPayload.course"
          :label="t('Code du cours ou titre')"
          prepend-inner-icon="mdi-book"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.addCourse = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="addCourseToCategory">{{ t('Ajouter') }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.addDocument"
      :title="t('Ajouter un document')"
      :icon="'mdi-file-plus-outline'"
      max-width="640"
      scrollable
    >
      <div v-if="activeCategory" class="pa-2">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Attacher un document à la catégorie') }}: {{ activeCategory.name }}
        </div>
        <v-text-field
          v-model="linkPayload.document"
          :label="t('Lien ou référence de document')"
          prepend-inner-icon="mdi-file"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.addDocument = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="addDocumentToCategory">{{ t('Ajouter') }}</v-btn>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.category-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  border-radius: var(--app-rounded, 22px);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(0, 0, 0, 0.02));
  border: 1px solid rgba(var(--v-border-color), 0.1);
}

.page-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
</style>
