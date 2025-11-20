<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'

  definePageMeta({
      title: 'CRM',
    middleware: 'auth',
  })

  const requestHeaders = useServerAuthRequestHeaders()
  const crmStore = useCrmStore()
  const notify = Notify()

  const clientCollection = crmStore.clients
  const contactTypeCollection = crmStore.contactTypes
  const projectStatusCollection = crmStore.projectStatuses
  const projectTypeCollection = crmStore.projectTypes
  const taskStatusCollection = crmStore.taskStatuses
  const projectCollection = crmStore.projects
  const taskCollection = crmStore.tasks
  const documentCollection = crmStore.documents

  await Promise.all([
      clientCollection.fetch(),
      contactTypeCollection.fetch(),
      projectStatusCollection.fetch(),
      projectTypeCollection.fetch(),
      taskStatusCollection.fetch(),
      projectCollection.fetch(),
      taskCollection.fetch(),
      documentCollection.fetch(),
    ])

  const clientForm = reactive({
    name: '',
    description: '',
    contactValue: '',
    contactTypeIri: '',
  })

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

  const documentForm = reactive({ name: '', clientIri: '', projectIri: '' })

  const clientActionLoading = ref(false)
  const projectActionLoading = ref(false)
  const taskActionLoading = ref(false)
  const documentActionLoading = ref(false)

  const clientItems = computed(() => clientCollection.data.value?.member ?? [])
  const contactTypeItems = computed(
    () => contactTypeCollection.data.value?.member ?? [],
  )
const projectStatusItems = computed(
    () => projectStatusCollection.data.value?.member ?? [],
  )
const projectTypeItems = computed(
    () => projectTypeCollection.data.value?.member ?? [],
  )
