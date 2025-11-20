<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'
import { useCrmApi } from '~/composables/useCrmApi'
import type { CrmProject, CrmTask } from '~/types/crm'

definePageMeta({
  title: 'navigation.crmProject',
  middleware: 'auth',
})

const route = useRoute()
const translate = useTranslateWithFallback()
const { headers: crmHeaders, withBase } = useCrmApi()
const { locale } = useI18n()
const crmStore = useCrmStore()

const taskCollection = crmStore.tasks
const taskStatusCollection = crmStore.taskStatuses

await Promise.all([taskCollection.fetch(), taskStatusCollection.fetch()])

const projectId = computed(() => {
  const value = route.params.id
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return typeof value === 'string' ? value : ''
})

const project = ref<CrmProject | null>(null)
const projectLoading = ref(false)
const viewMode = ref<'tasks' | 'kanban'>('tasks')
const selectedTaskId = ref<number | null>(null)

async function loadProject() {
  projectLoading.value = true

  try {
    project.value = await $fetch<CrmProject>(
      withBase(`/projects/${encodeURIComponent(projectId.value)}`),
      {
        headers: crmHeaders.value,
      },
    )
  } catch (error) {
    console.error(error)
    Notify.error(translate('crm.notifications.projectError', 'Impossible de charger le projet'))
  } finally {
    projectLoading.value = false
  }
}

await loadProject()

watch(
  () => [projectId.value, locale.value],
  async () => {
    await loadProject()
  },
)

const pageTitle = computed(() => {
  const name = project.value?.name?.trim()
  const label = name && name.length ? name : projectId.value ? `#${projectId.value}` : null
  const baseTitle = translate('navigation.crmProject', 'CRM Project')
  return label ? `${baseTitle} • ${label}` : baseTitle
})

useHead(() => ({
  title: pageTitle.value,
}))

const projectTasks = computed<CrmTask[]>(() => {
  if (!project.value) return []

  return (taskCollection.data?.member ?? []).filter(
    (task) => task.project?.id === project.value?.id,
  )
})

watch(
  projectTasks,
  (tasks) => {
    if (!tasks.length) {
      selectedTaskId.value = null
      return
    }

    if (!tasks.some((task) => task.id === selectedTaskId.value)) {
      selectedTaskId.value = tasks[0]?.id ?? null
    }
  },
  { immediate: true },
)

const selectedTask = computed(() =>
  projectTasks.value.find((task) => task.id === selectedTaskId.value) ?? null,
)

const navigationItems = computed(() => [
  {
    value: 'tasks',
    label: translate('crm.project.nav.tasks', 'Liste des tâches'),
    icon: 'mdi-format-list-checks',
  },
  {
    value: 'kanban',
    label: translate('crm.project.nav.kanban', 'Kanban'),
    icon: 'mdi-view-kanban',
  },
])

const taskNavigationItems = computed(() =>
  projectTasks.value.map((task) => ({
    value: task.id,
    label: task.name,
    status: task.status,
  })),
)

const kanbanColumns = computed(() => {
  const statuses = taskStatusCollection.data?.member ?? []
  const tasks = projectTasks.value

  const grouped = statuses.map((status) => ({
    id: status.id,
    name: status.name,
    tasks: tasks.filter((task) => task.status?.id === status.id),
  }))

  const backlog = tasks.filter((task) => !task.status)

  if (backlog.length) {
    grouped.unshift({
      id: 'backlog',
      name: translate('crm.project.kanban.backlog', 'À classer'),
      tasks: backlog,
    })
  }

  return grouped
})

function selectTask(taskId: number) {
  selectedTaskId.value = taskId
  viewMode.value = 'tasks'
}
</script>

