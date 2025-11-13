<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import type { ProfileEvent, UpsertProfileEventPayload } from '~/types/events'
import { Notify } from '~/stores/notification'
import { useProfileEventsStore } from '~/stores/profile-events'
import AppButton from '~/components/ui/AppButton.vue'
import AppList from '~/components/ui/AppList.vue'
import AppCard from '~/components/ui/AppCard.vue'

definePageMeta({
  title: 'navigation.profileCalendar',
  middleware: 'auth',
})

const { t, locale } = useI18n()

const profileEventsStore = useProfileEventsStore()
const { events, isLoading, error: loadError } = storeToRefs(profileEventsStore)
const focus = ref(formatDate(new Date()))
const calendarType = ref<'month' | 'week' | 'day'>('month')
const isDialogOpen = ref(false)
const isSaving = ref(false)
const formError = ref('')
const editingEvent = ref<ProfileEvent | null>(null)
const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)
const eventToDelete = ref<ProfileEvent | null>(null)

const DEFAULT_START_TIME = '08:00'
const DEFAULT_END_TIME = '09:00'

const form = reactive({
  title: '',
  description: '',
  location: '',
  color: '#1976d2',
  isPrivate: false,
  allDay: false,
  startDate: formatDate(new Date()),
  startTime: DEFAULT_START_TIME,
  endDate: formatDate(new Date()),
  endTime: DEFAULT_END_TIME,
})

const calendarEvents = computed(() =>
  events.value.map((event) => {
    const start = toCalendarDate(event.start) ?? new Date()
    const end = toCalendarDate(event.end ?? event.start) ?? start

    return {
      ...event,
      title: event.title,
      start,
      end,
      color: event.color ?? 'primary',
      allDay: Boolean(event.allDay),
      data: event,
    }
  }),
)

const sortedEvents = computed(() =>
  [...events.value].sort((first, second) => {
    const firstDate = new Date(first.start).getTime()
    const secondDate = new Date(second.start).getTime()

    return firstDate - secondDate
  }),
)

const periodFormatter = computed(
  () =>
    new Intl.DateTimeFormat(locale.value, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
)

function formatEventRange(event: ProfileEvent) {
  const start = new Date(event.start)
  const end = new Date(event.end ?? event.start)

  return `${periodFormatter.value.format(start)} · ${periodFormatter.value.format(end)}`
}

onMounted(() => {
  loadEvents()
})

watch(isDialogOpen, (value) => {
  if (!value) {
    editingEvent.value = null
    formError.value = ''
  }
})

watch(isDeleteDialogOpen, (value) => {
  if (!value) {
    eventToDelete.value = null
  }
})

watch(
  () => form.startDate,
  (value) => {
    if (!form.endDate) {
      form.endDate = value
    }
  },
)

watch(
  () => form.allDay,
  (value, previous) => {
    if (value) {
      form.startTime = '00:00'
      form.endTime = '23:59'
    } else if (previous) {
      form.startTime = DEFAULT_START_TIME
      form.endTime = DEFAULT_END_TIME
    }
  },
)

watch(
  () => [form.startDate, form.startTime, form.endDate, form.endTime],
  () => {
    if (!form.startDate || !form.endDate) {
      return
    }

    const start = parseDateTime(form.startDate, form.startTime)
    const end = parseDateTime(form.endDate, form.endTime)

    if (start && end && end < start) {
      form.endDate = form.startDate
      form.endTime = form.allDay ? '23:59' : form.startTime
    }
  },
)

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10)
}

function parseDateTime(date: string, time: string) {
  if (!date) return null
  const safeTime = time && /\d{2}:\d{2}/.test(time) ? time : '00:00'
  const isoString = `${date}T${safeTime}`
  const parsed = new Date(isoString)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function toCalendarDate(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const parsed = new Date(value)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function extractErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof (error as { data?: Record<string, unknown> }).data?.message ===
      'string'
  ) {
    return (error as { data: { message: string } }).data.message
  }
  return t('profile.calendar.notifications.genericError')
}

