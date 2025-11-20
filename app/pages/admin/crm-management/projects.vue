<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'CRM - Projets',
  icon: 'mdi-briefcase-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = useServerAuthRequestHeaders()
const crmStore = useCrmStore()
const notify = Notify()

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
  name: '',
  clientIri: '',
  statusIri: '',
  typeIri: '',
})

const loading = ref(false)

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
  form.name = ''
  form.clientIri = ''
  form.statusIri = ''
  form.typeIri = ''
}

async function handleSubmit() {
  if (!form.name.trim()) {
    notify.error('Le nom du projet est requis')
    return
  }

  loading.value = true

  try {
    await $fetch('/api/crm/projects', {
      method: 'POST',
      headers: requestHeaders,
      credentials: 'include',
      body: {
        name: form.name,
        client: form.clientIri || undefined,
        status: form.statusIri || undefined,
        type: form.typeIri || undefined,
      },
    })

    notify.success('Projet créé')
    resetForm()
    await projectCollection.refresh()
  } catch (error) {
    console.error(error)
    notify.error("Impossible d'enregistrer le projet")
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  loading.value = true

  try {
    await $fetch(`/api/crm/projects/${id}`, {
      method: 'DELETE',
      headers: requestHeaders,
      credentials: 'include',
    })
    notify.success('Projet supprimé')
    await projectCollection.refresh()
  } catch (error) {
    console.error(error)
    notify.error('Suppression impossible')
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
          <v-card-title>Créer un projet</v-card-title>
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
                Créer
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
              { title: 'Actions', key: 'actions', sortable: false, width: 120 },
            ]"
          >
            <template #item.actions="{ item }">
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
