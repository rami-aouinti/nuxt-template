<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'CRM - Documents',
  icon: 'mdi-file-document-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = useServerAuthRequestHeaders()
const crmStore = useCrmStore()
const notify = Notify()

const documentCollection = crmStore.documents
const clientCollection = crmStore.clients
const projectCollection = crmStore.projects

await Promise.all([
  documentCollection.fetch(),
  clientCollection.fetch(),
  projectCollection.fetch(),
])

const documents = computed(() => documentCollection.data.value?.member ?? [])
const clients = computed(() => clientCollection.data.value?.member ?? [])
const projects = computed(() => projectCollection.data.value?.member ?? [])

const form = reactive({ name: '', clientIri: '', projectIri: '' })
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
const projectValue = (item: Record<string, any>) => iriFrom(item, '/api/projects')

function resetForm() {
  form.name = ''
  form.clientIri = ''
  form.projectIri = ''
}

async function handleSubmit() {
  if (!form.name.trim()) {
    notify.error('Le nom du document est requis')
    return
  }

  loading.value = true

  try {
    await $fetch('/api/crm/documents', {
      method: 'POST',
      headers: requestHeaders,
      credentials: 'include',
      body: {
        name: form.name,
        client: form.clientIri || undefined,
        projects: form.projectIri ? [form.projectIri] : undefined,
      },
    })

    notify.success('Document créé')
    resetForm()
    await documentCollection.refresh()
  } catch (error) {
    console.error(error)
    notify.error("Impossible d'enregistrer le document")
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  loading.value = true

  try {
    await $fetch(`/api/crm/documents/${id}`, {
      method: 'DELETE',
      headers: requestHeaders,
      credentials: 'include',
    })
    notify.success('Document supprimé')
    await documentCollection.refresh()
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
          <v-card-title>Créer un document</v-card-title>
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
                v-model="form.projectIri"
                :items="projects"
                item-title="name"
                :item-value="projectValue"
                label="Projet lié"
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
          <v-card-title>Documents</v-card-title>
          <v-data-table
            :items="documents"
            :loading="documentCollection.pending.value"
            :headers="[
              { title: 'ID', key: 'id', width: 80 },
              { title: 'Nom', key: 'name' },
              { title: 'Client', key: 'client.name' },
              { title: 'Projets liés', key: 'projects', sortable: false },
              { title: 'Actions', key: 'actions', sortable: false, width: 120 },
            ]"
          >
            <template #item.projects="{ item }">
              <v-chip color="secondary" variant="tonal">
                {{ item.raw.projects?.length ?? 0 }}
              </v-chip>
            </template>
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