async function loadEvents() {
  isLoading.value = true
  loadError.value = ''
  try {
    const response = await $fetch<ProfileEvent[]>('/api/profile/events')
    profileEventsStore.setEvents(response)
  } catch (error) {
    const message = extractErrorMessage(error)
    loadError.value = message
    Notify.error(message)
  } finally {
    isLoading.value = false
  }
}

function resetForm(event?: ProfileEvent) {
  const baseDate = event ? new Date(event.start) : new Date(focus.value)
  const endDate = event?.end ? new Date(event.end) : baseDate

  form.title = event?.title ?? ''
  form.description = event?.description ?? ''
  form.location = event?.location ?? ''
  form.color = event?.color ?? '#1976d2'
  form.isPrivate = Boolean(event?.isPrivate)
  form.allDay = Boolean(event?.allDay)
  form.startDate = formatDate(baseDate)
  form.endDate = formatDate(endDate)

  if (form.allDay) {
    form.startTime = '00:00'
    form.endTime = '23:59'
  } else {
    const startParts = splitDateTime(event?.start)
    const endParts = splitDateTime(event?.end ?? event?.start)
    form.startTime = startParts.time ?? DEFAULT_START_TIME
    form.endTime = endParts.time ?? DEFAULT_END_TIME
  }

  if (!event) {
    form.startTime = DEFAULT_START_TIME
    form.endTime = DEFAULT_END_TIME
  }
}

function splitDateTime(value?: string | null) {
  if (!value) {
    return { date: null, time: null }
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return { date: null, time: null }
  }

  const iso = parsed.toISOString()
  return {
    date: iso.slice(0, 10),
    time: iso.slice(11, 16),
  }
}

function openCreateDialog(date?: string) {
  editingEvent.value = null
  resetForm()
  if (date) {
    form.startDate = date
    form.endDate = date
  }
  isDialogOpen.value = true
  formError.value = ''
}

function openEditDialog(event: ProfileEvent) {
  editingEvent.value = event
  resetForm(event)
  isDialogOpen.value = true
  formError.value = ''
}

function handleCalendarEventClick({
  event,
}: {
  event: { data?: ProfileEvent }
}) {
  if (event?.data) {
    openEditDialog(event.data)
  }
}

function handleCalendarDateClick({ date }: { date: string }) {
  openCreateDialog(date)
}

function buildPayload(): UpsertProfileEventPayload | null {
  const trimmedTitle = form.title.trim()
  if (!trimmedTitle) {
    formError.value = t('profile.calendar.validation.titleRequired')
    return null
  }

  if (!form.startDate) {
    formError.value = t('profile.calendar.validation.startRequired')
    return null
  }

  const start = parseDateTime(form.startDate, form.startTime)
  const end = parseDateTime(form.endDate || form.startDate, form.endTime)

  if (!start) {
    formError.value = t('profile.calendar.validation.startRequired')
    return null
  }

  const payload: UpsertProfileEventPayload = {
    title: trimmedTitle,
    description: form.description.trim() || undefined,
    location: form.location.trim() || undefined,
    color: form.color?.trim() || undefined,
    isPrivate: form.isPrivate,
    allDay: form.allDay,
    start: start.toISOString(),
    end: end ? end.toISOString() : start.toISOString(),
  }

  if (editingEvent.value?.id) {
    payload.id = editingEvent.value.id
  }

  return payload
}

async function submitEvent() {
  const payload = buildPayload()
  if (!payload) {
    return
  }

  isSaving.value = true
  formError.value = ''
  try {
    const response = await $fetch<ProfileEvent>('/api/profile/events', {
      method: editingEvent.value ? 'PUT' : 'POST',
      body: payload,
    })

    if (editingEvent.value) {
      profileEventsStore.upsertEvent(response)
      Notify.success(t('profile.calendar.notifications.updated'))
    } else {
      profileEventsStore.upsertEvent(response)
      Notify.success(t('profile.calendar.notifications.created'))
    }

    isDialogOpen.value = false
  } catch (error) {
    const message = extractErrorMessage(error)
    formError.value = message
    Notify.error(message)
  } finally {
    isSaving.value = false
  }
}

function requestDelete(event: ProfileEvent) {
  eventToDelete.value = event
  isDeleteDialogOpen.value = true
}

