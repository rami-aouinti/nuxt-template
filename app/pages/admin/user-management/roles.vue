<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

definePageMeta({
  title: 'navigation.roles',
  icon: 'mdi-shield-key-outline',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed<DataTableHeader[]>(() => [
  { title: t('userManagement.roles.table.id'), key: 'id' },
  { title: t('userManagement.roles.table.description'), key: 'description' },
])
const search = ref('')

const { data, pending, error, refresh } = await useFetch('/api/v1/role')

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
                :label="t('common.labels.search')"
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
            <span class="text-h6">{{ t('userManagement.roles.cardTitle') }}</span>
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
              {{ t('userManagement.roles.alerts.loadFailed') }}
            </v-alert>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="pending"
              :search="search"
              item-value="id"
              class="elevation-0"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
