<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

definePageMeta({
  title: 'Users',
  icon: 'mdi-account-multiple-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const search = ref('')

const headers: DataTableHeader[] = [
  { title: 'Username', key: 'username' },
  { title: 'First name', key: 'firstName' },
  { title: 'Last name', key: 'lastName' },
  { title: 'Email', key: 'email' },
  { title: 'Language', key: 'language' },
  { title: 'Locale', key: 'locale' },
  { title: 'Timezone', key: 'timezone' },
  { title: 'Enabled', key: 'enabled' },
]

const { data, pending, error, refresh } = await useFetch('/api/v1/user')

const items = computed(() => data.value ?? [])
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h6">Utilisateurs</span>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              :loading="pending"
              @click="refresh()"
            />
          </v-card-title>
          <v-card-subtitle>
            Liste des utilisateurs fournie par l'API interne.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-row class="mb-4" align="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  label="Rechercher"
                  prepend-inner-icon="mdi-magnify"
                  hide-details
                  density="comfortable"
                  variant="solo"
                  flat
                  clearable
                />
              </v-col>
              <v-spacer />
            </v-row>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              Une erreur est survenue lors du chargement des utilisateurs.
            </v-alert>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="pending"
              :search="search"
              item-value="id"
              class="elevation-0"
            >
              <template #item.enabled="{ value }">
                <v-chip :color="value ? 'success' : 'grey'" size="small" label>
                  {{ value ? 'Actif' : 'Inactif' }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
