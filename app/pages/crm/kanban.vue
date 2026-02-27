<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { Notify } from '~/stores/notification'
import { useCrmApi } from '~/composables/useCrmApi'

definePageMeta({
  title: 'Sprint Kanban',
  middleware: 'auth',
})

type TaskStatus = 'todo' | 'in_progress' | 'done' | string

interface SprintUser {
  id: string
  username: string
  firstName?: string
  lastName?: string
}

interface SprintTask {
  id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string | null
  owner?: SprintUser | null
}

interface SprintTaskRequest {
  id: string
  requestedStatus?: TaskStatus
  time?: string
  requester?: SprintUser | null
}

interface SprintTaskGroup {
  task: SprintTask
  taskRequests: SprintTaskRequest[]
}

interface SprintGroupedResponse {
  sprintId: string
  groupedByTask: SprintTaskGroup[]
}

const route = useRoute()
const router = useRouter()
const translate = useTranslateWithFallback()
const { headers: crmHeaders, withBase } = useCrmApi()

const loading = ref(false)
const sprint = ref<SprintGroupedResponse | null>(null)

const sprintId = computed(() => {
  const value = route.query.sprintId
  if (Array.isArray(value)) return value[0] ?? ''
  if (typeof value === 'string' && value.trim().length > 0) return value
  return '73000000-0000-1000-8000-000000000001'
})

const sprintIdInput = ref(sprintId.value)

function normalizeStatus(status?: TaskStatus | null): 'todo' | 'in_progress' | 'done' {
  if (status === 'done') return 'done'
  if (status === 'in_progress') return 'in_progress'
  return 'todo'
}

function getEntryStatus(entry: SprintTaskGroup): 'todo' | 'in_progress' | 'done' {
  if (entry.taskRequests.length > 0) {
    const sortedRequests = [...entry.taskRequests].sort((left, right) => {
      const leftDate = left.time ? Date.parse(left.time) : 0
      const rightDate = right.time ? Date.parse(right.time) : 0
      return rightDate - leftDate
    })
    return normalizeStatus(sortedRequests[0]?.requestedStatus)
  }

  return normalizeStatus(entry.task.status)
}

const columns = computed(() => {
  const entries = sprint.value?.groupedByTask ?? []
  return [
    {
      key: 'todo',
      title: translate('crm.sprint.kanban.todo', 'À faire'),
      items: entries.filter((entry) => getEntryStatus(entry) === 'todo'),
    },
    {
      key: 'in_progress',
      title: translate('crm.sprint.kanban.inProgress', 'En cours'),
      items: entries.filter((entry) => getEntryStatus(entry) === 'in_progress'),
    },
    {
      key: 'done',
      title: translate('crm.sprint.kanban.done', 'Terminé'),
      items: entries.filter((entry) => getEntryStatus(entry) === 'done'),
    },
  ]
})

const pageTitle = computed(() => {
  const base = translate('crm.sprint.kanban.title', 'Kanban du sprint')
  return `${base} • ${sprintId.value}`
})

useHead(() => ({ title: pageTitle.value }))

async function loadSprint() {
  loading.value = true
  try {
    sprint.value = await $fetch<SprintGroupedResponse>(
      withBase(
        `/task-requests/sprints/${encodeURIComponent(sprintId.value)}/grouped-by-task`,
      ),
      {
        headers: crmHeaders.value,
      },
    )
  } catch (error) {
    console.error(error)
    sprint.value = null
    Notify.error(
      translate('crm.sprint.kanban.loadError', 'Impossible de charger le sprint.'),
    )
  } finally {
    loading.value = false
  }
}

await loadSprint()
watch(sprintId, async () => {
  sprintIdInput.value = sprintId.value
  await loadSprint()
})

function applySprintId() {
  router.replace({
    query: {
      ...route.query,
      sprintId: sprintIdInput.value.trim() || undefined,
    },
  })
}

function fullName(user?: SprintUser | null) {
  if (!user) return '—'
  const value = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return value || user.username
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}
</script>

<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between mb-4 gap-3 flex-wrap">
      <h1 class="text-h5 font-weight-bold">{{ pageTitle }}</h1>
      <v-chip color="primary" variant="tonal">{{ sprint?.groupedByTask.length ?? 0 }} tâches</v-chip>
    </div>

    <v-card variant="outlined" class="mb-4">
      <v-card-text class="d-flex ga-3 align-center flex-wrap">
        <v-text-field
          v-model="sprintIdInput"
          hide-details
          density="compact"
          variant="outlined"
          :label="translate('crm.sprint.kanban.sprintId', 'Sprint ID')"
          class="flex-grow-1"
        />
        <v-btn color="primary" @click="applySprintId">
          {{ translate('crm.sprint.kanban.load', 'Charger') }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-row>
      <v-col v-for="column in columns" :key="column.key" cols="12" md="4">
        <v-card variant="outlined" class="h-100">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ column.title }}</span>
            <v-chip size="small" color="primary" variant="flat">{{ column.items.length }}</v-chip>
          </v-card-title>
          <v-card-text class="d-flex flex-column ga-3">
            <v-alert v-if="!column.items.length" type="info" variant="tonal" density="comfortable">
              {{ translate('crm.sprint.kanban.empty', 'Aucune tâche dans cette colonne.') }}
            </v-alert>

            <v-card v-for="entry in column.items" :key="entry.task.id" variant="tonal">
              <v-card-text>
                <div class="font-weight-medium">{{ entry.task.title }}</div>
                <div class="text-body-2 text-medium-emphasis mb-2">{{ entry.task.description || '—' }}</div>
                <div class="text-caption">
                  {{ translate('crm.sprint.kanban.owner', 'Owner') }}: {{ fullName(entry.task.owner) }}
                </div>
                <div class="text-caption mb-2">
                  {{ translate('crm.sprint.kanban.due', 'Due') }}: {{ formatDate(entry.task.dueDate || undefined) }}
                </div>

                <v-divider class="my-2" />

                <div class="text-caption font-weight-bold mb-1">
                  {{ translate('crm.sprint.kanban.requests', 'Demandes') }} ({{ entry.taskRequests.length }})
                </div>
                <v-list density="compact" lines="two" class="pa-0 bg-transparent">
                  <v-list-item v-for="request in entry.taskRequests" :key="request.id" class="px-0">
                    <v-list-item-title>{{ request.requestedStatus || '—' }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatDate(request.time) }} · {{ fullName(request.requester) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