<template>
  <div class="crm-project-shell">
    <client-only>
      <teleport to="#app-drawer">
        <AppNavigationList
          class="pb-6"
          :items="navigationItems"
          :title="translate('crm.project.drawer.title', 'Navigation projet')"
          :description="
            translate(
              'crm.project.drawer.subtitle',
              'Consultez vos tâches ou passez en vue Kanban.',
            )
          "
        >
          <template #item="{ item }">
            <button
              type="button"
              class="stat-card d-flex align-center justify-space-between mb-3 w-100 px-3"
              :class="{ 'bg-primary text-on-primary': viewMode === item.value }"
              @click="viewMode = item.value"
            >
              <div class="d-flex align-center gap-3">
                <v-icon v-if="item.icon" :icon="item.icon" size="22" />
                <span class="font-weight-medium">{{ item.label }}</span>
              </div>
              <v-chip v-if="item.value === 'tasks'" color="primary" size="x-small" variant="tonal">
                {{ projectTasks.length }}
              </v-chip>
            </button>
          </template>
        </AppNavigationList>

        <AppNavigationList
          v-if="projectTasks.length"
          :items="taskNavigationItems"
          :title="translate('crm.project.drawer.tasksTitle', 'Tâches')"
          :description="translate('crm.project.drawer.tasksSubtitle', 'Sélectionnez une tâche pour la détailler.')"
        >
          <template #item="{ item }">
            <button
              type="button"
              class="stat-card d-flex align-center justify-space-between mb-3 w-100 px-3"
              :class="{ 'bg-primary text-on-primary': selectedTaskId === item.value }"
              @click="selectTask(item.value)"
            >
              <div class="d-flex flex-column text-start">
                <span class="font-weight-medium">{{ item.label }}</span>
                <span class="text-body-2 text-medium-emphasis">
                  {{ translate('crm.project.drawer.taskLabel', 'Tâche du projet') }}
                </span>
              </div>
              <v-chip
                v-if="item.status"
                color="secondary"
                size="x-small"
                variant="tonal"
                class="text-capitalize"
              >
                {{ item.status?.name }}
              </v-chip>
            </button>
          </template>
        </AppNavigationList>
      </teleport>
    </client-only>

    <client-only>
      <teleport to="#app-drawer-right">
        <AppCard class="pa-5" elevation="2">
          <div class="animated-badge mb-4">
            <span class="animated-badge__pulse" />
            {{ translate('crm.project.drawerRight.title', 'Détails de la tâche') }}
          </div>

          <div v-if="selectedTask" class="d-flex flex-column gap-3">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-subtitle-1 font-weight-semibold">{{ selectedTask.name }}</div>
                <div class="text-body-2 text-medium-emphasis">
                  {{
                    translate(
                      'crm.project.drawerRight.assignee',
                      'Assigné à',
                    )
                  }}
                  {{ selectedTask.assignee?.name ?? translate('crm.project.drawerRight.unassigned', 'Non assigné') }}
                </div>
              </div>
              <v-chip
                v-if="selectedTask.status"
                color="primary"
                size="small"
                variant="tonal"
                class="text-capitalize"
              >
                {{ selectedTask.status.name }}
              </v-chip>
            </div>

            <p class="text-body-1 mb-2">
              {{ selectedTask.description || translate('crm.project.drawerRight.noDescription', 'Aucune description fournie') }}
            </p>

            <div class="d-flex flex-wrap gap-2">
              <v-chip v-if="selectedTask.deadline" color="secondary" variant="tonal" size="small">
                {{ translate('crm.project.drawerRight.deadline', 'Deadline') }}: {{ selectedTask.deadline }}
              </v-chip>
              <v-chip color="secondary" variant="tonal" size="small">
                {{ translate('crm.project.drawerRight.estimate', 'Estimée') }}: {{ selectedTask.timeEstimated }}m
              </v-chip>
              <v-chip color="secondary" variant="tonal" size="small">
                {{ translate('crm.project.drawerRight.spent', 'Passé') }}: {{ selectedTask.timeSpent }}m
              </v-chip>
            </div>
          </div>

          <div v-else class="text-body-2 text-medium-emphasis">
            {{ translate('crm.project.drawerRight.placeholder', 'Aucune tâche sélectionnée.') }}
          </div>
        </AppCard>
      </teleport>
    </client-only>

    <v-container fluid class="crm-project-page">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-6" :loading="projectLoading" variant="tonal">
          <div class="d-flex flex-wrap justify-space-between align-start gap-4">
            <div class="d-flex flex-column gap-2">
              <div class="text-h5 font-weight-bold">
                {{ project?.name || translate('crm.project.header.placeholder', 'Projet CRM') }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  project?.description ||
                    translate(
                      'crm.project.header.description',
                      'Suivez les tâches et le statut du projet en temps réel.',
                    )
                }}
              </div>
              <div class="d-flex flex-wrap gap-2">
                <v-chip v-if="project?.client" color="primary" variant="tonal" size="small">
                  {{ project.client.name }}
                </v-chip>
                <v-chip v-if="project?.status" color="secondary" variant="tonal" size="small">
                  {{ project.status.name }}
                </v-chip>
                <v-chip v-if="project?.type" color="secondary" variant="text" size="small">
                  {{ project.type.name }}
                </v-chip>
              </div>
            </div>
            <div class="d-flex flex-column gap-2 align-end">
              <v-chip color="primary" variant="tonal" size="small">
                {{ translate('crm.project.header.tasksCount', 'Tâches') }}: {{ projectTasks.length }}
              </v-chip>
              <v-chip color="secondary" variant="tonal" size="small">
                {{ translate('crm.project.header.documentsCount', 'Documents') }}: {{ project?.documents?.length ?? 0 }}
              </v-chip>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="viewMode === 'tasks'" cols="12">
        <v-card class="pa-4" elevation="1">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-subtitle-1 font-weight-semibold">
              {{ translate('crm.project.tasks.title', 'Tâches du projet') }}
            </div>
            <v-chip color="primary" size="small" variant="tonal">{{ projectTasks.length }}</v-chip>
          </div>

          <v-list lines="two" nav>
            <v-list-item
              v-for="task in projectTasks"
              :key="task.id"
              :value="task.id"
              rounded
              class="mb-2"
              @click="selectTask(task.id)"
            >
              <template #title>
                <div class="d-flex align-center justify-space-between w-100">
                  <span class="font-weight-medium">{{ task.name }}</span>
                  <v-chip
                    v-if="task.status"
                    color="secondary"
                    size="x-small"
                    variant="tonal"
                    class="text-capitalize"
                  >
                    {{ task.status.name }}
                  </v-chip>
                </div>
              </template>
              <template #subtitle>
                <span class="text-body-2 text-medium-emphasis">
                  {{
                    task.description ||
                      translate('crm.project.tasks.noDescription', 'Pas de description pour cette tâche')
                  }}
                </span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col v-else cols="12">
        <div class="d-flex flex-column gap-4">
          <div class="text-subtitle-1 font-weight-semibold">
            {{ translate('crm.project.kanban.title', 'Kanban du projet') }}
          </div>
          <v-row dense>
            <v-col
              v-for="column in kanbanColumns"
              :key="column.id"
              cols="12"
              md="3"
              class="d-flex"
            >
              <AppCard class="pa-4 w-100" elevation="1">
                <div class="d-flex align-center justify-space-between mb-3">
                  <span class="text-subtitle-2 font-weight-semibold">{{ column.name }}</span>
                  <v-chip color="primary" size="x-small" variant="tonal">
                    {{ column.tasks.length }}
                  </v-chip>
                </div>
                <div class="d-flex flex-column gap-3">
                  <v-card
                    v-for="task in column.tasks"
                    :key="task.id"
                    class="pa-3"
                    elevation="0"
                    variant="tonal"
                    @click="selectTask(task.id)"
                  >
                    <div class="d-flex align-center justify-space-between">
                      <span class="font-weight-medium">{{ task.name }}</span>
                      <v-icon icon="mdi-drag-horizontal-variant" size="18" />
                    </div>
                    <div class="text-body-2 text-medium-emphasis mt-1">
                      {{
                        task.description ||
                          translate('crm.project.tasks.noDescription', 'Pas de description pour cette tâche')
                      }}
                    </div>
                  </v-card>
                </div>
              </AppCard>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.crm-project-page {
  padding-inline: 24px;
}

.stat-card {
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.stat-card:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
