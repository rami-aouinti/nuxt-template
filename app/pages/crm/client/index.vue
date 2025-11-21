<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '~/components/App/AppCard.vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmStore } from '~/stores/crm'

definePageMeta({
  title: 'navigation.crmClients',
  middleware: 'auth',
})

const localePath = useLocalePath()
const translate = useTranslateWithFallback()

const crmStore = useCrmStore()
const clientCollection = crmStore.clients
const projectCollection = crmStore.projects

await Promise.all([clientCollection.fetch(), projectCollection.fetch()])

const clients = computed(() => clientCollection.data?.member ?? [])
const projectsByClient = computed(() =>
  (projectCollection.data?.member ?? []).reduce<Record<number, number>>(
    (acc, project) => {
      const clientId = project.client?.id
      if (clientId != null) {
        acc[clientId] = (acc[clientId] ?? 0) + 1
      }
      return acc
    },
    {},
  ),
)
</script>

<template>
  <v-container fluid class="py-8">
    <v-row class="mb-6">
      <v-col cols="12">
        <AppCard class="pa-6" elevation="3" hover>
          <div class="d-flex align-center justify-space-between flex-wrap gap-4">
            <div>
              <div class="text-h5 font-weight-bold mb-2">
                {{ translate('crm.clients.title', 'Tous les clients') }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  translate(
                    'crm.clients.subtitle',
                    'Parcourez vos clients, leurs contacts et les projets associés.',
                  )
                }}
              </div>
            </div>
            <v-btn
              color="primary"
              variant="flat"
              :to="localePath({ name: 'crm-client-new' })"
            >
              <v-icon icon="mdi-plus" start />
              {{ translate('crm.drawer.newClient', 'Nouveau client') }}
            </v-btn>
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <AppCard class="pa-4" elevation="2">
          <v-list lines="two">
            <v-list-item
              v-for="client in clients"
              :key="client.id"
              :to="localePath({ name: 'crm-client-id', params: { id: client.id } })"
              rounded="lg"
            >
              <template #prepend>
                <v-avatar color="secondary" variant="tonal">
                  <v-icon icon="mdi-account-tie-outline" />
                </v-avatar>
              </template>

              <v-list-item-title class="text-subtitle-1 font-weight-medium">
                {{ client.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="d-flex align-center gap-2 flex-wrap">
                <v-chip size="small" color="info" variant="tonal">
                  <v-icon icon="mdi-account-multiple-outline" start />
                  {{ (client.contacts ?? []).length }}
                  {{ translate('crm.clients.contacts', 'Contacts') }}
                </v-chip>
                <v-chip size="small" color="primary" variant="tonal">
                  <v-icon icon="mdi-briefcase-outline" start />
                  {{ projectsByClient[client.id] ?? 0 }}
                  {{ translate('crm.clients.projects', 'Projets') }}
                </v-chip>
              </v-list-item-subtitle>

              <template #append>
                <v-icon icon="mdi-chevron-right" />
              </template>
            </v-list-item>
            <v-list-item v-if="!clients.length" disabled>
              {{ translate('crm.clients.empty', 'Aucun client disponible pour le moment.') }}
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
