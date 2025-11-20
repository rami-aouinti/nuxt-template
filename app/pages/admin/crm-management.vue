<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
import { useAdminStore } from '~/stores/admin'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'CRM Management',
  icon: 'mdi-briefcase-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = useServerAuthRequestHeaders()
const adminStore = useAdminStore()
const notify = Notify()

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

await Promise.all([
  adminStore.fetchCrmProjects(),
  adminStore.fetchCrmTasks(),
  adminStore.fetchCrmProjectCount(),
  adminStore.fetchCrmTaskCount(),
])

const projectForm = reactive({ name: '', clientId: '' })
const taskForm = reactive({
  name: '',
  projectId: '',
  assigneeId: '',
  deadline: '',
  timeEstimated: 0,
  timeSpent: 0,
})

const projectActionLoading = ref(false)
const taskActionLoading = ref(false)

const projectCountDisplay = computed(() => crmProjectCount.value ?? 0)
const taskCountDisplay = computed(() => crmTaskCount.value ?? 0)

const projectItems = computed(() => crmProjects.value ?? [])
const taskItems = computed(() => crmTasks.value ?? [])

function resetProjectForm() {
  projectForm.name = ''
  projectForm.clientId = ''
}

function resetTaskForm() {
  taskForm.name = ''
  taskForm.projectId = ''
  taskForm.assigneeId = ''
  taskForm.deadline = ''
  taskForm.timeEstimated = 0
  taskForm.timeSpent = 0
}

async function handleCreateProject() {
  if (!projectForm.name.trim()) {
    notify.error('Le nom du projet est requis.')
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
        client: projectForm.clientId
          ? `/api/clients/${projectForm.clientId}`
          : undefined,
      },
    })

    notify.success('Projet créé avec succès')
    resetProjectForm()
    await Promise.all([
      adminStore.refreshCrmProjects(),
      adminStore.refreshCrmProjectCount(),
    ])
  } catch (error) {
    console.error(error)
    notify.error("Impossible de créer le projet CRM")
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

    notify.success('Projet supprimé')
    await Promise.all([
      adminStore.refreshCrmProjects(),
      adminStore.refreshCrmProjectCount(),
    ])
  } catch (error) {
    console.error(error)
    notify.error("Suppression du projet impossible")
  } finally {
    projectActionLoading.value = false
  }
}

async function handleCreateTask() {
  if (!taskForm.name.trim()) {
    notify.error('Le nom de la tâche est requis.')
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
        project: taskForm.projectId
          ? `/api/projects/${taskForm.projectId}`
          : undefined,
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
      },
    })

    notify.success('Tâche créée avec succès')
    resetTaskForm()
    await Promise.all([
      adminStore.refreshCrmTasks(),
      adminStore.refreshCrmTaskCount(),
    ])
  } catch (error) {
    console.error(error)
    notify.error('Impossible de créer la tâche CRM')
  } finally {
    taskActionLoading.value = false
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

    notify.success('Tâche supprimée')
    await Promise.all([
      adminStore.refreshCrmTasks(),
      adminStore.refreshCrmTaskCount(),
    ])
  } catch (error) {
    console.error(error)
    notify.error('Suppression de la tâche impossible')
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
              <v-text-field
                v-model="projectForm.clientId"
                label="Client ID (optionnel)"
                type="number"
                density="comfortable"
                class="mb-4"
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
              <v-text-field
                v-model="taskForm.projectId"
                label="Projet ID"
                type="number"
                density="comfortable"
                class="mb-3"
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
