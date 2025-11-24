<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import AppModal from '~/components/App/AppModal.vue'

const { t } = useI18n()

const adminAssignments = ref([
  {
    id: 1,
    title: 'Devoir 1',
    status: 'Publié',
    deadline: '2024-05-20',
    submissions: 12,
  },
  {
    id: 2,
    title: 'Projet final',
    status: 'Brouillon',
    deadline: '2024-06-15',
    submissions: 3,
  },
])

const educationAssignments = computed(() =>
  adminAssignments.value.map((assignment) => ({
    ...assignment,
    submissions: undefined,
  })),
)

const modalState = reactive({
  create: false,
  detail: false,
  edit: false,
  addUser: false,
  addDocument: false,
})

const activeAssignment = ref<typeof adminAssignments.value[number] | null>(null)
const newAssignment = reactive({ title: '', deadline: '', description: '' })
const linkPayload = reactive({ user: '', document: '' })

const headers = [
  { title: t('Titre'), key: 'title' },
  { title: t('Statut'), key: 'status' },
  { title: t('Deadline'), key: 'deadline' },
  { title: t('Submissions'), key: 'submissions', align: 'center' },
  { title: t('Actions'), key: 'actions', sortable: false, align: 'end' },
]

function openCreateModal() {
  modalState.create = true
}

function openDetail(item) {
  activeAssignment.value = item
  modalState.detail = true
}

function openEdit(item) {
  activeAssignment.value = { ...item }
  modalState.edit = true
}

function openAddUser(item) {
  activeAssignment.value = item
  modalState.addUser = true
}

function openAddDocument(item) {
  activeAssignment.value = item
  modalState.addDocument = true
}

function saveCreatedAssignment() {
  if (!newAssignment.title) return
  const nextId = Math.max(...adminAssignments.value.map((a) => a.id)) + 1
  adminAssignments.value.push({
    id: nextId,
    title: newAssignment.title,
    status: 'Brouillon',
    deadline: newAssignment.deadline,
    submissions: 0,
  })
  modalState.create = false
  newAssignment.title = ''
  newAssignment.deadline = ''
  newAssignment.description = ''
}

function saveEditedAssignment() {
  if (!activeAssignment.value) return
  const index = adminAssignments.value.findIndex(
    (item) => item.id === activeAssignment.value?.id,
  )
  if (index >= 0) {
    adminAssignments.value[index] = { ...activeAssignment.value }
  }
  modalState.edit = false
}

function removeAssignment(item) {
  adminAssignments.value = adminAssignments.value.filter((row) => row.id !== item.id)
}

function addUserToAssignment() {
  modalState.addUser = false
  linkPayload.user = ''
}

function addDocumentToAssignment() {
  modalState.addDocument = false
  linkPayload.document = ''
}
</script>

<template>
  <div class="assignments-page">
    <div class="assignments-page__header">
      <div>
        <p class="text-caption text-medium-emphasis mb-1">
          {{ t('Espace assignments centralisé') }}
        </p>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">
          {{ t('Assignments') }}
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          {{
            t(
              'Tous les flux (liste, création, ajout utilisateur/document) réunis dans une seule page avec des modals.',
            )
          }}
        </p>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-btn color="primary" variant="flat" @click="openCreateModal">
          <v-icon icon="mdi-plus" start />
          {{ t('Créer un devoir') }}
        </v-btn>
      </div>
    </div>

    <div class="assignments-page__grid">
      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ t('Vue administration') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('Gestion des devoirs, utilisateurs et documents depuis une table unique.') }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="adminAssignments"
          :headers="headers"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.submissions="{ item }">
            <v-chip color="primary" variant="tonal" size="small">
              {{ item.raw.submissions ?? '—' }}
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
              <v-btn icon variant="text" size="small" color="primary" @click="openAddUser(item.raw)">
                <v-icon icon="mdi-account-plus-outline" size="20" />
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
              <v-btn icon variant="text" size="small" color="error" @click="removeAssignment(item.raw)">
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
              {{ t('Accès simplifié aux devoirs pour les apprenants.') }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="educationAssignments"
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
      :title="t('Créer un devoir')"
      :icon="'mdi-plus'"
      max-width="720"
      scrollable
    >
      <v-form class="pa-2" @submit.prevent="saveCreatedAssignment">
        <v-text-field v-model="newAssignment.title" :label="t('Titre')" required />
        <v-text-field v-model="newAssignment.deadline" :label="t('Deadline')" type="date" />
        <v-textarea
          v-model="newAssignment.description"
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
      :title="activeAssignment?.title || t('Détail du devoir')"
      :icon="'mdi-eye-outline'"
      max-width="680"
      scrollable
    >
      <div class="py-4 px-2" v-if="activeAssignment">
        <div class="mb-2 text-body-2 text-medium-emphasis">ID: {{ activeAssignment.id }}</div>
        <div class="text-subtitle-1 font-weight-bold mb-1">{{ activeAssignment.title }}</div>
        <div class="text-body-2 mb-3">{{ t('Statut') }}: {{ activeAssignment.status }}</div>
        <div class="text-body-2 mb-3">
          {{ t('Deadline') }}:
          <strong>{{ activeAssignment.deadline || '—' }}</strong>
        </div>
        <div class="text-body-2 text-medium-emphasis">
          {{ t('Utilisez les autres actions pour modifier ou enrichir ce devoir.') }}
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.edit"
      :title="t('Modifier le devoir')"
      :icon="'mdi-pencil-outline'"
      max-width="720"
      scrollable
    >
      <div v-if="activeAssignment" class="pa-2">
        <v-text-field v-model="activeAssignment.title" :label="t('Titre')" />
        <v-text-field v-model="activeAssignment.deadline" :label="t('Deadline')" type="date" />
        <v-select
          v-model="activeAssignment.status"
          :items="['Publié', 'Brouillon']"
          :label="t('Statut')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.edit = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="saveEditedAssignment">{{ t('Mettre à jour') }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.addUser"
      :title="t('Ajouter un utilisateur')"
      :icon="'mdi-account-plus-outline'"
      max-width="640"
      scrollable
    >
      <div class="pa-2" v-if="activeAssignment">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Associer un apprenant au devoir') }}: {{ activeAssignment.title }}
        </div>
        <v-text-field
          v-model="linkPayload.user"
          :label="t('Identifiant utilisateur ou email')"
          prepend-inner-icon="mdi-account"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.addUser = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="addUserToAssignment">{{ t('Ajouter') }}</v-btn>
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
      <div class="pa-2" v-if="activeAssignment">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Attacher un document au devoir') }}: {{ activeAssignment.title }}
        </div>
        <v-text-field
          v-model="linkPayload.document"
          :label="t('Lien ou référence de document')"
          prepend-inner-icon="mdi-file"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.addDocument = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="addDocumentToAssignment">{{ t('Ajouter') }}</v-btn>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.assignments-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assignments-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  border-radius: var(--app-rounded, 22px);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(0, 0, 0, 0.02));
  border: 1px solid rgba(var(--v-border-color), 0.1);
}

.assignments-page__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
</style>
