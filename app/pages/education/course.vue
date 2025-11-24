<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from '#imports'
import AppCard from '~/components/App/AppCard.vue'
import AppModal from '~/components/App/AppModal.vue'
import baseService from '~/services/baseService'
import courseService from '~/services/courseService'

const { t } = useI18n()

const courses = ref<any[]>([])
const loadingCourses = ref(false)

async function loadCourses() {
  loadingCourses.value = true
  try {
    const response = await courseService.listAll({ page: 1, itemsPerPage: 50 })
    const items = response?.items ?? response?.['hydra:member'] ?? []

    courses.value = items.map((course) => ({
      ...course,
      id: course.id,
      title: course.title || course.name || t('Sans titre'),
      code: course.code || course.visualCode || course.codeNumber,
      visibility: course.visibility || (course.isPublic ? t('Public') : t('Privé')),
      startDate: course.startDate || course.creationDate,
      seats:
        course.registeredStudents ||
        course.users?.length ||
        course.maxStudents ||
        course.subscription?.users,
    }))
  } catch (error) {
    console.warn('[Course] Failed to load courses', error)
    courses.value = []
  } finally {
    loadingCourses.value = false
  }
}

const learnerCourses = computed(() =>
  courses.value.map((course) => ({
    ...course,
    seats: undefined,
    visibility: course.visibility === 'Public' ? t('Ouvert') : t('Restreint'),
  })),
)

const modalState = reactive({
  create: false,
  detail: false,
  edit: false,
  addUser: false,
  addDocument: false,
})

const activeCourse = ref<typeof courses.value[number] | null>(null)
const newCourse = reactive({
  title: '',
  code: '',
  startDate: '',
  visibility: 'Public',
  description: '',
})

const linkPayload = reactive({ user: '', document: '' })

const headers = [
  { title: t('Titre'), key: 'title' },
  { title: t('Code'), key: 'code' },
  { title: t('Visibilité'), key: 'visibility' },
  { title: t('Date de début'), key: 'startDate' },
  { title: t('Places'), key: 'seats', align: 'center' },
  { title: t('Actions'), key: 'actions', sortable: false, align: 'end' },
]

onMounted(loadCourses)

function openCreateModal() {
  modalState.create = true
}

function openDetail(item) {
  activeCourse.value = item
  modalState.detail = true
}

function openEdit(item) {
  activeCourse.value = { ...item }
  modalState.edit = true
}

function openAddUser(item) {
  activeCourse.value = item
  modalState.addUser = true
}

function openAddDocument(item) {
  activeCourse.value = item
  modalState.addDocument = true
}

async function saveCreatedCourse() {
  if (!newCourse.title || !newCourse.code) return
  try {
    await courseService.createCourse({ ...newCourse })
    await loadCourses()
  } catch (error) {
    console.warn('[Course] Failed to create course', error)
  } finally {
    modalState.create = false
    newCourse.title = ''
    newCourse.code = ''
    newCourse.startDate = ''
    newCourse.visibility = 'Public'
    newCourse.description = ''
  }
}

async function saveEditedCourse() {
  if (!activeCourse.value) return
  try {
    await baseService.put(`/api/courses/${activeCourse.value.id}`, {
      ...activeCourse.value,
    })
    await loadCourses()
  } catch (error) {
    console.warn('[Course] Failed to update course', error)
  } finally {
    modalState.edit = false
  }
}

async function removeCourse(item) {
  try {
    await baseService.delete(`/api/courses/${item.id}`)
    await loadCourses()
  } catch (error) {
    console.warn('[Course] Failed to delete course', error)
  }
}

function addUserToCourse() {
  modalState.addUser = false
  linkPayload.user = ''
}

function addDocumentToCourse() {
  modalState.addDocument = false
  linkPayload.document = ''
}
</script>

