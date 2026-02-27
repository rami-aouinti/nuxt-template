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
  priority?: string
  dueDate?: string | null
  owner?: SprintUser | null
}

interface SprintTaskRequest {
  id: string
  requestedStatus?: TaskStatus
  note?: string | null
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
const translate = useTranslateWithFallback()
const { headers: crmHeaders, withBase } = useCrmApi()

const loading = ref(false)
const sprint = ref<SprintGroupedResponse | null>(null)

const sprintId = computed(() => {
  const param = route.params.id
  if (Array.isArray(param)) return param[0] ?? ''
  return typeof param === 'string' ? param : ''
})

const columns = computed(() => {
  const items = sprint.value?.groupedByTask ?? []

  const byStatus = {
    todo: items.filter((item) => item.task.status === 'todo'),
    in_progress: items.filter((item) => item.task.status === 'in_progress'),
    done: items.filter((item) => item.task.status === 'done'),
  }

  return [
    {
      key: 'todo',
      title: translate('crm.sprint.kanban.todo', 'À faire'),
      items: byStatus.todo,
    },
    {
      key: 'in_progress',
      title: translate('crm.sprint.kanban.inProgress', 'En cours'),
      items: byStatus.in_progress,
    },
    {
      key: 'done',
      title: translate('crm.sprint.kanban.done', 'Terminé'),
      items: byStatus.done,
    },
  ]
})

const pageTitle = computed(() => {
  const base = translate('crm.sprint.kanban.title', 'Kanban du sprint')
  return sprintId.value ? `${base} • ${sprintId.value}` : base
})

useHead(() => ({ title: pageTitle.value }))

async function loadSprint() {
  if (!sprintId.value) {
    sprint.value = null
    return
  }

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
  await loadSprint()
})

function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function fullName(user?: SprintUser | null) {
  if (!user) return '—'
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return name || user.username
}
</script>

<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5 font-weight-bold">{{ pageTitle }}</h1>
      <v-chip color="primary" variant="tonal">
        {{ sprint?.groupedByTask.length ?? 0 }} tâches
      </v-chip>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-row>
      <v-col v-for="column in columns" :key="column.key" cols="12" md="4">
        <v-card variant="outlined" class="h-100">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>{{ column.title }}</span>
            <v-chip size="small" color="primary" variant="flat">
              {{ column.items.length }}
            </v-chip>
          </v-card-title>

          <v-card-text class="d-flex flex-column ga-3">
            <v-alert v-if="!column.items.length" type="info" variant="tonal" density="comfortable">
              {{ translate('crm.sprint.kanban.empty', 'Aucune tâche dans cette colonne.') }}
            </v-alert>

            <v-card
              v-for="entry in column.items"
              :key="entry.task.id"
              variant="tonal"
              color="surface"
            >
              <v-card-text>
                <div class="text-subtitle-1 font-weight-medium">{{ entry.task.title }}</div>
                <div class="text-body-2 text-medium-emphasis mb-2">
                  {{ entry.task.description || '—' }}
                </div>

                <div class="text-caption mb-1">
                  <strong>Owner:</strong> {{ fullName(entry.task.owner) }}
                </div>
                <div class="text-caption mb-1">
                  <strong>Due:</strong> {{ formatDate(entry.task.dueDate) }}
                </div>

                <v-divider class="my-2" />

                <div class="text-caption font-weight-bold mb-1">
                  {{ translate('crm.sprint.kanban.requests', 'Demandes') }} ({{ entry.taskRequests.length }})
                </div>
                <v-list density="compact" lines="two" class="pa-0 bg-transparent">
                  <v-list-item
                    v-for="request in entry.taskRequests"
                    :key="request.id"
                    class="px-0"
                  >
                    <v-list-item-title>
                      {{ request.requestedStatus || '—' }}
                    </v-list-item-title>
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
