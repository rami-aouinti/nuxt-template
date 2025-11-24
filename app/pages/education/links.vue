<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import AppModal from '~/components/App/AppModal.vue'

const { t } = useI18n()

const linkCategories = ref([
  { id: 1, name: 'Ressources', visibility: 'Public' },
  { id: 2, name: 'Révisions', visibility: 'Privé' },
])

const links = ref([
  { id: 1, title: 'Documentation Vuetify', url: 'https://vuetifyjs.com', category: 'Ressources' },
  { id: 2, title: 'Portail campus', url: 'https://campus.local', category: 'Révisions' },
])

const modalState = reactive({
  createLink: false,
  updateLink: false,
  createCategory: false,
  updateCategory: false,
})

const activeLink = ref<(typeof links.value)[number] | null>(null)
const activeCategory = ref<(typeof linkCategories.value)[number] | null>(null)
const linkPayload = reactive({ title: '', url: '', category: '' })
const categoryPayload = reactive({ name: '', visibility: 'Public' })

const linkHeaders = [
  { title: t('Titre'), key: 'title' },
  { title: t('URL'), key: 'url' },
  { title: t('Catégorie'), key: 'category', width: 140 },
  { title: t('Actions'), key: 'actions', sortable: false, width: 170 },
]

const categoryHeaders = [
  { title: t('Nom'), key: 'name' },
  { title: t('Visibilité'), key: 'visibility', width: 140 },
  { title: t('Actions'), key: 'actions', sortable: false, width: 160 },
]

function openCreateLink() {
  linkPayload.title = ''
  linkPayload.url = ''
  linkPayload.category = linkCategories.value[0]?.name || ''
  modalState.createLink = true
}

function openUpdateLink(item) {
  activeLink.value = { ...item }
  modalState.updateLink = true
}

function openCreateCategory() {
  categoryPayload.name = ''
  categoryPayload.visibility = 'Public'
  modalState.createCategory = true
}

function openUpdateCategory(item) {
  activeCategory.value = { ...item }
  modalState.updateCategory = true
}

function saveLink() {
  if (!linkPayload.title || !linkPayload.url) return
  const nextId = Math.max(...links.value.map((link) => link.id)) + 1
  links.value.push({ id: nextId, ...linkPayload })
  modalState.createLink = false
}

function saveLinkUpdate() {
  if (!activeLink.value) return
  links.value = links.value.map((link) => (link.id === activeLink.value?.id ? { ...activeLink.value } : link))
  modalState.updateLink = false
}

function removeLink(item) {
  links.value = links.value.filter((link) => link.id !== item.id)
}

function saveCategory() {
  if (!categoryPayload.name) return
  const nextId = Math.max(...linkCategories.value.map((cat) => cat.id)) + 1
  linkCategories.value.push({ id: nextId, ...categoryPayload })
  modalState.createCategory = false
}

function saveCategoryUpdate() {
  if (!activeCategory.value) return
  linkCategories.value = linkCategories.value.map((cat) =>
    cat.id === activeCategory.value?.id ? { ...activeCategory.value } : cat,
  )
  modalState.updateCategory = false
}

function removeCategory(item) {
  linkCategories.value = linkCategories.value.filter((cat) => cat.id !== item.id)
}
</script>

<template>
  <div class="links-page">
    <div class="links-page__header">
      <div>
        <p class="text-caption text-medium-emphasis mb-1">{{ t('Espace liens centralisé') }}</p>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">{{ t('Liens') }}</h1>
        <p class="text-body-2 text-medium-emphasis">
          {{ t('Ajoutez, classez et mettez à jour vos liens et catégories dans des modals sur une seule page.') }}
        </p>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-btn color="primary" variant="flat" @click="openCreateLink">
          <v-icon icon="mdi-plus" start />
          {{ t('Nouveau lien') }}
        </v-btn>
        <v-btn color="secondary" variant="tonal" @click="openCreateCategory">
          <v-icon icon="mdi-folder-plus" start />
          {{ t('Nouvelle catégorie') }}
        </v-btn>
      </div>
    </div>

    <div class="links-page__grid">
      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ t('Liens disponibles') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('Inventaire des liens partagés aux apprenants et administrateurs.') }}
            </div>
          </div>
        </div>

        <v-data-table :items="links" :headers="linkHeaders" density="comfortable" class="elevation-0">
          <template #item.url="{ item }">
            <a :href="item.raw.url" target="_blank" rel="noopener" class="text-primary">
              {{ item.raw.url }}
            </a>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn icon variant="text" size="small" @click="openUpdateLink(item.raw)">
                <v-icon icon="mdi-pencil-outline" size="20" />
              </v-btn>
              <v-btn icon variant="text" size="small" color="error" @click="removeLink(item.raw)">
                <v-icon icon="mdi-delete-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>

      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ t('Catégories') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('Gérez les catégories de liens avec leur visibilité.') }}
            </div>
          </div>
        </div>

        <v-data-table :items="linkCategories" :headers="categoryHeaders" density="comfortable" class="elevation-0">
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn icon variant="text" size="small" @click="openUpdateCategory(item.raw)">
                <v-icon icon="mdi-pencil-outline" size="20" />
              </v-btn>
              <v-btn icon variant="text" size="small" color="error" @click="removeCategory(item.raw)">
                <v-icon icon="mdi-delete-outline" size="20" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </AppCard>
    </div>

    <AppModal
      v-model="modalState.createLink"
      :title="t('Créer un lien')"
      :icon="'mdi-plus'"
      max-width="640"
      scrollable
    >
      <v-form class="pa-2" @submit.prevent="saveLink">
        <v-text-field v-model="linkPayload.title" :label="t('Titre')" required />
        <v-text-field v-model="linkPayload.url" :label="t('URL')" required />
        <v-select
          v-model="linkPayload.category"
          :items="linkCategories.map((cat) => cat.name)"
          :label="t('Catégorie')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.createLink = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" type="submit">{{ t('Enregistrer') }}</v-btn>
        </div>
      </v-form>
    </AppModal>

    <AppModal
      v-model="modalState.updateLink"
      :title="t('Mettre à jour le lien')"
      :icon="'mdi-pencil-outline'"
      max-width="640"
      scrollable
    >
      <div v-if="activeLink" class="pa-2">
        <v-text-field v-model="activeLink.title" :label="t('Titre')" />
        <v-text-field v-model="activeLink.url" :label="t('URL')" />
        <v-select
          v-model="activeLink.category"
          :items="linkCategories.map((cat) => cat.name)"
          :label="t('Catégorie')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.updateLink = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="saveLinkUpdate">{{ t('Mettre à jour') }}</v-btn>
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
        <v-select v-model="categoryPayload.visibility" :items="['Public', 'Privé']" :label="t('Visibilité')" />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.createCategory = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="saveCategory">{{ t('Enregistrer') }}</v-btn>
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
        <v-select v-model="activeCategory.visibility" :items="['Public', 'Privé']" :label="t('Visibilité')" />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.updateCategory = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="saveCategoryUpdate">{{ t('Mettre à jour') }}</v-btn>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.links-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.links-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  border-radius: var(--app-rounded, 22px);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(0, 0, 0, 0.02));
  border: 1px solid rgba(var(--v-border-color), 0.1);
}

.links-page__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
</style>