const taskStatusItems = computed(() => taskStatusCollection.data.value?.member ?? [])
  const projectItems = computed(() => projectCollection.data.value?.member ?? [])
  const taskItems = computed(() => taskCollection.data.value?.member ?? [])
  const documentItems = computed(() => documentCollection.data.value?.member ?? [])

  const iriFrom = (item: Record<string, any> | string | number, path: string) => {
    if (!item) return ''
      if (typeof item === 'string') return item
      if (typeof item === 'number') return `${path}/${item}`
      if (item['@id']) return item['@id']
      if (item.id) return `${path}/${item.id}`
      return ''
    }

  const clientValue = (item: Record<string, any>) => iriFrom(item, '/api/clients')
  const projectValue = (item: Record<string, any>) => iriFrom(item, '/api/projects')
  const projectStatusValue = (item: Record<string, any>) =>
    iriFrom(item, '/api/project_statuses')
  const projectTypeValue = (item: Record<string, any>) =>
    iriFrom(item, '/api/project_types')
  const taskStatusValue = (item: Record<string, any>) =>
    iriFrom(item, '/api/task_statuses')
  const contactTypeValue = (item: Record<string, any>) =>
    iriFrom(item, '/api/contact_types')

  function resetClientForm() {
      clientForm.name = ''
      clientForm.description = ''
      clientForm.contactValue = ''
      clientForm.contactTypeIri = ''
      }

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

  function resetDocumentForm() {
      documentForm.name = ''
      documentForm.clientIri = ''
      documentForm.projectIri = ''
      }

  async function handleCreateClient() {
      if (!clientForm.name.trim()) {
          notify.error('Le nom du client est requis.')
          return
        }

        clientActionLoading.value = true

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

            const clientIri = iriFrom(createdClient, '/api/clients')

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

            notify.success('Client ajouté avec succès')
          resetClientForm()
          await Promise.all([
              clientCollection.refresh(),
              crmStore.contacts.refresh(),
              projectCollection.refresh(),
            ])
        } catch (error) {
          console.error(error)
          notify.error('Impossible de créer le client CRM')
        } finally {
          clientActionLoading.value = false
          }
    }

  async function handleCreateProject() {
      if (!projectForm.name.trim()) {
          notify.error('Le nom du projet est requis.')
          return
        }

        projectActionLoading.value = true

        try {
          await $fetch('/api/crm/projects', {
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

            notify.success('Projet créé avec succès')
          resetProjectForm()
          await Promise.all([projectCollection.refresh(), documentCollection.refresh()])
        } catch (error) {
          console.error(error)
          notify.error("Impossible de créer le projet CRM")
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
          await $fetch('/api/crm/tasks', {
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

            notify.success('Tâche créée avec succès')
          resetTaskForm()
          await taskCollection.refresh()
        } catch (error) {
          console.error(error)
          notify.error('Impossible de créer la tâche CRM')
        } finally {
          taskActionLoading.value = false
          }
    }

  async function handleCreateDocument() {
      if (!documentForm.name.trim()) {
          notify.error('Le nom du document est requis.')
          return
        }

        documentActionLoading.value = true

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

            notify.success('Document ajouté avec succès')
          resetDocumentForm()
          await documentCollection.refresh()
        } catch (error) {
          console.error(error)
          notify.error('Impossible de créer le document CRM')
        } finally {
          documentActionLoading.value = false
          }
    }
  </script>

<template>
    <v-container fluid>
      <v-row class="mb-8">
        <v-col cols="12">
          <v-card class="pa-6" variant="tonal">
            <div class="text-h5 font-weight-bold mb-2">Espace CRM</div>
            <div class="text-body-2 text-medium-emphasis">
              Gérez vos clients, projets, tâches et documents depuis une seule page.
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12" md="6" lg="4">
          <v-card class="h-100">
            <v-card-title>Ajouter un client</v-card-title>
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
                  :items="contactTypeItems"
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
                  :loading="clientActionLoading"
                  block
                >
                  Créer le client
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <v-card class="h-100">
            <v-card-title>Créer un projet</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleCreateProject">
                <v-text-field
                  v-model="projectForm.name"
                  label="Nom du projet"
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
                  :items="projectStatusItems"
                  item-title="name"
                  :item-value="projectStatusValue"
                  label="Statut"
                  density="comfortable"
                  class="mb-3"
                  clearable
                />
                <v-select
                  v-model="projectForm.typeIri"
                  :items="projectTypeItems"
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
                  Créer le projet
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="4">
          <v-card class="h-100">
            <v-card-title>Ajouter un document</v-card-title>
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
                  :items="projectItems"
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
                  :loading="documentActionLoading"
                  block
                >
                  Enregistrer le document
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-8">
        <v-col cols="12" md="6">
          <v-card class="h-100">
            <v-card-title>Créer une tâche</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleCreateTask">
                <v-text-field
                  v-model="taskForm.name"
                  label="Nom de la tâche"
                  density="comfortable"
                  class="mb-3"
                />
                <v-select
                  v-model="taskForm.projectIri"
                  :items="projectItems"
                  item-title="name"
                  :item-value="projectValue"
                  label="Projet"
                  density="comfortable"
                  class="mb-3"
                  clearable
                />
                <v-text-field
                  v-model="taskForm.assigneeId"
                  label="Assigné (ID utilisateur)"
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
                  :items="taskStatusItems"
                  item-title="name"
                  :item-value="taskStatusValue"
                  label="Statut"
                  density="comfortable"
                  class="mb-3"
                  clearable
                />
                <v-text-field
                  v-model.number="taskForm.timeEstimated"
                  label="Temps estimé (minutes)"
                  type="number"
                  density="comfortable"
                  class="mb-3"
                />
                <v-text-field
                  v-model.number="taskForm.timeSpent"
                  label="Temps passé (minutes)"
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
                  Créer la tâche
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="h-100">
            <v-card-title>Vos tâches CRM</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="[
                { title: 'ID', key: 'id', width: 80 },
                { title: 'Nom', key: 'name' },
                { title: 'Projet', key: 'project.name' },
                { title: 'Assigné', key: 'assignee.name' },
                { title: 'Statut', key: 'status.name' },
              ]"
                :items="taskItems"
                :loading="taskCollection.pending.value"
                density="comfortable"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="h-100">
            <v-card-title>Clients & Projets</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="[
                { title: 'ID', key: 'id', width: 80 },
                { title: 'Nom', key: 'name' },
                { title: 'Projets', key: 'projects', sortable: false },
                { title: 'Contacts', key: 'contacts', sortable: false },
              ]"
                :items="clientItems"
                :loading="clientCollection.pending.value"
                density="comfortable"
              >
                <template #item.projects="{ item }">
                  <v-chip color="primary" variant="tonal">
                    {{ item.raw.projects?.length ?? 0 }}
                  </v-chip>
                </template>
                <template #item.contacts="{ item }">
                  <v-chip color="secondary" variant="tonal">
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
              <v-data-table
                :headers="[
                { title: 'ID', key: 'id', width: 80 },
                { title: 'Nom', key: 'name' },
                { title: 'Client', key: 'client.name' },
                { title: 'Projets', key: 'projects', sortable: false },
              ]"
                :items="documentItems"
                :loading="documentCollection.pending.value"
                density="comfortable"
              >
                <template #item.projects="{ item }">
                  <v-chip color="primary" variant="tonal">
                    {{ item.raw.projects?.length ?? 0 }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
