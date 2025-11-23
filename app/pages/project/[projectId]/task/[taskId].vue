<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppCard from '~/components/App/AppCard.vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmApi } from '~/composables/useCrmApi'
import type { CrmTask } from '~/types/crm'

definePageMeta({
  title: 'navigation.crmTask',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const translate = useTranslateWithFallback()
const { headers: crmHeaders, withBase } = useCrmApi()
const { locale } = useI18n()

const task = ref<CrmTask | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

const projectId = computed(() => {
  const value = route.params.projectId
  if (Array.isArray(value)) return value[0]
  return typeof value === 'string' ? value : ''
})

const taskId = computed(() => {
  const value = route.params.taskId
  if (Array.isArray(value)) return value[0]
  return typeof value === 'string' ? value : ''
})

const pageTitle = computed(() => {
  const base = translate('crm.project.tasks.detail', 'Détail de la tâche')
  return task.value?.name ? `${task.value.name} • ${base}` : base
})

useHead(() => ({
  title: pageTitle.value,
}))

const statusLabel = computed(
  () =>
    task.value?.status?.name ??
    translate('crm.project.kanban.backlog', 'Backlog'),
)

const metaItems = computed(() => [
  {
    icon: 'mdi-briefcase',
    label: translate('crm.project.detail.project', 'Projet'),
    value: task.value?.project?.name ?? `#${projectId.value}`,
  },
  {
    icon: 'mdi-account',
    label: translate('crm.project.drawerRight.assignee', 'Assigné à'),
    value:
      task.value?.assignee?.name ??
      translate('crm.project.drawerRight.unassigned', 'Non assigné'),
  },
  {
    icon: 'mdi-calendar-clock',
    label: translate('crm.project.drawerRight.deadline', 'Deadline'),
    value:
      task.value?.deadline ||
      translate('crm.project.tasks.noDeadline', 'Aucune date'),
  },
])

const timeBadges = computed(() => [
  {
    icon: 'mdi-timer-sand',
    label: translate('crm.project.drawerRight.estimate', 'Estimée'),
    value: `${task.value?.timeEstimated ?? 0}m`,
  },
  {
    icon: 'mdi-progress-clock',
    label: translate('crm.project.drawerRight.spent', 'Passé'),
    value: `${task.value?.timeSpent ?? 0}m`,
  },
  {
    icon: 'mdi-update',
    label: translate('common.labels.updatedAt', 'Mis à jour'),
    value: task.value?.updatedAt ?? '—',
  },
])

async function fetchTask() {
  loading.value = true
  errorMessage.value = null

  try {
    task.value = await $fetch<CrmTask>(
      withBase(`/tasks/${encodeURIComponent(taskId.value)}`),
      {
        headers: crmHeaders.value,
      },
    )
  } catch (error) {
    console.error(error)
    errorMessage.value = translate(
      'crm.project.tasks.error',
      'Impossible de charger cette tâche pour le moment.',
    )
  } finally {
    loading.value = false
  }
}

await fetchTask()

watch([projectId, taskId, locale], async () => {
  await fetchTask()
})

function goBackToProject() {
  router.push(`/crm/project/${projectId.value}`)
}
</script>

<template>
  <div class="task-detail-shell py-8">
    <client-only>
      <teleport to="#app-drawer">
        <AppCard class="pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-subtitle-1 font-weight-semibold">
              {{
                translate('crm.project.tasks.overview', 'Aperçu de la tâche')
              }}
            </div>
            <v-chip
              color="primary"
              size="small"
              variant="tonal"
              class="text-capitalize"
            >
              {{ statusLabel }}
            </v-chip>
          </div>

          <div class="d-flex flex-column gap-3">
            <div class="d-flex gap-3 align-center">
              <v-avatar size="46" color="primary" variant="tonal">
                <v-icon icon="mdi-check-decagram" />
              </v-avatar>
              <div>
                <div class="text-subtitle-2 font-weight-semibold">
                  {{ task?.name }}
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ translate('crm.project.detail.project', 'Projet') }}:
                  {{ task?.project?.name ?? `#${projectId}` }}
                </div>
              </div>
            </div>

            <v-divider class="my-2" />

            <div class="d-flex flex-column gap-2">
              <div class="text-body-2 text-medium-emphasis">
                {{ translate('crm.project.tasks.description', 'Description') }}
              </div>
              <div class="text-body-1">
                {{
                  task?.description ||
                  translate(
                    'crm.project.drawerRight.noDescription',
                    'Aucune description fournie',
                  )
                }}
              </div>
            </div>
          </div>
        </AppCard>
      </teleport>

      <teleport to="#app-drawer-right">
        <AppCard class="pa-4 h-100" elevation="2">
          <div class="text-subtitle-1 font-weight-semibold mb-4">
            {{ translate('crm.project.detail.meta', 'Informations clés') }}
          </div>

          <div class="d-flex flex-column gap-3">
            <div
              v-for="item in metaItems"
              :key="item.label"
              class="d-flex align-center justify-space-between py-2 px-3 rounded-lg meta-row"
            >
              <div class="d-flex align-center gap-3">
                <v-avatar size="34" color="surface" variant="flat">
                  <v-icon :icon="item.icon" />
                </v-avatar>
                <div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ item.label }}
                  </div>
                  <div class="text-subtitle-2 font-weight-semibold">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </teleport>
    </client-only>

    <v-container class="py-0" fluid>
      <div
        class="d-flex align-center justify-space-between flex-wrap gap-3 mb-6"
      >
        <div>
          <div
            class="text-body-2 text-medium-emphasis d-flex align-center gap-2"
          >
            <v-btn
              variant="text"
              color="primary"
              prepend-icon="mdi-arrow-left"
              class="text-capitalize px-0"
              @click="goBackToProject"
            >
              {{ translate('crm.project.detail.back', 'Retour au projet') }}
            </v-btn>
            <v-chip
              color="primary"
              size="x-small"
              variant="flat"
              class="text-capitalize"
            >
              {{ statusLabel }}
            </v-chip>
          </div>
          <h1 class="text-h5 font-weight-bold mt-2 mb-1">
            {{ task?.name || pageTitle }}
          </h1>
          <p class="text-body-2 text-medium-emphasis">
            {{
              task?.description ||
              translate(
                'crm.project.tasks.noDescription',
                'Pas de description pour cette tâche',
              )
            }}
          </p>
        </div>

        <div class="d-flex gap-2 flex-wrap">
          <v-chip
            v-for="badge in timeBadges"
            :key="badge.label"
            color="secondary"
            variant="tonal"
            :prepend-icon="badge.icon"
            class="text-capitalize"
          >
            <span class="font-weight-semibold mr-1">{{ badge.value }}</span>
            <span class="text-body-2 text-medium-emphasis">{{
              badge.label
            }}</span>
          </v-chip>
        </div>
      </div>

      <v-row dense class="mt-4">
        <v-col cols="12">
          <AppCard class="pa-4" elevation="2">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-subtitle-1 font-weight-semibold">
                {{ translate('crm.project.detail.timeline', 'Chronologie') }}
              </div>
              <v-chip color="secondary" variant="tonal" size="small">
                {{ translate('common.labels.createdAt', 'Créée le') }}
                {{ task?.createdAt || '—' }}
              </v-chip>
            </div>

            <v-timeline side="end" truncate-line="both">
              <v-timeline-item
                dot-color="primary"
                size="small"
                :title="
                  translate('crm.project.tasks.created', 'Création de la tâche')
                "
                :subtitle="task?.createdAt || '—'"
              />
              <v-timeline-item
                dot-color="secondary"
                size="small"
                :title="
                  translate(
                    'crm.project.detail.lastUpdate',
                    'Dernière mise à jour',
                  )
                "
                :subtitle="task?.updatedAt || '—'"
              />
              <v-timeline-item
                dot-color="info"
                size="small"
                :title="
                  translate('crm.project.drawerRight.deadline', 'Deadline')
                "
                :subtitle="
                  task?.deadline ||
                  translate('crm.project.tasks.noDeadline', 'Aucune date')
                "
              />
            </v-timeline>
          </AppCard>
        </v-col>
      </v-row>

      <div
        v-if="loading"
        class="loading-state d-flex align-center justify-center mt-6"
      >
        <v-progress-circular indeterminate color="primary" size="32" />
        <span class="ml-3 text-body-2 text-medium-emphasis">
          {{
            translate('crm.project.tasks.loading', 'Chargement de la tâche...')
          }}
        </span>
      </div>

      <div
        v-if="errorMessage"
        class="error-state d-flex align-center gap-3 mt-4"
      >
        <v-icon icon="mdi-alert-circle" color="error" />
        <span class="text-body-2">{{ errorMessage }}</span>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.task-detail-shell {
  padding-inline: 24px;
}

.meta-row {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.loading-state,
.error-state {
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
