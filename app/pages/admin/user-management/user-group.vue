<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

definePageMeta({
  title: 'User Groups',
  icon: 'mdi-account-group-outline',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const headers: DataTableHeader[] = [
  { title: 'Name', key: 'name' },
  { title: 'Identifier', key: 'id' },
]

const { data, pending, error, refresh } = await useFetch('/api/v1/user_group')

const items = computed(() => data.value ?? [])
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h6">Groupes d'utilisateurs</span>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              :loading="pending"
              @click="refresh()"
            />
          </v-card-title>
          <v-card-subtitle>
            Segmentation des utilisateurs par groupe fonctionnel.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              Impossible de récupérer les groupes d'utilisateurs.
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
