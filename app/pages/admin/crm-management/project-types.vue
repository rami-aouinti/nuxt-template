<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'navigation.crmProjectTypes',
  icon: 'mdi-shape',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = useServerAuthRequestHeaders()
const crmStore = useCrmStore()

const typeCollection = crmStore.projectTypes
await typeCollection.fetch()

const types = computed(() => typeCollection.data.value?.member ?? [])

const form = reactive({ id: null as number | null, name: '' })
const loading = ref(false)
const editing = computed(() => form.id !== null)

function resetForm() {
  form.id = null
  form.name = ''
}

async function handleSubmit() {
  if (!form.name.trim()) {
    Notify.error('Le nom est requis')
    return
  }

  loading.value = true

  try {
    const method = editing.value ? 'PUT' : 'POST'
    const endpoint = editing.value
      ? `/api/project_types/${form.id}`
      : '/api/project_types'

    await $fetch(endpoint, {
      method,
      headers: requestHeaders,
      credentials: 'include',
      body: { name: form.name },
    })

    Notify.success(editing.value ? 'Type mis à jour' : 'Type créé')
    resetForm()
    await typeCollection.refresh()
  } catch (error) {
    console.error(error)
    Notify.error("Impossible d'enregistrer le type")
  } finally {
    loading.value = false
  }
}

function handleEdit(item: Record<string, any>) {
  form.id = item.id
  form.name = item.name
}

async function handleDelete(id: number) {
  loading.value = true

  try {
    await $fetch(`/api/project_types/${id}`, {
      method: 'DELETE',
      headers: requestHeaders,
      credentials: 'include',
    })
    Notify.success('Type supprimé')
    await typeCollection.refresh()
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
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            {{ editing ? 'Modifier un type de projet' : 'Ajouter un type de projet' }}
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field v-model="form.name" label="Nom" class="mb-4" />
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

      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Types de projet</v-card-title>
          <v-data-table
            :items="types"
            :loading="typeCollection.pending.value"
            :headers="[
              { title: 'ID', key: 'id', width: 80 },
              { title: 'Nom', key: 'name' },
              { title: 'Actions', key: 'actions', sortable: false, width: 160 },
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