<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '~/components/App/AppCard.vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmStore } from '~/stores/crm'

definePageMeta({
  title: 'navigation.crm',
  middleware: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const translate = useTranslateWithFallback()

const crmStore = useCrmStore()

const clientCollection = crmStore.clients
const contactCollection = crmStore.contacts
const projectCollection = crmStore.projects
const taskCollection = crmStore.tasks

await Promise.all([
  clientCollection.fetch(),
  contactCollection.fetch(),
  projectCollection.fetch(),
  taskCollection.fetch(),
])

const clientItems = computed(() => clientCollection.data?.member ?? [])
const contactItems = computed(() => contactCollection.data?.member ?? [])
const projectItems = computed(() => projectCollection.data?.member ?? [])
const taskItems = computed(() => taskCollection.data?.member ?? [])

const projectNavigationItems = computed(() =>
  projectItems.value.map((project) => ({
    value: project.id,
    to: localePath({
      name: 'crm-project-id',
      params: { id: project.id },
    }),
    label: project.name,
    icon: 'mdi-briefcase-outline',
  })),
)

const clientNavigationItems = computed(() =>
  clientItems.value.map((client) => ({
    value: client.id,
    to: localePath({
      name: 'crm-client-id',
      params: { id: client.id },
    }),
    label: client.name,
    icon: 'mdi-account-tie-outline',
    contacts: client.contacts ?? [],
  })),
)

const stats = computed(() => [
  {
    label: translate('crm.dashboard.clients', 'Clients'),
    value: clientItems.value.length,
    icon: 'mdi-account-group-outline',
    color: 'primary',
  },
  {
    label: translate('crm.dashboard.contacts', 'Contacts'),
    value: contactItems.value.length,
    icon: 'mdi-card-account-mail-outline',
    color: 'secondary',
  },
  {
    label: translate('crm.dashboard.tasks', 'Tâches'),
    value: taskItems.value.length,
    icon: 'mdi-format-list-checkbox',
    color: 'info',
  },
])
</script>

<template>
  <div class="crm-page">
    <client-only>
      <teleport to="#app-drawer">
        <AppNavigationList
          class="pb-6"
          :items="projectNavigationItems"
          :title="translate('crm.drawer.projectsTitle', 'Projets')"
          :description="
            translate(
              'crm.drawer.projectsSubtitle',
              'Accédez rapidement à vos projets actifs.',
            )
          "
        >
          <template #item="{ item }">
            <NuxtLink
              class="nav-pill text-decoration-none"
              :to="item.to"
              style="color: inherit"
            >
              <div class="d-flex align-center gap-3">
                <v-icon v-if="item.icon" :icon="item.icon" size="22" />
                <span class="text-subtitle-2 font-weight-medium text-truncate">
                  {{ item.label }}
                </span>
              </div>
            </NuxtLink>
          </template>
        </AppNavigationList>
      </teleport>
    </client-only>

    <client-only>
      <teleport to="#app-drawer-right">
        <AppNavigationList
          class="pb-6"
          :items="clientNavigationItems"
          :title="translate('crm.drawer.clientsTitle', 'Clients actifs')"
          :description="
            translate(
              'crm.drawer.clientsSubtitle',
              'Naviguez parmi vos clients et accédez à leurs fiches.',
            )
          "
        >
          <template #item="{ item }">
            <NuxtLink
              class="nav-pill text-decoration-none"
              :to="item.to"
              style="color: inherit"
            >
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center gap-3">
                  <v-icon v-if="item.icon" :icon="item.icon" size="22" />
                  <span class="text-subtitle-2 font-weight-medium text-truncate">
                    {{ item.label }}
                  </span>
                </div>
                <v-chip color="secondary" size="x-small" variant="tonal">
                  {{ item.contacts?.length ?? 0 }}
                </v-chip>
              </div>
            </NuxtLink>
          </template>
        </AppNavigationList>
      </teleport>
    </client-only>

    <v-container fluid class="py-8">
      <v-row class="mb-6">
        <v-col cols="12">
          <AppCard class="pa-6 gradient-hero" elevation="3" hover>
            <div class="d-flex align-center justify-space-between flex-wrap gap-4">
              <div>
                <div class="text-h5 font-weight-bold mb-2">
                  {{ translate('crm.pageTitle', 'Espace CRM') }}
                </div>
                <div class="text-body-2 text-high-emphasis">
                  {{
                    translate(
                      'crm.pageDescription',
                      'Une vue épurée pour suivre votre activité en un clin d’œil.',
                    )
                  }}
                </div>
              </div>
              <v-chip color="primary" size="large" variant="flat" class="elevated-chip">
                <v-icon icon="mdi-chart-areaspline" start />
                {{ t('common.dashboard', 'Dashboard') }}
              </v-chip>
            </div>
          </AppCard>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col v-for="stat in stats" :key="stat.label" cols="12" md="4">
          <AppCard class="pa-5 h-100 glass-card" elevation="2" hover>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="d-flex align-center">
                <v-avatar :color="stat.color" variant="tonal" size="48">
                  <v-icon :icon="stat.icon" size="26" />
                </v-avatar>
                <div class="ms-4">
                  <div class="text-caption text-uppercase text-medium-emphasis">
                    {{ stat.label }}
                  </div>
                  <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
                </div>
              </div>
              <v-icon icon="mdi-chevron-right" size="22" class="text-medium-emphasis" />
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{
                translate(
                  'crm.dashboard.quickLook',
                  'Suivez vos indicateurs clés en un coup d’œil.',
                )
              }}
            </div>
          </AppCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.crm-page {
  padding-inline: 24px;
}

.nav-pill {
  display: block;
  padding: 10px 14px;
  border-radius: 14px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.nav-pill:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.gradient-hero {
  background: linear-gradient(135deg, rgba(92, 107, 192, 0.16), rgba(66, 165, 245, 0.18));
}

.glass-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.86));
}

.elevated-chip {
  box-shadow: 0 10px 26px rgba(var(--v-theme-primary), 0.18);
}
</style>