async function confirmDelete() {
  if (!eventToDelete.value?.id) {
    return
  }

  isDeleting.value = true
  try {
    await $fetch('/api/profile/events', {
      method: 'DELETE',
      body: { id: eventToDelete.value.id },
    })

    if (eventToDelete.value?.id) {
      profileEventsStore.removeEvent(eventToDelete.value.id)
    }
    Notify.success(t('profile.calendar.notifications.deleted'))
    isDeleteDialogOpen.value = false
    eventToDelete.value = null
  } catch (error) {
    const message = extractErrorMessage(error)
    Notify.error(message)
  } finally {
    isDeleting.value = false
  }
}

function closeDialog() {
  isDialogOpen.value = false
  editingEvent.value = null
}
</script>

<template>
  <div class="profile-calendar-page">
    <client-only>
      <teleport to="#app-drawer-right">
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="text-subtitle-1 font-weight-medium">
            {{ t('profile.calendar.list.title') }}
          </span>
          <AppButton
            icon="mdi-plus"
            size="small"
            variant="text"
            @click="openCreateDialog()"
          />
          <AppButton
            size="small"
            variant="text"
            prepend-icon="mdi-refresh"
            :loading="isLoading"
            @click="loadEvents"
          />
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-skeleton-loader
            v-if="isLoading && events.length === 0"
            type="list-item-three-line"
          />
          <template v-else>
            <v-alert v-if="loadError" type="error" variant="tonal" class="mb-4">
              {{ loadError }}
            </v-alert>

            <v-alert
              v-else-if="sortedEvents.length === 0"
              variant="tonal"
              type="info"
            >
              {{ t('profile.calendar.list.empty') }}
            </v-alert>

            <AppList v-else>
              <v-list-item
                v-for="event in sortedEvents"
                :key="event.id"
                :title="event.title"
                :subtitle="formatEventRange(event)"
              >
                <template #prepend>
                  <v-avatar
                    size="36"
                    :color="event.color ?? 'primary'"
                    class="text-white"
                  >
                    <v-icon>mdi-calendar</v-icon>
                  </v-avatar>
                </template>
                <template #append>
                  <div class="d-flex align-center gap-1">
                    <AppButton
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      @click="openEditDialog(event)"
                    />
                    <AppButton
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="requestDelete(event)"
                    />
                  </div>
                </template>
              </v-list-item>
            </AppList>
          </template>
        </v-card-text>
      </teleport>
    </client-only>
    <ProfilePageShell>
      <div class="profile-calendar">
        <v-row dense>
          <v-col cols="12">
            <AppCard class="h-100" rounded="xl">
              <v-card-text>
                <div
                  class="d-flex flex-wrap align-center justify-space-between gap-4 mb-4"
                >
                  <v-btn-toggle
                    v-model="calendarType"
                    mandatory
                    density="comfortable"
                  >
                    <AppButton value="month">
                      {{ t('profile.calendar.view.month') }}
                    </AppButton>
                    <AppButton value="week">
                      {{ t('profile.calendar.view.week') }}
                    </AppButton>
                    <AppButton value="day">
                      {{ t('profile.calendar.view.day') }}
                    </AppButton>
                  </v-btn-toggle>
                  <v-text-field
                    v-model="focus"
                    type="date"
                    density="comfortable"
                    hide-details
                    style="max-width: 200px"
                    rounded
                  />
                </div>

                <v-skeleton-loader
                  v-if="isLoading && events.length === 0"
                  type="article"
                />
                <template v-else>
                  <v-alert
                    v-if="loadError"
                    type="error"
                    variant="tonal"
                    class="mb-4"
                  >
                    {{ loadError }}
                  </v-alert>

                  <v-calendar
                    v-model="focus"
                    :type="calendarType"
                    :events="calendarEvents"
                    color="primary"
                    show-week
                    @click:event="handleCalendarEventClick"
                    @click:date="handleCalendarDateClick"
                  />
                </template>
              </v-card-text>
            </AppCard>
          </v-col>
        </v-row>
      </div>

      <AppModal
        v-model="isDialogOpen"
        icon="mdi-calendar-edit"
        :title="
          editingEvent
            ? t('profile.calendar.dialog.editTitle')
            : t('profile.calendar.dialog.createTitle')
        "
        max-width="520"
        :close-disabled="isSaving"
        @close="closeDialog"
      >
        <v-card-text>
          <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
            {{ formError }}
          </v-alert>
          <v-form id="calendar-event-form" @submit.prevent="submitEvent">
            <v-text-field
              v-model="form.title"
              :label="t('profile.calendar.form.title')"
              required
              density="comfortable"
              class="mb-3"
              rounded
            />
            <v-textarea
              v-model="form.description"
              :label="t('profile.calendar.form.description')"
              rows="3"
              density="comfortable"
              class="mb-3"
              rounded
            />
            <v-text-field
              v-model="form.location"
              :label="t('profile.calendar.form.location')"
              density="comfortable"
              class="mb-3"
              rounded
            />
            <v-color-picker
              v-model="form.color"
              hide-inputs
              mode="hex"
              class="mb-3"
              width="280"
            />
            <div class="d-flex flex-column gap-3 mb-3">
              <v-switch
                v-model="form.allDay"
                :label="t('profile.calendar.form.allDay')"
                color="primary"
                density="comfortable"
              />
              <v-switch
                v-model="form.isPrivate"
                :label="t('profile.calendar.form.isPrivate')"
                color="primary"
                density="comfortable"
              />
            </div>
            <div class="d-flex flex-column gap-3">
              <div class="d-flex gap-3 flex-wrap">
                <v-text-field
                  v-model="form.startDate"
                  type="date"
                  :label="t('profile.calendar.form.startDate')"
                  density="comfortable"
                  class="flex-grow-1"
                  rounded
                />
                <v-text-field
                  v-model="form.startTime"
                  type="time"
                  :label="t('profile.calendar.form.startTime')"
                  density="comfortable"
                  class="flex-grow-1"
                  :disabled="form.allDay"
                  rounded
                />
              </div>
              <div class="d-flex gap-3 flex-wrap">
                <v-text-field
                  v-model="form.endDate"
                  type="date"
                  :label="t('profile.calendar.form.endDate')"
                  density="comfortable"
                  class="flex-grow-1"
                  rounded
                />
                <v-text-field
                  v-model="form.endTime"
                  type="time"
                  :label="t('profile.calendar.form.endTime')"
                  density="comfortable"
                  class="flex-grow-1"
                  :disabled="form.allDay"
                  rounded
                />
              </div>
            </div>
          </v-form>
        </v-card-text>
        <template #actions>
          <div class="d-flex justify-space-between align-center flex-wrap gap-2 w-100">
            <AppButton
              v-if="editingEvent"
              color="error"
              variant="text"
              @click="requestDelete(editingEvent)"
            >
              {{ t('profile.calendar.actions.delete') }}
            </AppButton>
            <div class="d-flex gap-2 ms-auto">
              <AppButton variant="text" @click="closeDialog">
                {{ t('profile.calendar.dialog.cancel') }}
              </AppButton>
              <AppButton
                color="primary"
                :loading="isSaving"
                type="submit"
                form="calendar-event-form"
              >
                {{
                  editingEvent
                    ? t('profile.calendar.dialog.save')
                    : t('profile.calendar.dialog.submit')
                }}
              </AppButton>
            </div>
          </div>
        </template>
      </AppModal>

      <AppModal
        v-model="isDeleteDialogOpen"
        icon="mdi-trash-can-outline"
        :title="t('profile.calendar.delete.title')"
        max-width="420"
        :close-disabled="isDeleting"
      >
        <v-card-text>
          {{ t('profile.calendar.delete.message') }}
        </v-card-text>
        <template #actions>
          <AppButton variant="text" @click="isDeleteDialogOpen = false">
            {{ t('profile.calendar.dialog.cancel') }}
          </AppButton>
          <AppButton
            color="error"
            :loading="isDeleting"
            @click="confirmDelete"
          >
            {{ t('profile.calendar.actions.delete') }}
          </AppButton>
        </template>
      </AppModal>
    </ProfilePageShell>
  </div>
</template>

<style scoped src="~/assets/styles/pages/profile/calendar.css"></style>
