<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import AppModal from '~/components/App/AppModal.vue'
import dropboxService from '~/services/dropbox'

const { t } = useI18n()

const receivedItems = ref<any[]>([])
const sentItems = ref<any[]>([])
const categories = ref<any[]>([])
const loadingDropbox = ref(false)
const loadingCategories = ref(false)

async function loadDropbox() {
  loadingDropbox.value = true
  try {
    const [received, sent] = await Promise.all([
      dropboxService.listFiles({ area: 'received' }),
      dropboxService.listFiles({ area: 'sent' }),
    ])

    receivedItems.value = (received?.items ?? received ?? []).map((item) => ({
      ...item,
      id: item.id,
      title: item.title || item.name,
      status: item.status || item.state,
      dueDate: item.dueDate || item.deadline,
    }))

    sentItems.value = (sent?.items ?? sent ?? []).map((item) => ({
      ...item,
      id: item.id,
      title: item.title || item.name,
      status: item.status || item.state,
      dueDate: item.dueDate || item.deadline,
    }))
  } catch (error) {
    console.warn('[Dropbox] Failed to load files', error)
    receivedItems.value = []
    sentItems.value = []
  } finally {
    loadingDropbox.value = false
  }
}

async function loadDropboxCategories() {
  loadingCategories.value = true
  try {
    const data = await dropboxService.listCategories({ area: 'sent' })
    categories.value = (data?.items ?? data ?? []).map((category) => ({
      ...category,
      id: category.id,
      name: category.title || category.name,
      visibility: category.visibility || category.access,
    }))
  } catch (error) {
    console.warn('[Dropbox] Failed to load categories', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

const modalState = reactive({
  create: false,
  feedback: false,
  move: false,
  update: false,
  createCategory: false,
  updateCategory: false,
})

const activeItem = ref<(typeof receivedItems.value)[number] | null>(null)
const activeCategory = ref<(typeof categories.value)[number] | null>(null)
const newDropbox = reactive({ title: '', dueDate: '', status: 'En attente' })
const feedbackPayload = reactive({ message: '' })
const movePayload = reactive({ destination: '' })
const categoryPayload = reactive({ name: '', visibility: 'Public' })

const headers = [
  { title: t('Titre'), key: 'title' },
  { title: t('Statut'), key: 'status', width: 140 },
  { title: t('Date limite'), key: 'dueDate', width: 140 },
  { title: t('Actions'), key: 'actions', sortable: false, width: 200 },
]

const categoryHeaders = [
  { title: t('Nom'), key: 'name' },
  { title: t('Visibilité'), key: 'visibility', width: 140 },
  { title: t('Actions'), key: 'actions', sortable: false, width: 160 },
]

onMounted(() => {
  loadDropbox()
  loadDropboxCategories()
})

function openCreateModal() {
  modalState.create = true
}

function openFeedback(item) {
  activeItem.value = item
  modalState.feedback = true
}

function openMove(item) {
  activeItem.value = item
  modalState.move = true
}

function openUpdate(item) {
  activeItem.value = { ...item }
  modalState.update = true
}

function openCategoryCreate() {
  modalState.createCategory = true
}

function openCategoryUpdate(item) {
  activeCategory.value = { ...item }
  modalState.updateCategory = true
}

function saveDropbox() {
  if (!newDropbox.title) return
  const nextId =
    Math.max(
      ...receivedItems.value.map((d) => d.id),
      ...sentItems.value.map((d) => d.id),
    ) + 1
  sentItems.value.push({ id: nextId, ...newDropbox })
  modalState.create = false
  newDropbox.title = ''
  newDropbox.dueDate = ''
  newDropbox.status = 'En attente'
}

function saveUpdate() {
  if (!activeItem.value) return
  const list = [...receivedItems.value, ...sentItems.value]
  const index = list.findIndex((item) => item.id === activeItem.value?.id)
  if (index >= 0) {
    const listRef = receivedItems.value.find(
      (i) => i.id === activeItem.value?.id,
    )
      ? receivedItems
      : sentItems
    listRef.value = listRef.value.map((item) =>
      item.id === activeItem.value?.id ? { ...activeItem.value } : item,
    )
  }
  modalState.update = false
}

function addFeedback() {
  modalState.feedback = false
  feedbackPayload.message = ''
}

function moveItem() {
  modalState.move = false
  movePayload.destination = ''
}

function saveCategory() {
  if (!categoryPayload.name) return
  const nextId = Math.max(...categories.value.map((c) => c.id)) + 1
  categories.value.push({ id: nextId, ...categoryPayload })
  modalState.createCategory = false
  categoryPayload.name = ''
  categoryPayload.visibility = 'Public'
}

function updateCategory() {
  if (!activeCategory.value) return
  categories.value = categories.value.map((cat) =>
    cat.id === activeCategory.value?.id ? { ...activeCategory.value } : cat,
  )
  modalState.updateCategory = false
}

function removeCategory(item) {
  categories.value = categories.value.filter((cat) => cat.id !== item.id)
}
</script>

<template>
  <div class="dropbox-page">
    <div class="dropbox-page__header">
      <div>
        <p class="text-caption text-medium-emphasis mb-1">
          {{ t('Espace dropbox centralisé') }}
        </p>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">
          {{ t('Dropbox') }}
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          {{
            t(
              'Envoyez, recevez, classez et déplacez les remises depuis cette page unique via des modals.',
            )
          }}
        </p>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-btn color="primary" variant="flat" @click="openCreateModal">
          <v-icon icon="mdi-plus" start />
          {{ t('Créer une remise') }}
        </v-btn>
        <v-btn color="secondary" variant="tonal" @click="openCategoryCreate">
          <v-icon icon="mdi-folder-plus" start />
          {{ t('Catégorie') }}
        </v-btn>
      </div>
    </div>

    <div class="dropbox-page__grid">
      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ t('Reçus') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{
                t(
                  'Tous les devoirs déposés par les apprenants avec feedback rapide.',
                )
              }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="receivedItems"
          :headers="headers"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.status="{ item }">
            <v-chip
              :color="item.raw.status === 'Validé' ? 'success' : 'warning'"
              variant="tonal"
              size="small"
            >
              {{ item.raw.status }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                icon
                variant="text"
                size="small"
                color="primary"
                @click="openFeedback(item.raw)"
              >
                <v-icon icon="mdi-message-reply-text" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openMove(item.raw)"
              >
                <v-icon icon="mdi-folder-move" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openUpdate(item.raw)"
              >
                <v-icon icon="mdi-pencil-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>

      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ t('Envoyés') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{
                t(
                  'Suivi des remises envoyées par les enseignants ou apprenants.',
                )
              }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="sentItems"
          :headers="headers"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.status="{ item }">
            <v-chip
              :color="item.raw.status === 'Envoyé' ? 'primary' : 'info'"
              variant="tonal"
              size="small"
            >
              {{ item.raw.status }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                icon
                variant="text"
                size="small"
                color="primary"
                @click="openFeedback(item.raw)"
              >
                <v-icon icon="mdi-message-outline" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openMove(item.raw)"
              >
                <v-icon icon="mdi-folder-move" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openUpdate(item.raw)"
              >
                <v-icon icon="mdi-pencil-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>

      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ t('Catégories') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{
                t('Organisez vos remises avec des catégories et visibilités.')
              }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="categories"
          :headers="categoryHeaders"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openCategoryUpdate(item.raw)"
              >
                <v-icon icon="mdi-pencil-outline" size="20" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="error"
                @click="removeCategory(item.raw)"
              >
                <v-icon icon="mdi-delete-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>
    </div>

    <AppModal
      v-model="modalState.create"
      :title="t('Créer une remise')"
      :icon="'mdi-plus'"
      max-width="680"
      scrollable
    >
      <v-form class="pa-2" @submit.prevent="saveDropbox">
        <v-text-field v-model="newDropbox.title" :label="t('Titre')" required />
        <v-text-field
          v-model="newDropbox.dueDate"
          :label="t('Date limite')"
          type="date"
        />
        <v-select
          v-model="newDropbox.status"
          :items="['En attente', 'Envoyé', 'Validé']"
          :label="t('Statut')"
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
      v-model="modalState.feedback"
      :title="t('Donner un feedback')"
      :icon="'mdi-message-reply-text'"
      max-width="680"
      scrollable
    >
      <div v-if="activeItem" class="pa-2">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Répondre à la remise') }}: {{ activeItem.title }}
        </div>
        <v-textarea
          v-model="feedbackPayload.message"
          :label="t('Message')"
          rows="4"
          auto-grow
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.feedback = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" @click="addFeedback">{{ t('Envoyer') }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.move"
      :title="t('Déplacer la remise')"
      :icon="'mdi-folder-move'"
      max-width="640"
      scrollable
    >
      <div v-if="activeItem" class="pa-2">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Choisir la destination pour') }}: {{ activeItem.title }}
        </div>
        <v-text-field
          v-model="movePayload.destination"
          :label="t('Dossier / catégorie')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.move = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" @click="moveItem">{{ t('Déplacer') }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.update"
      :title="t('Mettre à jour la remise')"
      :icon="'mdi-pencil-outline'"
      max-width="680"
      scrollable
    >
      <div v-if="activeItem" class="pa-2">
        <v-text-field v-model="activeItem.title" :label="t('Titre')" />
        <v-text-field
          v-model="activeItem.dueDate"
          :label="t('Date limite')"
          type="date"
        />
        <v-select
          v-model="activeItem.status"
          :items="['En attente', 'Envoyé', 'Validé']"
          :label="t('Statut')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.update = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" @click="saveUpdate">{{
            t('Mettre à jour')
          }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.createCategory"
      :title="t('Créer une catégorie')"
      :icon="'mdi-folder-plus'"
      max-width="600"
      scrollable
    >
      <div class="pa-2">
        <v-text-field v-model="categoryPayload.name" :label="t('Nom')" />
        <v-select
          v-model="categoryPayload.visibility"
          :items="['Public', 'Privé']"
          :label="t('Visibilité')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.createCategory = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" @click="saveCategory">{{
            t('Enregistrer')
          }}</v-btn>
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.updateCategory"
      :title="t('Mettre à jour la catégorie')"
      :icon="'mdi-folder-edit-outline'"
      max-width="600"
      scrollable
    >
      <div v-if="activeCategory" class="pa-2">
        <v-text-field v-model="activeCategory.name" :label="t('Nom')" />
        <v-select
          v-model="activeCategory.visibility"
          :items="['Public', 'Privé']"
          :label="t('Visibilité')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.updateCategory = false">{{
            t('Annuler')
          }}</v-btn>
          <v-btn color="primary" @click="updateCategory">{{
            t('Mettre à jour')
          }}</v-btn>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.dropbox-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dropbox-page__header {
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

.dropbox-page__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
</style>
