<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
import { useAdminStore } from '~/stores/admin'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'CRM Management',
  icon: 'mdi-briefcase-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = useServerAuthRequestHeaders()
const adminStore = useAdminStore()
const crmStore = useCrmStore()

const {
  crmProjects,
  crmProjectsPending,
  crmProjectsError,
  crmTasks,
  crmTasksPending,
  crmTasksError,
  crmProjectCount,
  crmTaskCount,
} = storeToRefs(adminStore)

const clientCollection = crmStore.clients
const contactTypeCollection = crmStore.contactTypes
const projectStatusCollection = crmStore.projectStatuses
const projectTypeCollection = crmStore.projectTypes
const taskStatusCollection = crmStore.taskStatuses
const documentCollection = crmStore.documents

await Promise.all([
  clientCollection.fetch(),
  contactTypeCollection.fetch(),
  projectStatusCollection.fetch(),
  projectTypeCollection.fetch(),
  taskStatusCollection.fetch(),
  documentCollection.fetch(),
])

await Promise.all([
  adminStore.fetchCrmProjects(),
  adminStore.fetchCrmTasks(),
  adminStore.fetchCrmProjectCount(),
  adminStore.fetchCrmTaskCount(),
])

const projectForm = reactive({
  name: '',
  clientIri: '',
  statusIri: '',
  typeIri: '',
})
const taskForm = reactive({
  name: '',
  projectIri: '',
  assigneeId: '',
  deadline: '',
  timeEstimated: 0,
  timeSpent: 0,
  statusIri: '',
})
const clientForm = reactive({
  name: '',
  description: '',
  contactValue: '',
  contactTypeIri: '',
})
const documentForm = reactive({ name: '', clientIri: '', projectIri: '' })

const projectActionLoading = ref(false)
const taskActionLoading = ref(false)

const projectCountDisplay = computed(() => crmProjectCount.value ?? 0)
const taskCountDisplay = computed(() => crmTaskCount.value ?? 0)

const projectItems = computed(() => crmProjects.value ?? [])
const taskItems = computed(() => crmTasks.value ?? [])
const clientItems = computed(() => clientCollection.data.value?.member ?? [])
const documentItems = computed(() => documentCollection.data.value?.member ?? [])
const projectStatusOptions = computed(
  () => projectStatusCollection.data.value?.member ?? [],
)
const projectTypeOptions = computed(() => projectTypeCollection.data.value?.member ?? [])
const taskStatusOptions = computed(() => taskStatusCollection.data.value?.member ?? [])
const contactTypeOptions = computed(() => contactTypeCollection.data.value?.member ?? [])
const projectOptions = computed(() => projectItems.value)
const clientValue = (item: Record<string, any>) =>
  item?.['@id'] || (item?.id ? `/api/clients/${item.id}` : '')
const projectValue = (item: Record<string, any>) =>
  item?.['@id'] || (item?.id ? `/api/projects/${item.id}` : '')
const projectStatusValue = (item: Record<string, any>) =>
  item?.['@id'] || (item?.id ? `/api/project_statuses/${item.id}` : '')
const projectTypeValue = (item: Record<string, any>) =>
  item?.['@id'] || (item?.id ? `/api/project_types/${item.id}` : '')
const taskStatusValue = (item: Record<string, any>) =>
  item?.['@id'] || (item?.id ? `/api/task_statuses/${item.id}` : '')
const contactTypeValue = (item: Record<string, any>) =>
  item?.['@id'] || (item?.id ? `/api/contact_types/${item.id}` : '')

function resetProjectForm() {
  projectForm.name = ''
  projectForm.clientIri = ''
  projectForm.statusIri = ''
  projectForm.typeIri = ''
}

function resetTaskForm() {
  taskForm.name = ''
  taskForm.projectIri = ''
  taskForm.assigneeId = ''
  taskForm.deadline = ''
  taskForm.timeEstimated = 0
  taskForm.timeSpent = 0
  taskForm.statusIri = ''
}

function resetClientForm() {
  clientForm.name = ''
  clientForm.description = ''
  clientForm.contactValue = ''
  clientForm.contactTypeIri = ''
}

function resetDocumentForm() {
  documentForm.name = ''
  documentForm.clientIri = ''
  documentForm.projectIri = ''
}

