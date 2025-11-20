<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'
import { useCrmApi } from '~/composables/useCrmApi'
import type { CrmClient } from '~/types/crm'

definePageMeta({
  title: 'navigation.crmClient',
  middleware: 'auth',
})

const route = useRoute()
const translate = useTranslateWithFallback()
const { headers: crmHeaders, withBase } = useCrmApi()
const crmStore = useCrmStore()

const projectCollection = crmStore.projects
const documentCollection = crmStore.documents

await Promise.all([projectCollection.fetch(), documentCollection.fetch()])

const client = ref<CrmClient | null>(null)
const loading = ref(false)

async function loadClient() {
  loading.value = true

  try {
    client.value = await $fetch<CrmClient>(withBase(`/clients/${route.params.id}`), {
      headers: crmHeaders.value,
    })
  } catch (error) {
    console.error(error)
    Notify.error(translate('crm.notifications.clientError', 'Impossible de charger le client'))
  } finally {
    loading.value = false
  }
}

await loadClient()

watch(
  () => route.params.id,
  async () => {
    await loadClient()
  },
)

const clientProjects = computed(() => {
  if (!client.value) return []

  return (projectCollection.data?.member ?? []).filter(
    (project) => project.client?.id === client.value?.id,
  )
})

const clientDocuments = computed(() => {
  if (!client.value) return []

  return (documentCollection.data?.member ?? []).filter(
    (document) => document.client?.id === client.value?.id,
  )
})

const contactItems = computed(() => client.value?.contacts ?? [])
const projectNavigationItems = computed(() =>
  clientProjects.value.map((project) => ({
    value: project.id,
    label: project.name,
    to: `/crm/project/${project.id}`,
    status: project.status,
  })),
)
</script>

<template>
  <div class="crm-client-shell">
    <client-only>
      <teleport to="#app-drawer">
        <AppNavigationList
          :items="projectNavigationItems"
          :title="translate('crm.client.drawer.projectsTitle', 'Projets du client')"
          :description="
            translate(
              'crm.client.drawer.projectsSubtitle',
              'Accédez rapidement aux projets liés à ce client.',
            )
          "
        >
          <template #item="{ item }">
            <NuxtLink class="text-decoration-none" :to="item.to" style="color: inherit">
              <div class="stat-card d-flex align-center justify-space-between mb-3 w-100 px-3">
                <div class="d-flex flex-column">
                  <span class="font-weight-medium">{{ item.label }}</span>
                  <span class="text-body-2 text-medium-emphasis">
                    {{ translate('crm.client.drawer.projectLink', 'Voir le projet') }}
                  </span>
                </div>
                <v-chip v-if="item.status" color="primary" size="x-small" variant="tonal">
                  {{ item.status.name }}
                </v-chip>
                <v-icon v-else icon="mdi-chevron-right" size="18" />
              </div>
            </NuxtLink>
          </template>
        </AppNavigationList>
      </teleport>
    </client-only>

    <client-only>
      <teleport to="#app-drawer-right">
        <AppCard class="pa-5" elevation="2">
          <div class="animated-badge mb-4">
            <span class="animated-badge__pulse" />
            {{ translate('crm.client.drawer.contactsTitle', 'Contacts') }}
          </div>

          <v-list v-if="contactItems.length" density="comfortable">
            <v-list-item v-for="contact in contactItems" :key="contact.id">
              <v-list-item-title class="font-weight-medium">{{ contact.value }}</v-list-item-title>
              <v-list-item-subtitle class="text-body-2 text-medium-emphasis">
                {{ translate('crm.client.drawer.contactLabel', 'Coordonnée enregistrée') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div v-else class="text-body-2 text-medium-emphasis">
            {{ translate('crm.client.drawer.noContacts', 'Aucune information de contact disponible.') }}
          </div>
        </AppCard>
      </teleport>
    </client-only>

    <v-container fluid class="crm-client-page">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-6" :loading="loading" variant="tonal">
          <div class="d-flex flex-wrap justify-space-between align-start gap-4">
            <div class="d-flex flex-column gap-2">
              <div class="text-h5 font-weight-bold">
                {{ client?.name || translate('crm.client.header.placeholder', 'Client CRM') }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  client?.description ||
                    translate(
                      'crm.client.header.description',
                      'Centralisez les informations et interactions pour ce client.',
                    )
                }}
              </div>
              <div class="d-flex flex-wrap gap-2">
                <v-chip color="primary" variant="tonal" size="small">
                  {{ translate('crm.client.header.projects', 'Projets') }}: {{ clientProjects.length }}
                </v-chip>
                <v-chip color="secondary" variant="tonal" size="small">
                  {{ translate('crm.client.header.documents', 'Documents') }}: {{ clientDocuments.length }}
                </v-chip>
              </div>
            </div>
            <div class="d-flex flex-column gap-2 align-end">
              <v-chip color="primary" variant="text" size="small">
                ID #{{ client?.id ?? '—' }}
              </v-chip>
              <v-chip color="secondary" variant="tonal" size="small">
                {{ translate('crm.client.header.contacts', 'Contacts') }}: {{ contactItems.length }}
              </v-chip>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <AppCard class="pa-4" elevation="1">
          <div class="text-subtitle-1 font-weight-semibold mb-3">
            {{ translate('crm.client.projects.title', 'Projets liés') }}
          </div>
          <v-list v-if="clientProjects.length" density="comfortable">
            <v-list-item v-for="project in clientProjects" :key="project.id" :to="`/crm/project/${project.id}`">
              <template #title>
                <div class="d-flex align-center justify-space-between w-100">
                  <span class="font-weight-medium">{{ project.name }}</span>
                  <v-chip v-if="project.status" size="x-small" color="secondary" variant="tonal">
                    {{ project.status.name }}
                  </v-chip>
                </div>
              </template>
              <template #subtitle>
                <span class="text-body-2 text-medium-emphasis">
                  {{ translate('crm.client.projects.subtitle', 'Ouvrir la fiche projet') }}
                </span>
              </template>
            </v-list-item>
          </v-list>
          <div v-else class="text-body-2 text-medium-emphasis">
            {{ translate('crm.client.projects.empty', 'Aucun projet lié pour le moment.') }}
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" md="6">
        <AppCard class="pa-4" elevation="1">
          <div class="text-subtitle-1 font-weight-semibold mb-3">
            {{ translate('crm.client.documents.title', 'Documents') }}
          </div>
          <v-list v-if="clientDocuments.length" density="comfortable">
            <v-list-item v-for="document in clientDocuments" :key="document.id">
              <v-list-item-title class="font-weight-medium">{{ document.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-body-2 text-medium-emphasis">
                {{ translate('crm.client.documents.subtitle', 'Document lié au client') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <div v-else class="text-body-2 text-medium-emphasis">
            {{ translate('crm.client.documents.empty', 'Aucun document enregistré pour ce client.') }}
          </div>
        </AppCard>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.crm-client-page {
  padding-inline: 24px;
}

.stat-card {
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.stat-card:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
