<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

definePageMeta({
  title: 'Roles',
  icon: 'mdi-shield-key-outline',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const headers: DataTableHeader[] = [
  { title: 'Role ID', key: 'id' },
  { title: 'Description', key: 'description' },
]

const { data, pending, error, refresh } = await useFetch('/api/v1/role')

const items = computed(() => data.value ?? [])
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h6">Rôles</span>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              :loading="pending"
              @click="refresh()"
            />
          </v-card-title>
          <v-card-subtitle>
            Détails des rôles applicatifs disponibles.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              Échec du chargement des rôles.
            </v-alert>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="pending"
              item-value="id"
              class="elevation-0"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
