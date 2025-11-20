<script setup lang="ts">
import { computed } from 'vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'

const translate = useTranslateWithFallback()

const linkDefinitions = [
  {
    key: 'clients',
    to: '/admin/crm-management/clients',
    icon: 'mdi-account-tie',
    fallbackTitle: 'Clients',
    fallbackDescription: 'Gérer les clients, contacts et projets liés.',
  },
  {
    key: 'projects',
    to: '/admin/crm-management/projects',
    icon: 'mdi-briefcase-outline',
    fallbackTitle: 'Projets',
    fallbackDescription: 'Créer et suivre les projets CRM avec statuts et types.',
  },
  {
    key: 'tasks',
    to: '/admin/crm-management/tasks',
    icon: 'mdi-format-list-checkbox',
    fallbackTitle: 'Tâches',
    fallbackDescription: 'Assigner les tâches, deadlines et statuts.',
  },
  {
    key: 'documents',
    to: '/admin/crm-management/documents',
    icon: 'mdi-file-document-outline',
    fallbackTitle: 'Documents',
    fallbackDescription: 'Lister et créer des documents liés aux clients et projets.',
  },
  {
    key: 'countries',
    to: '/admin/crm-management/countries',
    icon: 'mdi-earth',
    fallbackTitle: 'Pays',
    fallbackDescription: 'Référentiel des pays utilisés dans les adresses.',
  },
  {
    key: 'contactTypes',
    to: '/admin/crm-management/contact-types',
    icon: 'mdi-card-account-phone',
    fallbackTitle: 'Types de contact',
    fallbackDescription: 'Configurer les types de contact disponibles.',
  },
  {
    key: 'projectStatuses',
    to: '/admin/crm-management/project-statuses',
    icon: 'mdi-check-decagram-outline',
    fallbackTitle: 'Statuts de projet',
    fallbackDescription: 'Gérer les statuts applicables aux projets.',
  },
  {
    key: 'projectTypes',
    to: '/admin/crm-management/project-types',
    icon: 'mdi-shape',
    fallbackTitle: 'Types de projet',
    fallbackDescription: 'Référentiel des types de projets.',
  },
  {
    key: 'taskStatuses',
    to: '/admin/crm-management/task-statuses',
    icon: 'mdi-progress-check',
    fallbackTitle: 'Statuts de tâche',
    fallbackDescription: 'Paramétrer les statuts de tâche utilisés.',
  },
]

const links = computed(() =>
  linkDefinitions.map((item) => ({
    ...item,
    title: translate(
      `admin.crm.links.${item.key}.title`,
      item.fallbackTitle,
    ),
    description: translate(
      `admin.crm.links.${item.key}.description`,
      item.fallbackDescription,
    ),
  })),
)

definePageMeta({
  title: 'navigation.crmManagement',
  icon: 'mdi-briefcase-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="mb-4">
        <v-card variant="tonal" class="pa-6">
          <div class="text-h5 font-weight-bold mb-2">
            {{ translate('admin.crm.title', 'Espace CRM (Admin)') }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{
              translate(
                'admin.crm.description',
                'Accédez aux différentes ressources CRM pour créer, éditer et supprimer les entrées (clients, projets, tâches, référentiels).',
              )
            }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="item in links" :key="item.to" cols="12" md="6" lg="4">
        <v-card class="h-100 d-flex flex-column">
          <v-card-title class="d-flex align-center">
            <v-icon :icon="item.icon" class="me-3" />
            <span class="font-weight-bold">{{ item.title }}</span>
          </v-card-title>
          <v-card-text class="text-body-2 text-medium-emphasis flex-grow-1">
            {{ item.description }}
          </v-card-text>
          <v-card-actions>
            <v-btn :to="item.to" color="primary" variant="flat">
              {{ translate('admin.crm.open', 'Ouvrir') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
