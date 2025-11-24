<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import AppModal from '~/components/App/AppModal.vue'
import linkService from '~/services/linkService'

const { t } = useI18n()

const linkCategories = ref<any[]>([])
const links = ref<any[]>([])
const loadingLinks = ref(false)
const loadingCategories = ref(false)

async function loadCategories() {
  loadingCategories.value = true
  try {
    const data = await linkService.getCategories(0)
    linkCategories.value = Array.isArray(data)
      ? data.map((category) => ({
          ...category,
          id: category.id,
          name: category.title || category.name,
          visibility: category.visibility || category.access || t('Inconnu'),
        }))
      : []
  } catch (error) {
    console.warn('[Links] Failed to load categories', error)
    linkCategories.value = []
  } finally {
    loadingCategories.value = false
  }
}

async function loadLinks() {
  loadingLinks.value = true
  try {
    const data = await linkService.getLinks()
    const items = data?.items ?? data?.['hydra:member'] ?? data ?? []
    links.value = Array.isArray(items)
      ? items.map((link) => ({
          ...link,
          id: link.id,
          title: link.title || link.name,
          url: link.url,
          category: link.category?.title || link.category?.name,
        }))
      : []
  } catch (error) {
    console.warn('[Links] Failed to load links', error)
    links.value = []
  } finally {
    loadingLinks.value = false
  }
}

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

onMounted(() => {
  loadCategories()
  loadLinks()
})

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

async function saveLink() {
  if (!linkPayload.title || !linkPayload.url) return
  try {
    await linkService.createLink({
      title: linkPayload.title,
      url: linkPayload.url,
      category: linkPayload.category,
    })
    await loadLinks()
  } catch (error) {
    console.warn('[Links] Failed to create link', error)
  } finally {
    modalState.createLink = false
  }
}

async function saveLinkUpdate() {
  if (!activeLink.value) return
  try {
    await linkService.updateLink(activeLink.value.id, { ...activeLink.value })
    await loadLinks()
  } catch (error) {
    console.warn('[Links] Failed to update link', error)
  } finally {
    modalState.updateLink = false
  }
}

async function removeLink(item) {
  try {
    await linkService.deleteLink(item.id)
    await loadLinks()
  } catch (error) {
    console.warn('[Links] Failed to delete link', error)
  }
}

async function saveCategory() {
  if (!categoryPayload.name) return
  try {
    await linkService.createCategory({
      title: categoryPayload.name,
      visibility: categoryPayload.visibility,
    })
    await loadCategories()
  } catch (error) {
    console.warn('[Links] Failed to create category', error)
  } finally {
    modalState.createCategory = false
  }
}

async function saveCategoryUpdate() {
  if (!activeCategory.value) return
  try {
    await linkService.updateCategory(activeCategory.value.id, {
      ...activeCategory.value,
    })
    await loadCategories()
  } catch (error) {
    console.warn('[Links] Failed to update category', error)
  } finally {
    modalState.updateCategory = false
  }
}

async function removeCategory(item) {
  try {
    await linkService.deleteCategory(item.id)
    await loadCategories()
  } catch (error) {
    console.warn('[Links] Failed to delete category', error)
  }
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
          <a
            :href="item?.raw?.url || '#'"
            target="_blank"
            rel="noopener"
            class="text-primary"
          >
            {{ item?.raw?.url ?? '—' }}
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