<template>
  <div class="course-page">
    <div class="page-header">
      <div>
        <p class="text-caption text-medium-emphasis mb-1">
          {{ t('Espace cours centralisé') }}
        </p>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">{{ t('Cours') }}</h1>
        <p class="text-body-2 text-medium-emphasis">
          {{ t('Liste, création et gestion des cours sur une seule page via des modals.') }}
        </p>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-btn color="primary" variant="flat" @click="openCreateModal">
          <v-icon icon="mdi-plus" start />
          {{ t('Créer un cours') }}
        </v-btn>
      </div>
    </div>

    <div class="page-grid">
      <AppCard class="pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ t('Vue administration') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('Pilotez les cours, les participants et les ressources depuis une table unique.') }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="courses"
          :headers="headers"
          density="comfortable"
          class="elevation-0"
        >
          <template #item.seats="{ item }">
            <v-chip color="primary" variant="tonal" size="small">
              {{ item?.raw?.seats ?? '—' }}
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
              <v-btn icon variant="text" size="small" color="error" @click="removeCourse(item.raw)">
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
              {{ t('Accès apprenant simplifié aux cours actifs.') }}
            </div>
          </div>
        </div>

        <v-data-table
          :items="learnerCourses"
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
      :title="t('Créer un cours')"
      :icon="'mdi-plus'"
      max-width="720"
      scrollable
    >
      <v-form class="pa-2" @submit.prevent="saveCreatedCourse">
        <v-text-field v-model="newCourse.title" :label="t('Titre')" required />
        <v-text-field v-model="newCourse.code" :label="t('Code')" required />
        <v-text-field v-model="newCourse.startDate" :label="t('Date de début')" type="date" />
        <v-select
          v-model="newCourse.visibility"
          :items="['Public', 'Privé']"
          :label="t('Visibilité')"
        />
        <v-textarea
          v-model="newCourse.description"
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
      :title="activeCourse?.title || t('Détail du cours')"
      :icon="'mdi-eye-outline'"
      max-width="680"
      scrollable
    >
        <div v-if="activeCourse" class="py-4 px-2">
        <div class="mb-2 text-body-2 text-medium-emphasis">ID: {{ activeCourse.id }}</div>
        <div class="text-subtitle-1 font-weight-bold mb-1">{{ activeCourse.title }}</div>
        <div class="text-body-2 mb-3">{{ t('Code') }}: {{ activeCourse.code }}</div>
        <div class="text-body-2 mb-3">{{ t('Visibilité') }}: {{ activeCourse.visibility }}</div>
        <div class="text-body-2 mb-3">
          {{ t('Date de début') }}:
          <strong>{{ activeCourse.startDate || '—' }}</strong>
        </div>
        <div class="text-body-2 text-medium-emphasis">
          {{ t('Utilisez les actions pour modifier, inviter ou documenter ce cours.') }}
        </div>
      </div>
    </AppModal>

    <AppModal
      v-model="modalState.edit"
      :title="t('Modifier le cours')"
      :icon="'mdi-pencil-outline'"
      max-width="720"
      scrollable
    >
      <div v-if="activeCourse" class="pa-2">
        <v-text-field v-model="activeCourse.title" :label="t('Titre')" />
        <v-text-field v-model="activeCourse.code" :label="t('Code')" />
        <v-text-field v-model="activeCourse.startDate" :label="t('Date de début')" type="date" />
        <v-select
          v-model="activeCourse.visibility"
          :items="['Public', 'Privé']"
          :label="t('Visibilité')"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.edit = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="saveEditedCourse">{{ t('Mettre à jour') }}</v-btn>
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
        <div v-if="activeCourse" class="pa-2">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Associer un participant au cours') }}: {{ activeCourse.title }}
        </div>
        <v-text-field
          v-model="linkPayload.user"
          :label="t('Identifiant utilisateur ou email')"
          prepend-inner-icon="mdi-account"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.addUser = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="addUserToCourse">{{ t('Ajouter') }}</v-btn>
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
        <div v-if="activeCourse" class="pa-2">
        <div class="text-body-2 text-medium-emphasis mb-3">
          {{ t('Attacher un document au cours') }}: {{ activeCourse.title }}
        </div>
        <v-text-field
          v-model="linkPayload.document"
          :label="t('Lien ou référence de document')"
          prepend-inner-icon="mdi-file"
        />
        <div class="d-flex justify-end mt-4 gap-2">
          <v-btn variant="text" @click="modalState.addDocument = false">{{ t('Annuler') }}</v-btn>
          <v-btn color="primary" @click="addDocumentToCourse">{{ t('Ajouter') }}</v-btn>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.course-page {
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
