<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'navigation.crmProjects',
  icon: 'mdi-briefcase-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = useServerAuthRequestHeaders()
const crmStore = useCrmStore()

const clientCollection = crmStore.clients
const statusCollection = crmStore.projectStatuses
const typeCollection = crmStore.projectTypes
const projectCollection = crmStore.projects

await Promise.all([
  clientCollection.fetch(),
  statusCollection.fetch(),
  typeCollection.fetch(),
  projectCollection.fetch(),
])

const projects = computed(() => projectCollection.data.value?.member ?? [])
const clients = computed(() => clientCollection.data.value?.member ?? [])
const statuses = computed(() => statusCollection.data.value?.member ?? [])
const types = computed(() => typeCollection.data.value?.member ?? [])

const form = reactive({
  id: null as number | null,
  name: '',
  clientIri: '',
  statusIri: '',
  typeIri: '',
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

const clientValue = (item: Record<string, any>) => iriFrom(item, '/api/clients')
const statusValue = (item: Record<string, any>) => iriFrom(item, '/api/project_statuses')
const typeValue = (item: Record<string, any>) => iriFrom(item, '/api/project_types')

function resetForm() {
  form.id = null
  form.name = ''
  form.clientIri = ''
  form.statusIri = ''
  form.typeIri = ''
}

async function handleSubmit() {
  if (!form.name.trim()) {
    Notify.error('Le nom du projet est requis')
    return
  }

  loading.value = true

  try {
    const method = editing.value ? 'PUT' : 'POST'
    const endpoint = editing.value
      ? `/api/projects/${form.id}`
      : '/api/projects'

    await $fetch(endpoint, {
      method,
      headers: requestHeaders,
      credentials: 'include',
      body: {
        name: form.name,
        client: form.clientIri || undefined,
        status: form.statusIri || undefined,
        type: form.typeIri || undefined,
      },
    })

    Notify.success(editing.value ? 'Projet mis à jour' : 'Projet créé')
    resetForm()
    await projectCollection.refresh()
  } catch (error) {
    console.error(error)
    Notify.error("Impossible d'enregistrer le projet")
  } finally {
    loading.value = false
  }
}

function handleEdit(item: Record<string, any>) {
  form.id = item.id
  form.name = item.name
  form.clientIri = clientValue(item.client)
  form.statusIri = statusValue(item.status)
  form.typeIri = typeValue(item.type)
}

async function handleDelete(id: number) {
  loading.value = true

  try {
    await $fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: requestHeaders,
      credentials: 'include',
    })
    Notify.success('Projet supprimé')
    await projectCollection.refresh()
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
            {{ editing ? 'Modifier un projet' : 'Créer un projet' }}
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field v-model="form.name" label="Nom" class="mb-3" />
              <v-select
                v-model="form.clientIri"
                :items="clients"
                item-title="name"
                :item-value="clientValue"
                label="Client"
                class="mb-3"
                clearable
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
              <v-select
                v-model="form.typeIri"
                :items="types"
                item-title="name"
                :item-value="typeValue"
                label="Type"
                class="mb-4"
                clearable
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
          <v-card-title>Projets</v-card-title>
          <v-data-table
            :items="projects"
            :loading="projectCollection.pending.value"
            :headers="[
              { title: 'ID', key: 'id', width: 80 },
              { title: 'Nom', key: 'name' },
              { title: 'Client', key: 'client.name' },
              { title: 'Statut', key: 'status.name' },
              { title: 'Type', key: 'type.name' },
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