<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'
import { useCrmApi } from '~/composables/useCrmApi'

definePageMeta({
  title: 'navigation.crmClients',
  icon: 'mdi-account-tie',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { headers: crmHeaders, withBase, withResourceBase } = useCrmApi()
const crmStore = useCrmStore()

const clientCollection = crmStore.clients
const contactTypeCollection = crmStore.contactTypes

await Promise.all([clientCollection.fetch(), contactTypeCollection.fetch()])

const clientItems = computed(() => clientCollection.data?.member ?? [])
const contactTypeItems = computed(
  () => contactTypeCollection.data?.member ?? [],
)

const form = reactive({
  id: null as number | null,
  name: '',
  description: '',
  contactValue: '',
  contactTypeIri: '',
})

const actionLoading = ref(false)
const editing = computed(() => form.id !== null)

const iriFrom = (item: Record<string, any> | string | number | null, path: string) => {
  if (!item) return ''
  if (typeof item === 'string') return item
  if (typeof item === 'number') return `${path}/${item}`
  if (item['@id']) return item['@id']
  if (item.id) return `${path}/${item.id}`
  return ''
}

const contactTypeValue = (item: Record<string, any>) =>
  iriFrom(item, withResourceBase('/api/contact_types'))
const clientValue = (item: Record<string, any>) =>
  iriFrom(item, withResourceBase('/api/clients'))

function resetForm() {
  form.id = null
  form.name = ''
  form.description = ''
  form.contactValue = ''
  form.contactTypeIri = ''
}

async function handleSubmit() {
  if (!form.name.trim()) {
    Notify.error('Le nom du client est requis.')
    return
  }

  actionLoading.value = true

  try {
    const method = editing.value ? 'PUT' : 'POST'
    const endpoint = editing.value
      ? withBase(`/clients/${form.id}`)
      : withBase('/clients')

    const createdClient = await $fetch<Record<string, any>>(endpoint, {
      method,
      headers: crmHeaders.value,
      body: {
        name: form.name,
        description: form.description || undefined,
      },
    })

    const clientIri = clientValue(createdClient)

    if (form.contactValue.trim()) {
      await $fetch(withBase('/contacts'), {
        method: 'POST',
        headers: crmHeaders.value,
        body: {
          value: form.contactValue,
          contactType: form.contactTypeIri || undefined,
          client: clientIri,
        },
      })
    }

    Notify.success(editing.value ? 'Client mis à jour' : 'Client créé')
    resetForm()
    await Promise.all([clientCollection.refresh(), crmStore.contacts.refresh()])
  } catch (error) {
    console.error(error)
    Notify.error("Impossible d'enregistrer le client")
  } finally {
    actionLoading.value = false
  }
}

function handleEdit(item: Record<string, any>) {
  form.id = item.id
  form.name = item.name || ''
  form.description = item.description || ''
  form.contactTypeIri = ''
  form.contactValue = ''
}

async function handleDelete(id: number) {
  actionLoading.value = true

  try {
    await $fetch(withBase(`/clients/${id}`), {
      method: 'DELETE',
      headers: crmHeaders.value,
    })
    Notify.success('Client supprimé')
    await clientCollection.refresh()
  } catch (error) {
    console.error(error)
    Notify.error('Suppression impossible')
  } finally {
    actionLoading.value = false
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="5">
        <v-card>
          <v-card-title>
            {{ editing ? 'Modifier un client' : 'Créer un client' }}
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field v-model="form.name" label="Nom" class="mb-3" />
              <v-textarea
                v-model="form.description"
                label="Description"
                class="mb-3"
                rows="2"
                auto-grow
              />
              <v-select
                v-model="form.contactTypeIri"
                :items="contactTypeItems"
                item-title="name"
                :item-value="contactTypeValue"
                label="Type de contact"
                class="mb-3"
                clearable
              />
              <v-text-field
                v-model="form.contactValue"
                label="Contact (optionnel)"
                class="mb-4"
              />
              <v-btn
                type="submit"
                color="primary"
                :loading="actionLoading"
                block
              >
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
          <v-card-title>Clients</v-card-title>
          <v-data-table
            :items="clientItems"
            :loading="clientCollection.pending.value"
            :headers="[
              { title: 'ID', key: 'id', width: 80 },
              { title: 'Nom', key: 'name' },
              { title: 'Description', key: 'description' },
              { title: 'Contacts', key: 'contacts', sortable: false },
              { title: 'Actions', key: 'actions', sortable: false, width: 160 },
            ]"
          >
            <template #item.contacts="{ item }">
              <v-chip color="primary" variant="tonal">
                {{ item.contacts?.length ?? 0 }}
              </v-chip>
            </template>
            <template #item.actions="{ item }">
              <v-btn size="small" variant="text" @click="handleEdit(item)">
                Éditer
              </v-btn>
              <v-btn
                size="small"
                color="error"
                variant="text"
                :loading="actionLoading"
                @click="handleDelete(item.id)"
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
