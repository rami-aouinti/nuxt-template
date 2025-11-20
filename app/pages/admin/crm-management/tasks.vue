<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'navigation.crmTasks',
  icon: 'mdi-format-list-checkbox',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = useServerAuthRequestHeaders()
const crmStore = useCrmStore()

const projectCollection = crmStore.projects
const taskCollection = crmStore.tasks
const statusCollection = crmStore.taskStatuses

await Promise.all([
  projectCollection.fetch(),
  taskCollection.fetch(),
  statusCollection.fetch(),
])

const tasks = computed(() => taskCollection.data.value?.member ?? [])
const projects = computed(() => projectCollection.data.value?.member ?? [])
const statuses = computed(() => statusCollection.data.value?.member ?? [])

const form = reactive({
  id: null as number | null,
  name: '',
  projectIri: '',
  assigneeId: '',
  deadline: '',
  timeEstimated: 0,
  timeSpent: 0,
  statusIri: '',
})

const loading = ref(false)
const editing = computed(() => form.id !== null)

const iriFrom = (item: Record<string, any> | string | number | null, path: string) => {
  if (!item) return ''
  if (typeof item === 'string') return item
  if (typeof item === 'number') return `${path}/${item}`
  if (item['@id']) return item['@id']
  if (item.id) return `${path}/${item.id}`
  return ''
}

const projectValue = (item: Record<string, any>) => iriFrom(item, '/api/projects')
const statusValue = (item: Record<string, any>) => iriFrom(item, '/api/task_statuses')

function resetForm() {
  form.id = null
  form.name = ''
  form.projectIri = ''
  form.assigneeId = ''
  form.deadline = ''
  form.timeEstimated = 0
  form.timeSpent = 0
  form.statusIri = ''
}

async function handleSubmit() {
  if (!form.name.trim()) {
    Notify.error('Le nom de la tâche est requis')
    return
  }

  loading.value = true

  try {
    const method = editing.value ? 'PUT' : 'POST'
    const endpoint = editing.value ? `/api/tasks/${form.id}` : '/api/tasks'

    await $fetch(endpoint, {
      method,
      headers: requestHeaders,
      credentials: 'include',
      body: {
        name: form.name,
        project: form.projectIri || undefined,
        assignee: form.assigneeId ? `/api/users/${form.assigneeId}` : undefined,
        deadline: form.deadline || undefined,
        timeEstimated:
          typeof form.timeEstimated === 'number' ? form.timeEstimated : undefined,
        timeSpent: typeof form.timeSpent === 'number' ? form.timeSpent : undefined,
        status: form.statusIri || undefined,
      },
    })

    Notify.success(editing.value ? 'Tâche mise à jour' : 'Tâche créée')
    resetForm()
    await taskCollection.refresh()
  } catch (error) {
    console.error(error)
    Notify.error("Impossible d'enregistrer la tâche")
  } finally {
    loading.value = false
  }
}

function handleEdit(item: Record<string, any>) {
  form.id = item.id
  form.name = item.name
  form.projectIri = projectValue(item.project)
  form.assigneeId = item.assignee?.id?.toString() ?? ''
  form.deadline = item.deadline ?? ''
  form.statusIri = statusValue(item.status)
  form.timeEstimated = item.timeEstimated ?? 0
  form.timeSpent = item.timeSpent ?? 0
}

async function handleDelete(id: number) {
  loading.value = true

  try {
    await $fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: requestHeaders,
      credentials: 'include',
    })
    Notify.success('Tâche supprimée')
    await taskCollection.refresh()
  } catch (error) {
    console.error(error)
    Notify.error('Suppression impossible')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="5">
        <v-card>
          <v-card-title>
            {{ editing ? 'Modifier une tâche' : 'Créer une tâche' }}
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field v-model="form.name" label="Nom" class="mb-3" />
              <v-select
                v-model="form.projectIri"
                :items="projects"
                item-title="name"
                :item-value="projectValue"
                label="Projet"
                class="mb-3"
                clearable
              />
              <v-text-field
                v-model="form.assigneeId"
                type="number"
                label="Assigné (ID utilisateur)"
                class="mb-3"
              />
              <v-text-field
                v-model="form.deadline"
                label="Deadline (ISO)"
                class="mb-3"
              />
              <v-select
                v-model="form.statusIri"
                :items="statuses"
                item-title="name"
                :item-value="statusValue"
                label="Statut"
                class="mb-3"
                clearable
              />
              <v-text-field
                v-model.number="form.timeEstimated"
                type="number"
                label="Temps estimé (min)"
                class="mb-3"
              />
              <v-text-field
                v-model.number="form.timeSpent"
                type="number"
                label="Temps passé (min)"
                class="mb-4"
              />
              <v-btn type="submit" color="primary" :loading="loading" block>
                {{ editing ? 'Mettre à jour' : 'Créer' }}
              </v-btn>
              <v-btn
                v-if="editing"
                class="mt-2"
                variant="tonal"
                block
                @click="resetForm"
              >
                Annuler la modification
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <v-card>
          <v-card-title>Tâches</v-card-title>
          <v-data-table
            :items="tasks"
            :loading="taskCollection.pending.value"
            :headers="[
              { title: 'ID', key: 'id', width: 80 },
              { title: 'Nom', key: 'name' },
              { title: 'Projet', key: 'project.name' },
              { title: 'Statut', key: 'status.name' },
              { title: 'Assigné', key: 'assignee.name' },
              { title: 'Actions', key: 'actions', sortable: false, width: 180 },
            ]"
          >
            <template #item.actions="{ item }">
              <v-btn size="small" variant="text" @click="handleEdit(item.raw)">
                Éditer
              </v-btn>
              <v-btn
                size="small"
                color="error"
                variant="text"
                :loading="loading"
                @click="handleDelete(item.raw.id)"
              >
                Supprimer
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>