async function handleCreateClient() {
  if (!clientForm.name.trim()) {
    Notify.error('Le nom du client est requis.')
    return
  }

  projectActionLoading.value = true

  try {
    const createdClient = await $fetch<Record<string, any>>('/api/crm/clients', {
      method: 'POST',
      headers: requestHeaders,
      credentials: 'include',
      body: {
        name: clientForm.name,
        description: clientForm.description || undefined,
      },
    })

    const clientIri = createdClient['@id'] || '/api/clients/' + createdClient.id

    if (clientForm.contactValue.trim()) {
      await $fetch('/api/crm/contacts', {
        method: 'POST',
        headers: requestHeaders,
        credentials: 'include',
        body: {
          value: clientForm.contactValue,
          contactType: clientForm.contactTypeIri || undefined,
          client: clientIri,
        },
      })
    }

    Notify.success('Client ajouté avec succès')
    resetClientForm()
    await Promise.all([
      clientCollection.refresh(),
      crmStore.contacts.refresh(),
      adminStore.refreshCrmProjects(),
    ])
  } catch (error) {
    console.error(error)
    Notify.error('Impossible de créer le client CRM')
  } finally {
    projectActionLoading.value = false
  }
}

async function handleCreateProject() {
  if (!projectForm.name.trim()) {
    Notify.error('Le nom du projet est requis.')
    return
  }

  projectActionLoading.value = true

  try {
    await $fetch('/api/v1/crm/projects', {
      method: 'POST',
      headers: requestHeaders,
      credentials: 'include',
      body: {
        name: projectForm.name,
        client: projectForm.clientIri || undefined,
        status: projectForm.statusIri || undefined,
        type: projectForm.typeIri || undefined,
      },
    })

    Notify.success('Projet créé avec succès')
    resetProjectForm()
    await Promise.all([
      adminStore.refreshCrmProjects(),
      adminStore.refreshCrmProjectCount(),
      projectStatusCollection.refresh(),
      projectTypeCollection.refresh(),
    ])
  } catch (error) {
    console.error(error)
    Notify.error("Impossible de créer le projet CRM")
  } finally {
    projectActionLoading.value = false
  }
}

async function handleDeleteProject(id: number) {
  projectActionLoading.value = true

  try {
    await $fetch(`/api/v1/crm/projects/${id}`, {
      method: 'DELETE',
      headers: requestHeaders,
      credentials: 'include',
    })

    Notify.success('Projet supprimé')
    await Promise.all([
      adminStore.refreshCrmProjects(),
      adminStore.refreshCrmProjectCount(),
    ])
  } catch (error) {
    console.error(error)
    Notify.error("Suppression du projet impossible")
  } finally {
    projectActionLoading.value = false
  }
}

async function handleCreateTask() {
  if (!taskForm.name.trim()) {
    Notify.error('Le nom de la tâche est requis.')
    return
  }

  taskActionLoading.value = true

  try {
    await $fetch('/api/v1/crm/tasks', {
      method: 'POST',
      headers: requestHeaders,
      credentials: 'include',
      body: {
        name: taskForm.name,
        project: taskForm.projectIri || undefined,
        assignee: taskForm.assigneeId
          ? `/api/users/${taskForm.assigneeId}`
          : undefined,
        deadline: taskForm.deadline || undefined,
        timeEstimated:
          typeof taskForm.timeEstimated === 'number'
            ? taskForm.timeEstimated
            : undefined,
        timeSpent:
          typeof taskForm.timeSpent === 'number' ? taskForm.timeSpent : undefined,
        status: taskForm.statusIri || undefined,
      },
    })

    Notify.success('Tâche créée avec succès')
    resetTaskForm()
    await Promise.all([
      adminStore.refreshCrmTasks(),
      adminStore.refreshCrmTaskCount(),
      taskStatusCollection.refresh(),
    ])
  } catch (error) {
    console.error(error)
    Notify.error('Impossible de créer la tâche CRM')
  } finally {
    taskActionLoading.value = false
  }
}

