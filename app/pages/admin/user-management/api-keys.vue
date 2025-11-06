<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

definePageMeta({
  title: 'API Keys',
  icon: 'mdi-key-outline',
  drawerIndex: 4,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const tab = ref<'v1' | 'v2'>('v1')

const headers: DataTableHeader[] = [
  { title: 'Description', key: 'description' },
  { title: 'Token', key: 'token' },
  { title: 'Identifier', key: 'id' },
]

const {
  data: apiKeysV1,
  pending: pendingV1,
  error: errorV1,
  refresh: refreshV1,
} = await useFetch('/api/v1/api_key')

const {
  data: apiKeysV2,
  pending: pendingV2,
  error: errorV2,
  refresh: refreshV2,
} = await useFetch('/api/v2/api_key')
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h6">Clés API</span>
            <v-btn-toggle
              v-model="tab"
              variant="text"
              divided
              density="compact"
              color="primary"
            >
              <v-btn value="v1">API v1</v-btn>
              <v-btn value="v2">API v2</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-subtitle>
            Gestion des clés d'accès aux services internes.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="v1">
                <v-alert v-if="errorV1" type="error" variant="tonal" class="mb-4">
                  Les clés de l'API v1 n'ont pas pu être chargées.
                </v-alert>
                <div class="d-flex justify-end mb-2">
                  <v-btn
                    icon="mdi-refresh"
                    variant="text"
                    :loading="pendingV1"
                    @click="refreshV1()"
                  />
                </div>
                <v-data-table
                  :headers="headers"
                  :items="apiKeysV1 ?? []"
                  :loading="pendingV1"
                  item-value="id"
                  class="elevation-0"
                />
              </v-window-item>
              <v-window-item value="v2">
                <v-alert v-if="errorV2" type="error" variant="tonal" class="mb-4">
                  Les clés de l'API v2 n'ont pas pu être chargées.
                </v-alert>
                <div class="d-flex justify-end mb-2">
                  <v-btn
                    icon="mdi-refresh"
                    variant="text"
                    :loading="pendingV2"
                    @click="refreshV2()"
                  />
                </div>
                <v-data-table
                  :headers="headers"
                  :items="apiKeysV2 ?? []"
                  :loading="pendingV2"
                  item-value="id"
                  class="elevation-0"
                />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
