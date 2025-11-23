<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '~/components/App/AppCard.vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmStore } from '~/stores/crm'

definePageMeta({
  title: 'navigation.crmProjects',
  middleware: 'auth',
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const translate = useTranslateWithFallback()

const crmStore = useCrmStore()
const projectCollection = crmStore.projects
const clientCollection = crmStore.clients

await Promise.all([projectCollection.fetch(), clientCollection.fetch()])

const projects = computed(() => projectCollection.data?.member ?? [])
const clientsById = computed(() =>
  (clientCollection.data?.member ?? []).reduce<Record<number, string>>(
    (acc, client) => {
      acc[client.id] = client.name
      return acc
    },
    {},
  ),
)

const formatDate = (value?: string) => {
  if (!value) {
    return translate('common.unknown', 'N/A')
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return translate('common.unknown', 'N/A')
  }

  return new Intl.DateTimeFormat(locale.value || 'en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}
</script>

<template>
  <v-container fluid class="py-8">
    <v-row class="mb-6">
      <v-col cols="12">
        <AppCard class="pa-6" elevation="3" hover>
          <div
            class="d-flex align-center justify-space-between flex-wrap gap-4"
          >
            <div>
              <div class="text-h5 font-weight-bold mb-2">
                {{ translate('crm.projects.title', 'Tous les projets') }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  translate(
                    'crm.projects.subtitle',
                    'Consultez et accédez à l’ensemble de vos projets et de leurs clients associés.',
                  )
                }}
              </div>
            </div>
            <v-btn
              color="primary"
              variant="flat"
              :to="localePath({ name: 'crm-project-new' })"
            >
              <v-icon icon="mdi-plus" start />
              {{ translate('crm.drawer.newProject', 'Nouveau projet') }}
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
              v-for="project in projects"
              :key="project.id"
              :to="
                localePath({
                  name: 'crm-project-id',
                  params: { id: project.id },
                })
              "
              rounded="lg"
            >
              <template #prepend>
                <v-avatar color="primary" variant="tonal">
                  <v-icon icon="mdi-briefcase-outline" />
                </v-avatar>
              </template>

              <v-list-item-title class="text-subtitle-1 font-weight-medium">
                {{ project.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="d-flex align-center gap-2 flex-wrap">
                <v-chip size="small" color="secondary" variant="tonal">
                  <v-icon icon="mdi-account-tie-outline" start />
                  {{
                    clientsById[project.client?.id ?? -1] ??
                    t('common.client', 'Client')
                  }}
                </v-chip>
                <span class="text-caption text-medium-emphasis">
                  {{ translate('crm.projects.updated', 'Mis à jour') }}
                  {{ formatDate(project.updatedAt) }}
                </span>
              </v-list-item-subtitle>

              <template #append>
                <v-icon icon="mdi-chevron-right" />
              </template>
            </v-list-item>
            <v-list-item v-if="!projects.length" disabled>
              {{
                translate(
                  'crm.projects.empty',
                  'Aucun projet disponible pour le moment.',
                )
              }}
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