async function handleCreateDocument() {
  if (!documentForm.name.trim()) {
    Notify.error('Le nom du document est requis.')
    return
  }

  projectActionLoading.value = true

  try {
    await $fetch('/api/crm/documents', {
      method: 'POST',
      headers: requestHeaders,
      credentials: 'include',
      body: {
        name: documentForm.name,
        client: documentForm.clientIri || undefined,
        projects: documentForm.projectIri ? [documentForm.projectIri] : undefined,
      },
    })

    Notify.success('Document ajouté avec succès')
    resetDocumentForm()
    await documentCollection.refresh()
  } catch (error) {
    console.error(error)
    Notify.error('Impossible de créer le document CRM')
  } finally {
    projectActionLoading.value = false
  }
}

async function handleDeleteTask(id: number) {
  taskActionLoading.value = true

  try {
    await $fetch(`/api/v1/crm/tasks/${id}`, {
      method: 'DELETE',
      headers: requestHeaders,
      credentials: 'include',
    })

    Notify.success('Tâche supprimée')
    await Promise.all([
      adminStore.refreshCrmTasks(),
      adminStore.refreshCrmTaskCount(),
    ])
  } catch (error) {
    console.error(error)
    Notify.error('Suppression de la tâche impossible')
  } finally {
    taskActionLoading.value = false
  }
}
</script>

