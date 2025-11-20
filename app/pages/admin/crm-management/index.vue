<script setup lang="ts">
const links = [
  {
    title: 'Clients',
    to: '/admin/crm-management/clients',
    icon: 'mdi-account-tie',
    description: 'Gérer les clients, contacts et projets liés.',
  },
  {
    title: 'Projets',
    to: '/admin/crm-management/projects',
    icon: 'mdi-briefcase-outline',
    description: 'Créer et suivre les projets CRM avec statuts et types.',
  },
  {
    title: 'Tâches',
    to: '/admin/crm-management/tasks',
    icon: 'mdi-format-list-checkbox',
    description: 'Assigner les tâches, deadlines et statuts.',
  },
  {
    title: 'Documents',
    to: '/admin/crm-management/documents',
    icon: 'mdi-file-document-outline',
    description: 'Lister et créer des documents liés aux clients et projets.',
  },
  {
    title: 'Pays',
    to: '/admin/crm-management/countries',
    icon: 'mdi-earth',
    description: 'Référentiel des pays utilisés dans les adresses.',
  },
  {
    title: 'Types de contact',
    to: '/admin/crm-management/contact-types',
    icon: 'mdi-card-account-phone',
    description: 'Configurer les types de contact disponibles.',
  },
  {
    title: 'Statuts de projet',
    to: '/admin/crm-management/project-statuses',
    icon: 'mdi-check-decagram-outline',
    description: 'Gérer les statuts applicables aux projets.',
  },
  {
    title: 'Types de projet',
    to: '/admin/crm-management/project-types',
    icon: 'mdi-shape',
    description: 'Référentiel des types de projets.',
  },
  {
    title: 'Statuts de tâche',
    to: '/admin/crm-management/task-statuses',
    icon: 'mdi-progress-check',
    description: 'Paramétrer les statuts de tâche utilisés.',
  },
]

definePageMeta({
  title: 'CRM Management',
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
          <div class="text-h5 font-weight-bold mb-2">Espace CRM (Admin)</div>
          <div class="text-body-2 text-medium-emphasis">
            Accédez aux différentes ressources CRM pour créer, éditer et supprimer
            les entrées (clients, projets, tâches, référentiels).
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
            <v-btn :to="item.to" color="primary" variant="flat">Ouvrir</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
