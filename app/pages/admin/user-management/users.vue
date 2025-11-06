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
          <client-only>
            <teleport to="#app-bar">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                density="compact"
                class="mr-2"
                rounded="xl"
                flat
                icon-color
                glow
                variant="solo"
                style="width: 250px"
              />
            </teleport>
          </client-only>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h6">Users</span>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              :loading="pending"
              @click="refresh()"
            />
          </v-card-title>
          <v-divider />
          <v-card-text>
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