<template>
  <v-container fluid>
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="text-subtitle-1 font-weight-bold">Projets CRM</div>
            <div class="text-h5">{{ projectCountDisplay }}</div>
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis">
              Suivi des projets synchronisés avec le CRM Bro World.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="text-subtitle-1 font-weight-bold">Tâches CRM</div>
            <div class="text-h5">{{ taskCountDisplay }}</div>
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis">
              Tâches liées aux projets côté CRM avec mise en cache Redis.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title>Clients et contacts</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleCreateClient">
              <v-text-field
                v-model="clientForm.name"
                label="Nom du client"
                density="comfortable"
                class="mb-3"
              />
              <v-textarea
                v-model="clientForm.description"
                label="Description"
                rows="2"
                auto-grow
                density="comfortable"
                class="mb-3"
              />
              <v-select
                v-model="clientForm.contactTypeIri"
                :items="contactTypeOptions"
                item-title="name"
                :item-value="contactTypeValue"
                label="Type de contact"
                density="comfortable"
                class="mb-3"
                clearable
              />
              <v-text-field
                v-model="clientForm.contactValue"
                label="Contact (optionnel)"
                density="comfortable"
                class="mb-4"
              />
              <v-btn
                type="submit"
                color="primary"
                :loading="projectActionLoading"
                block
              >
                Ajouter le client
              </v-btn>
            </v-form>

            <v-data-table
              :items="clientItems"
              :loading="clientCollection.pending.value"
              class="mt-4"
              :headers="[
                { title: 'ID', key: 'id', width: 80 },
                { title: 'Nom', key: 'name' },
                { title: 'Contacts', key: 'contacts', sortable: false },
              ]"
            >
              <template #item.contacts="{ item }">
                <v-chip color="primary" variant="tonal">
                  {{ item.raw.contacts?.length ?? 0 }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title>Documents</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleCreateDocument">
              <v-text-field
                v-model="documentForm.name"
                label="Nom du document"
                density="comfortable"
                class="mb-3"
              />
              <v-select
                v-model="documentForm.clientIri"
                :items="clientItems"
                item-title="name"
                :item-value="clientValue"
                label="Client"
                density="comfortable"
                class="mb-3"
                clearable
              />
              <v-select
                v-model="documentForm.projectIri"
                :items="projectOptions"
                item-title="name"
                :item-value="projectValue"
                label="Projet lié"
                density="comfortable"
                class="mb-4"
                clearable
              />
              <v-btn
                type="submit"
                color="primary"
                :loading="projectActionLoading"
                block
              >
                Ajouter le document
              </v-btn>
            </v-form>

            <v-data-table
              :items="documentItems"
              :loading="documentCollection.pending.value"
              class="mt-4"
              :headers="[
                { title: 'ID', key: 'id', width: 80 },
                { title: 'Nom', key: 'name' },
                { title: 'Client', key: 'client.name' },
                { title: 'Projets', key: 'projects', sortable: false },
              ]"
            >
              <template #item.projects="{ item }">
                <v-chip color="secondary" variant="tonal">
                  {{ item.raw.projects?.length ?? 0 }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title>Créer / gérer des projets</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleCreateProject">
              <v-text-field
                v-model="projectForm.name"
                label="Nom"
                density="comfortable"
                class="mb-3"
              />
              <v-select
                v-model="projectForm.clientIri"
                :items="clientItems"
                item-title="name"
                :item-value="clientValue"
                label="Client"
                density="comfortable"
                class="mb-3"
                clearable
              />
              <v-select
                v-model="projectForm.statusIri"
                :items="projectStatusOptions"
                item-title="name"
                :item-value="projectStatusValue"
                label="Statut"
                density="comfortable"
                class="mb-3"
                clearable
              />
              <v-select
                v-model="projectForm.typeIri"
                :items="projectTypeOptions"
                item-title="name"
                :item-value="projectTypeValue"
                label="Type"
                density="comfortable"
                class="mb-4"
                clearable
              />
              <v-btn
                type="submit"
                color="primary"
                :loading="projectActionLoading"
                block
              >
                Ajouter le projet
              </v-btn>
            </v-form>

            <v-alert
              v-if="crmProjectsError"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              Échec du chargement des projets.
            </v-alert>

            <v-data-table
              :items="projectItems"
              :loading="crmProjectsPending"
              class="mt-4"
              :headers="[
                { title: 'ID', key: 'id', width: 80 },
                { title: 'Nom', key: 'name' },
                { title: 'Client', key: 'client.name' },
                { title: 'Statut', key: 'status.name' },
                { title: 'Type', key: 'type.name' },
                { title: 'Actions', key: 'actions', sortable: false, width: 120 },
              ]"
            >
              <template #item.actions="{ item }">
                <v-btn
                  color="error"
                  variant="text"
                  size="small"
                  :loading="projectActionLoading"
                  @click="handleDeleteProject(item.raw.id)"
                >
                  Supprimer
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title>Créer / gérer des tâches</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleCreateTask">
              <v-text-field
                v-model="taskForm.name"
                label="Nom"
                density="comfortable"
                class="mb-3"
              />
              <v-select
                v-model="taskForm.projectIri"
                :items="projectOptions"
                item-title="name"
                :item-value="projectValue"
                label="Projet"
                density="comfortable"
                class="mb-3"
                clearable
              />
              <v-text-field
                v-model="taskForm.assigneeId"
                label="Assigné (User ID)"
                type="number"
                density="comfortable"
                class="mb-3"
              />
              <v-text-field
                v-model="taskForm.deadline"
                label="Deadline (ISO)"
                density="comfortable"
                class="mb-3"
              />
              <v-select
                v-model="taskForm.statusIri"
                :items="taskStatusOptions"
                item-title="name"
                :item-value="taskStatusValue"
                label="Statut"
                density="comfortable"
                class="mb-3"
                clearable
              />
              <v-text-field
                v-model.number="taskForm.timeEstimated"
                label="Temps estimé"
                type="number"
                density="comfortable"
                class="mb-3"
              />
              <v-text-field
                v-model.number="taskForm.timeSpent"
                label="Temps passé"
                type="number"
                density="comfortable"
                class="mb-4"
              />
              <v-btn
                type="submit"
                color="primary"
                :loading="taskActionLoading"
                block
              >
                Ajouter la tâche
              </v-btn>
            </v-form>

            <v-alert
              v-if="crmTasksError"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              Échec du chargement des tâches.
            </v-alert>

            <v-data-table
              :items="taskItems"
              :loading="crmTasksPending"
              class="mt-4"
              :headers="[
                { title: 'ID', key: 'id', width: 80 },
                { title: 'Nom', key: 'name' },
                { title: 'Projet', key: 'project.name' },
                { title: 'Assigné', key: 'assignee.name' },
                { title: 'Statut', key: 'status.name' },
                { title: 'Actions', key: 'actions', sortable: false, width: 120 },
              ]"
            >
              <template #item.actions="{ item }">
                <v-btn
                  color="error"
                  variant="text"
                  size="small"
                  :loading="taskActionLoading"
                  @click="handleDeleteTask(item.raw.id)"
                >
                  Supprimer
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
