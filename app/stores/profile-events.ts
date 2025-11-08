import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ProfileEvent } from '~/types/events'

export function normalizeProfileEvent(event: ProfileEvent): ProfileEvent {
  const start = new Date(event.start)
  const safeStart = Number.isNaN(start.getTime()) ? new Date() : start
  const end = event.end ? new Date(event.end) : safeStart
  const safeEnd = Number.isNaN(end.getTime()) ? safeStart : end

  return {
    ...event,
    start: safeStart.toISOString(),
    end: safeEnd.toISOString(),
    allDay: Boolean(event.allDay),
  }
}

export const useProfileEventsStore = defineStore('profileEvents', () => {
  const events = ref<ProfileEvent[]>([])
  const isLoading = ref(false)
  const error = ref('')

  const setEvents = (items: ProfileEvent[]) => {
    events.value = items.map(normalizeProfileEvent)
  }

  const upsertEvent = (event: ProfileEvent) => {
    const normalized = normalizeProfileEvent(event)
    const index = events.value.findIndex((item) => item.id === normalized.id)

    if (index === -1) {
      events.value = [...events.value, normalized]
      return
    }

    events.value = events.value.map((existing, currentIndex) =>
      currentIndex === index ? normalized : existing,
    )
  }

  const removeEvent = (id: string) => {
    events.value = events.value.filter((event) => event.id !== id)
  }

  return {
    events,
    isLoading,
    error,
    setEvents,
    upsertEvent,
    removeEvent,
  }
})
