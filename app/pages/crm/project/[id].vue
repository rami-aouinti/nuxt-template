<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppCard from '~/components/App/AppCard.vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'
import { useCrmApi } from '~/composables/useCrmApi'
import type { CrmProject, CrmTask, CrmTaskPayload, CrmTaskStatus } from '~/types/crm'

definePageMeta({
  title: 'navigation.crmProject',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const translate = useTranslateWithFallback()
const { headers: crmHeaders, jsonLdHeaders, withBase } = useCrmApi()
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
const viewMode = ref<'tasks' | 'kanban'>('tasks')
const createDialog = ref(false)
const createLoading = ref(false)
const createTaskForm = reactive({
  name: '',
  description: '',
  statusId: null as number | null,
  deadline: '',
})
const draggingTaskId = ref<number | null>(null)
const activeColumnId = ref<number | 'backlog' | 'done' | null>(null)

async function loadProject() {
  try {
    project.value = await $fetch<CrmProject>(
      withBase(`/projects/${encodeURIComponent(projectId.value)}`),
      {
        headers: crmHeaders.value,
      },
    )
  } catch (error) {
    console.error(error)
    Notify.error(
      translate(
        'crm.notifications.projectError',
        'Impossible de charger le projet',
      ),
    )
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
  const label =
    name && name.length ? name : projectId.value ? `#${projectId.value}` : null
  const baseTitle = translate('navigation.crmProject', 'CRM Project')
  return label ? `${baseTitle} • ${label}` : baseTitle
})

useHead(() => ({
  title: pageTitle.value,
}))

const projectTasks = computed<CrmTask[]>(() => {
  if (!project.value) return []

  const storeTasks = (taskCollection.data?.member ?? []).filter(
    (task) => task.project?.id === project.value?.id,
  )

  const projectEmbeddedTasks = project.value.tasks ?? []

  const merged = new Map<number, CrmTask>()
  projectEmbeddedTasks.forEach((task) => merged.set(task.id, task))
  storeTasks.forEach((task) => merged.set(task.id, task))

  return Array.from(merged.values())
})

const doneStatusKeywords = ['done', 'terminé', 'terminée', 'complete', 'completed', 'fini', 'finie', 'clos', 'close', 'closed']

const isDoneStatus = (status?: CrmTaskStatus | null) => {
  if (!status) return false

  const name = status.name?.toLowerCase?.() ?? ''
  const matchesKeyword = doneStatusKeywords.some((keyword) =>
    name.includes(keyword),
  )

  return matchesKeyword || status.isActive === false
}

const backlogTasks = computed(() =>
  projectTasks.value.filter((task) => !task.status),
)

const doneStatuses = computed(() =>
  (taskStatusCollection.data?.member ?? []).filter((status) =>
    isDoneStatus(status),
  ),
)

const doneStatusId = computed(() => doneStatuses.value[0]?.id ?? null)

const doneTasks = computed(() =>
  projectTasks.value.filter((task) => isDoneStatus(task.status)),
)

const kanbanColumns = computed(() => {
  const statuses = (taskStatusCollection.data?.member ?? []).filter(
    (status) => !isDoneStatus(status),
  )
  const tasks = projectTasks.value.filter(
    (task) => task.status && !isDoneStatus(task.status),
  )

  const grouped = statuses.map((status) => ({
    id: status.id,
    name: status.name,
    tasks: tasks.filter((task) => task.status?.id === status.id),
  }))

  return grouped
})

const statusIndex = computed(() =>
  (taskStatusCollection.data?.member ?? []).reduce<Record<number, CrmTaskStatus>>(
    (acc, status) => {
      acc[status.id] = status
      return acc
    },
    {},
  ),
)

function navigateToTask(taskId: number) {
  router.push(`/project/${projectId.value}/task/${taskId}`)
}

async function updateTaskStatus(
  task: CrmTask,
  statusId: number | 'backlog' | 'done' | null,
) {
  const nextStatusId = (() => {
    if (statusId === 'backlog') return null
    if (statusId === 'done') return doneStatusId.value
    return statusId
  })()

  if (statusId === 'done' && nextStatusId == null) {
    draggingTaskId.value = null
    activeColumnId.value = null
    Notify.error(
      translate(
        'crm.project.kanban.updateError',
        'Impossible de modifier le statut de la tâche.',
      ),
    )
    return
  }

  const alreadyInTarget = (() => {
    if (statusId === 'backlog') return !task.status
    if (statusId === 'done') return isDoneStatus(task.status)
    return task.status?.id === statusId
  })()

  if (alreadyInTarget) {
    draggingTaskId.value = null
    activeColumnId.value = null
    return
  }

  try {
    const statusResource =
      nextStatusId != null ? statusIndex.value[nextStatusId] : undefined

    const payload: CrmTaskPayload & {
      description?: string
      isActive?: boolean
    } = {
      name: task.name,
      description: task.description,
      project: task.project?.['@id'] ?? `/projects/${task.project.id}`,
      deadline: task.deadline,
      assignee:
        task.assignee?.['@id'] ??
        (task.assignee ? `/users/${task.assignee.id}` : undefined),
      timeEstimated: task.timeEstimated,
      timeSpent: task.timeSpent,
      status:
        nextStatusId != null
          ? statusResource?.['@id'] ?? `/task_statuses/${nextStatusId}`
          : null,
      isActive: task.isActive,
    }

    await $fetch(withBase(`/tasks/${task.id}`), {
      method: 'PUT',
      headers: jsonLdHeaders.value,
      body: payload,
    })

    await taskCollection.refresh()
    Notify.success(
      translate('crm.project.kanban.updated', 'Statut mis à jour avec succès'),
    )
  } catch (error) {
    console.error(error)
    Notify.error(
      translate(
        'crm.project.kanban.updateError',
        'Impossible de modifier le statut de la tâche.',
      ),
    )
  } finally {
    draggingTaskId.value = null
    activeColumnId.value = null
  }
}

function onTaskDragStart(event: DragEvent, taskId: number) {
  draggingTaskId.value = taskId
  activeColumnId.value = null

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.setData('text/plain', String(taskId))
  }
}

function onTaskDragEnd() {
  draggingTaskId.value = null
  activeColumnId.value = null
}

function onColumnDragEnter(status: number | 'backlog' | 'done') {
  if (draggingTaskId.value !== null) {
    activeColumnId.value = status
  }
}

function onColumnDragLeave(status: number | 'backlog' | 'done') {
  if (activeColumnId.value === status) {
    activeColumnId.value = null
  }
}

async function onTaskDrop(
  event: DragEvent,
  targetStatus: number | 'backlog' | 'done',
) {
  const draggedTaskId = (() => {
    if (draggingTaskId.value !== null) return draggingTaskId.value
    const transferId = event.dataTransfer?.getData('text/plain') ?? ''
    const parsed = Number.parseInt(transferId, 10)
    return Number.isFinite(parsed) ? parsed : null
  })()

  const task = projectTasks.value.find((item) => item.id === draggedTaskId)
  activeColumnId.value = null

  if (!task) {
    draggingTaskId.value = null
    return
  }

  await updateTaskStatus(task, targetStatus)
}

function resetCreateForm() {
  createTaskForm.name = ''
  createTaskForm.description = ''
  createTaskForm.statusId = null
  createTaskForm.deadline = ''
}

async function createTask() {
  if (!project.value || !createTaskForm.name.trim()) {
    Notify.error(
      translate(
        'crm.project.createTask.nameRequired',
        'Le nom de la tâche est obligatoire.',
      ),
    )
    return
  }

  if (!createTaskForm.deadline.trim()) {
    Notify.error(
      translate(
        'crm.project.createTask.deadlineRequired',
        'Deadline is required.',
      ),
    )
    return
  }

  createLoading.value = true

  const deadline = new Date(createTaskForm.deadline)

  if (Number.isNaN(deadline.getTime())) {
    createLoading.value = false
    Notify.error(
      translate(
        'crm.project.createTask.deadlineInvalid',
        'Deadline must be a valid date.',
      ),
    )
    return
  }

  const payload: CrmTaskPayload & { description?: string } = {
    name: createTaskForm.name.trim(),
    project: project.value['@id'] ?? `/projects/${project.value.id}`,
    description: createTaskForm.description.trim() || undefined,
    deadline: deadline.toISOString(),
  }

  if (createTaskForm.statusId) {
    payload.status =
      statusIndex.value[createTaskForm.statusId]?.['@id'] ??
      `/task_statuses/${createTaskForm.statusId}`
  }

  try {
    await $fetch(withBase('/tasks'), {
      method: 'POST',
      headers: jsonLdHeaders.value,
      body: payload,
    })

    await taskCollection.refresh()
    resetCreateForm()
    createDialog.value = false
    Notify.success(
      translate('crm.project.createTask.success', 'Tâche ajoutée au projet'),
    )
  } catch (error) {
    console.error(error)
    Notify.error(
      translate(
        'crm.project.createTask.error',
        'Impossible de créer la tâche. Merci de réessayer.',
      ),
    )
  } finally {
    createLoading.value = false
  }
}
</script>

<template>
  <div class="crm-project-shell">
    <client-only>
      <teleport to="#app-bar">
        <div class="d-flex align-center gap-2 flex-wrap justify-end">
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-plus-circle"
            class="text-capitalize"
            @click="createDialog = true"
          >
            {{ translate('crm.project.tasks.add', 'Ajouter une tâche') }}
          </v-btn>
          <v-btn-toggle
            v-model="viewMode"
            color="primary"
            divided
            density="comfortable"
            class="elevation-1"
          >
            <v-btn value="tasks" icon="mdi-format-list-checks" />
            <v-btn value="kanban" icon="mdi-view-column" />
          </v-btn-toggle>
        </div>
      </teleport>

      <teleport v-if="viewMode === 'kanban'" to="#app-drawer">
        <AppCard class="pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between mb-3">
            <span class="text-subtitle-2 font-weight-semibold">
              {{ translate('crm.project.kanban.backlog', 'Backlog') }}
            </span>
            <v-chip color="primary" size="x-small" variant="tonal">
              {{ backlogTasks.length }}
            </v-chip>
          </div>

          <div
            class="d-flex flex-column gap-3 kanban-column"
            :class="{
              'kanban-column--active': activeColumnId === 'backlog',
              'kanban-column--dragging': draggingTaskId !== null,
            }"
            @dragenter.prevent="onColumnDragEnter('backlog')"
            @dragover.prevent
            @dragleave="onColumnDragLeave('backlog')"
            @drop.prevent="onTaskDrop($event, 'backlog')"
          >
            <v-card
              v-for="task in backlogTasks"
              :key="task.id"
              class="pa-3 kanban-card"
              elevation="0"
              color="surface"
              variant="tonal"
              draggable
              :data-task-id="task.id"
              @dragstart="onTaskDragStart($event, task.id)"
              @dragend="onTaskDragEnd"
            >
              <div class="d-flex align-center justify-space-between mb-2">
                <NuxtLink
                  :to="`/project/${projectId}/task/${task.id}`"
                  class="font-weight-medium kanban-card__link"
                  @click.stop
                >
                  {{
                    task.name ||
                    translate('crm.project.tasks.noName', 'Tâche sans nom')
                  }}
                </NuxtLink>
                <v-icon icon="mdi-drag-horizontal-variant" size="18" />
              </div>
              <div class="d-flex gap-2 flex-wrap mb-2">
                <v-chip
                  v-if="task.assignee"
                  size="x-small"
                  color="primary"
                  variant="tonal"
                >
                  {{ task.assignee.name }}
                </v-chip>
                <v-chip
                  v-if="task.deadline"
                  size="x-small"
                  color="secondary"
                  variant="tonal"
                >
                  {{ task.deadline?.slice(0, 10) }}
                </v-chip>
                <v-chip
                  v-if="task.timeEstimated"
                  size="x-small"
                  color="secondary"
                  variant="tonal"
                >
                  {{ task.timeEstimated }}m
                </v-chip>
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  task.description ||
                  translate(
                    'crm.project.tasks.noDescription',
                    'Pas de description pour cette tâche',
                  )
                }}
              </div>
            </v-card>

            <div
              v-if="!backlogTasks.length"
              class="text-body-2 text-medium-emphasis text-center py-6 border-dash"
            >
              {{ translate('crm.project.kanban.empty', 'Glissez une tâche ici') }}
            </div>
          </div>
        </AppCard>
      </teleport>

      <teleport v-if="viewMode === 'kanban'" to="#app-drawer-right">
        <AppCard class="pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between mb-3">
            <span class="text-subtitle-2 font-weight-semibold">
              {{ translate('crm.project.kanban.done', 'Done') }}
            </span>
            <v-chip color="primary" size="x-small" variant="tonal">
              {{ doneTasks.length }}
            </v-chip>
          </div>

          <div
            class="d-flex flex-column gap-3 kanban-column"
            :class="{
              'kanban-column--active': activeColumnId === 'done',
              'kanban-column--dragging': draggingTaskId !== null,
            }"
            @dragenter.prevent="onColumnDragEnter('done')"
            @dragover.prevent
            @dragleave="onColumnDragLeave('done')"
            @drop.prevent="onTaskDrop($event, 'done')"
          >
            <v-card
              v-for="task in doneTasks"
              :key="task.id"
              class="pa-3 kanban-card"
              elevation="0"
              color="surface"
              variant="tonal"
              draggable
              :data-task-id="task.id"
              @dragstart="onTaskDragStart($event, task.id)"
              @dragend="onTaskDragEnd"
            >
              <div class="d-flex align-center justify-space-between mb-2">
                <NuxtLink
                  :to="`/project/${projectId}/task/${task.id}`"
                  class="font-weight-medium kanban-card__link"
                  @click.stop
                >
                  {{
                    task.name ||
                    translate('crm.project.tasks.noName', 'Tâche sans nom')
                  }}
                </NuxtLink>
                <v-chip
                  v-if="task.status"
                  color="primary"
                  size="x-small"
                  variant="tonal"
                  class="text-capitalize"
                >
                  {{ task.status.name }}
                </v-chip>
              </div>
              <div class="d-flex gap-2 flex-wrap mb-2">
                <v-chip
                  v-if="task.assignee"
                  size="x-small"
                  color="primary"
                  variant="tonal"
                >
                  {{ task.assignee.name }}
                </v-chip>
                <v-chip
                  v-if="task.deadline"
                  size="x-small"
                  color="secondary"
                  variant="tonal"
                >
                  {{ task.deadline?.slice(0, 10) }}
                </v-chip>
                <v-chip
                  v-if="task.timeEstimated"
                  size="x-small"
                  color="secondary"
                  variant="tonal"
                >
                  {{ task.timeEstimated }}m
                </v-chip>
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  task.description ||
                  translate(
                    'crm.project.tasks.noDescription',
                    'Pas de description pour cette tâche',
                  )
                }}
              </div>
            </v-card>

            <div
              v-if="!doneTasks.length"
              class="text-body-2 text-medium-emphasis text-center py-6 border-dash"
            >
              {{ translate('crm.project.kanban.empty', 'Glissez une tâche ici') }}
            </div>
          </div>
        </AppCard>
      </teleport>
    </client-only>

    <v-container fluid class="crm-project-page py-8">
      <v-row>
        <v-col v-if="viewMode === 'tasks'" cols="12">
          <AppCard class="pa-4" elevation="2" hover>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-subtitle-1 font-weight-semibold">
                {{ translate('crm.project.tasks.title', 'Tâches du projet') }}
              </div>
              <v-chip color="primary" size="small" variant="tonal">{{
                projectTasks.length
              }}</v-chip>
            </div>

            <v-list lines="two" nav>
            <v-list-item
              v-for="task in projectTasks"
              :key="task.id"
              :value="task.id"
              rounded
              class="mb-2"
              @click="navigateToTask(task.id)"
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
                      translate(
                        'crm.project.tasks.noDescription',
                        'Pas de description pour cette tâche',
                      )
                    }}
                  </span>
                </template>
              </v-list-item>
            </v-list>
          </AppCard>
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
                <AppCard class="pa-4 w-100" elevation="2" hover>
                  <div class="d-flex align-center justify-space-between mb-3">
                    <span class="text-subtitle-2 font-weight-semibold">{{
                      column.name
                    }}</span>
                    <v-chip color="primary" size="x-small" variant="tonal">
                      {{ column.tasks.length }}
                    </v-chip>
                  </div>
                  <div
                    class="d-flex flex-column gap-3 kanban-column"
                :class="{
                  'kanban-column--active': activeColumnId === column.id,
                  'kanban-column--dragging': draggingTaskId !== null,
                }"
                @dragenter.prevent="onColumnDragEnter(column.id as number)"
                @dragover.prevent
                @dragleave="onColumnDragLeave(column.id as number)"
                @drop.prevent="onTaskDrop($event, column.id as number)"
              >
                <v-card
                  v-for="task in column.tasks"
                  :key="task.id"
                  class="pa-3 kanban-card"
                  elevation="0"
                  color="surface"
                  variant="tonal"
                  draggable
                  :data-task-id="task.id"
                  @dragstart="onTaskDragStart($event, task.id)"
                  @dragend="onTaskDragEnd"
                >
                  <div class="d-flex align-center justify-space-between mb-2">
                    <NuxtLink
                      :to="`/project/${projectId}/task/${task.id}`"
                      class="font-weight-medium kanban-card__link"
                      @click.stop
                    >
                      {{
                        task.name ||
                        translate(
                          'crm.project.tasks.noName',
                          'Tâche sans nom',
                        )
                      }}
                    </NuxtLink>
                    <v-icon icon="mdi-drag-horizontal-variant" size="18" />
                  </div>
                      <div class="d-flex gap-2 flex-wrap mb-2">
                        <v-chip
                          v-if="task.assignee"
                          size="x-small"
                          color="primary"
                          variant="tonal"
                        >
                          {{ task.assignee.name }}
                        </v-chip>
                        <v-chip
                          v-if="task.deadline"
                          size="x-small"
                          color="secondary"
                          variant="tonal"
                        >
                          {{ task.deadline?.slice(0, 10) }}
                        </v-chip>
                        <v-chip
                          v-if="task.timeEstimated"
                          size="x-small"
                          color="secondary"
                          variant="tonal"
                        >
                          {{ task.timeEstimated }}m
                        </v-chip>
                      </div>
                      <div class="text-body-2 text-medium-emphasis">
                        {{
                          task.description ||
                          translate(
                            'crm.project.tasks.noDescription',
                            'Pas de description pour cette tâche',
                          )
                        }}
                      </div>
                    </v-card>

                    <div
                      v-if="!column.tasks.length"
                      class="text-body-2 text-medium-emphasis text-center py-6 border-dash"
                    >
                      {{ translate('crm.project.kanban.empty', 'Glissez une tâche ici') }}
                    </div>
                  </div>
                </AppCard>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="createDialog" max-width="520">
      <AppCard class="pa-4" elevation="3">
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <div class="text-subtitle-1 font-weight-semibold">
              {{ translate('crm.project.createTask.title', 'Nouvelle tâche') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ translate('crm.project.createTask.subtitle', 'Ajoutez rapidement une tâche dans le backlog ou un statut existant') }}
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="createDialog = false" />
        </div>

        <v-form class="d-flex flex-column gap-4" @submit.prevent="createTask">
          <v-text-field
            v-model="createTaskForm.name"
            :label="translate('crm.project.createTask.name', 'Nom de la tâche')"
            variant="outlined"
            density="comfortable"
            required
          />

          <v-textarea
            v-model="createTaskForm.description"
            :label="translate('crm.project.createTask.description', 'Description (optionnelle)')"
            rows="3"
            variant="outlined"
            auto-grow
          />

          <v-text-field
            v-model="createTaskForm.deadline"
            type="date"
            :label="translate('crm.project.drawerRight.deadline', 'Deadline')"
            variant="outlined"
            density="comfortable"
            required
          />

          <v-select
            v-model="createTaskForm.statusId"
            :items="taskStatusCollection.data?.member ?? []"
            :item-title="(item) => item.name"
            :item-value="(item) => item.id"
            clearable
            :label="translate('crm.project.createTask.status', 'Statut (optionnel)')"
            variant="outlined"
            density="comfortable"
          />

          <div class="d-flex gap-2 justify-end">
            <v-btn variant="text" color="secondary" @click="createDialog = false">
              {{ translate('common.actions.cancel', 'Annuler') }}
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              :loading="createLoading"
              type="submit"
            >
              {{ translate('crm.project.createTask.submit', 'Créer la tâche') }}
            </v-btn>
          </div>
        </v-form>
      </AppCard>
    </v-dialog>
  </div>
</template>

<style scoped>
.crm-project-page {
  padding-inline: 24px;
}

.kanban-column {
  min-height: 280px;
  border: 1px dashed rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.kanban-column--active {
  background: linear-gradient(145deg, rgba(94, 135, 255, 0.08), rgba(94, 255, 201, 0.05));
  border-color: rgba(94, 135, 255, 0.4);
}

.kanban-column--dragging {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.1);
}

.kanban-card {
  cursor: grab;
}

.kanban-card:active {
  cursor: grabbing;
}

.kanban-card__link {
  color: inherit;
  text-decoration: none;
}

.border-dash {
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}
</style>
