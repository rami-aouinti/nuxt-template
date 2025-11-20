<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'
import { useCrmApi } from '~/composables/useCrmApi'

definePageMeta({
  title: 'navigation.crmDocuments',
  icon: 'mdi-file-document-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { headers: crmHeaders, withBase, withResourceBase } = useCrmApi()
const crmStore = useCrmStore()

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

const form = reactive({
  id: null as number | null,
  name: '',
  clientIri: '',
  projectIris: [] as string[],
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

const clientValue = (item: Record<string, any>) =>
  iriFrom(item, withResourceBase('/api/clients'))
const projectValue = (item: Record<string, any>) =>
  iriFrom(item, withResourceBase('/api/projects'))

function resetForm() {
  form.id = null
  form.name = ''
  form.clientIri = ''
  form.projectIris = []
}

async function handleSubmit() {
  if (!form.name.trim()) {
    Notify.error('Le nom du document est requis')
    return
  }

  loading.value = true

  try {
    const method = editing.value ? 'PUT' : 'POST'
    const endpoint = editing.value
      ? withBase(`/documents/${form.id}`)
      : withBase('/documents')

    await $fetch(endpoint, {
      method,
      headers: crmHeaders.value,
      body: {
        name: form.name,
        client: form.clientIri || undefined,
        projects: form.projectIris.length ? form.projectIris : undefined,
      },
    })

    Notify.success(editing.value ? 'Document mis à jour' : 'Document créé')
    resetForm()
    await documentCollection.refresh()
  } catch (error) {
    console.error(error)
    Notify.error("Impossible d'enregistrer le document")
  } finally {
    loading.value = false
  }
}

function handleEdit(item: Record<string, any>) {
  form.id = item.id
  form.name = item.name
  form.clientIri = clientValue(item.client)
  form.projectIris = (item.projects || []).map((project: Record<string, any>) =>
    projectValue(project),
  )
}

async function handleDelete(id: number) {
  loading.value = true

  try {
    await $fetch(withBase(`/documents/${id}`), {
      method: 'DELETE',
      headers: crmHeaders.value,
    })
    Notify.success('Document supprimé')
    await documentCollection.refresh()
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
            {{ editing ? 'Modifier un document' : 'Créer un document' }}
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
                v-model="form.projectIris"
                :items="projects"
                item-title="name"
                :item-value="projectValue"
                label="Projets liés"
                class="mb-4"
                clearable
                multiple
                chips
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
          <v-card-title>Documents</v-card-title>
          <v-data-table
            :items="documents"
            :loading="documentCollection.pending.value"
            :headers="[
              { title: 'ID', key: 'id', width: 80 },
              { title: 'Nom', key: 'name' },
              { title: 'Client', key: 'client.name' },
              { title: 'Projets liés', key: 'projects', sortable: false },
              { title: 'Actions', key: 'actions', sortable: false, width: 180 },
            ]"
          >
            <template #item.projects="{ item }">
              <v-chip color="secondary" variant="tonal">
                {{ item.raw.projects?.length ?? 0 }}
              </v-chip>
            </template>
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