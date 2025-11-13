import { defineStore } from 'pinia'
import { computed, ref, watch, type WatchStopHandle } from 'vue'
import type { Notification } from '~/stores/notification'
import { useNotificationStore } from '~/stores/notification'

interface MercureNotificationPayload {
  pushTitle?: unknown
  pushSubtitle?: unknown
  pushContent?: unknown
  pushType?: unknown
  type?: unknown
  severity?: unknown
  scopeTarget?: unknown
}

const DEFAULT_HUB_URL = 'http://bro-world.org:3000/.well-known/mercure'
const DEFAULT_NOTIFICATION_TOPIC =
  'https://bro-world.org/notifications/'
const DEFAULT_RECONNECT_DELAY = 5000
const MAX_TRACKED_EVENT_IDS = 100

function toStringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function parseNotificationType(value: unknown): Notification['type'] {
  if (typeof value !== 'string') {
    return 'info'
  }

  const normalized = value.trim().toLowerCase()
  switch (normalized) {
    case 'success':
      return 'success'
    case 'error':
    case 'danger':
    case 'fatal':
      return 'error'
    case 'warn':
    case 'warning':
      return 'warning'
    case 'info':
    case 'information':
    default:
      return 'info'
  }
}

function parseScopeTargets(value: unknown): string[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item): item is string => item.length > 0)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return []
    }

    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parseScopeTargets(parsed)
      }
    } catch (error) {
      // Ignore JSON parse errors and attempt to split manually below.
      console.debug('Unable to parse notification scopeTarget as JSON', error)
    }

    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return []
}

function isTargetedForUser(targets: string[], userId: string) {
  if (!userId) {
    return false
  }

  if (targets.length === 0) {
    return true
  }

  const normalizedUserId = userId.trim().toLowerCase()
  return targets.some((target) => {
    const normalizedTarget = target.trim().toLowerCase()
    return (
      normalizedTarget === normalizedUserId ||
      normalizedTarget === '*' ||
      normalizedTarget === 'all'
    )
  })
}

function buildNotificationText(payload: MercureNotificationPayload) {
  const parts: string[] = []

  const title = toStringValue(payload.pushTitle)
  const subtitle = toStringValue(payload.pushSubtitle)
  const content = toStringValue(payload.pushContent)

  if (title) {
    parts.push(title)
  }

  if (subtitle) {
    parts.push(subtitle)
  }

  if (content) {
    parts.push(content)
  }

  return parts.join('\n')
}

function resolveReconnectDelay(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }

  return DEFAULT_RECONNECT_DELAY
}

export const useNotificationMercureStore = defineStore(
  'notification-mercure',
  () => {
    const runtimeConfig = useRuntimeConfig()
    const notificationStore = useNotificationStore()
    const { session, loggedIn } = useUserSession()

    console.log(DEFAULT_NOTIFICATION_TOPIC)
    const hubUrl =
      runtimeConfig.public?.messenger?.mercureHubUrl ||
      runtimeConfig.public?.mercure?.hubUrl ||
      DEFAULT_HUB_URL
    const notificationTopic =
      runtimeConfig.public?.messenger?.notificationTopic ||
      DEFAULT_NOTIFICATION_TOPIC
    const reconnectDelay = resolveReconnectDelay(
      runtimeConfig.public?.messenger?.notificationReconnectDelay,
    )

    const eventSource = ref<EventSource | null>(null)
    const reconnectTimer = ref<ReturnType<typeof setTimeout> | null>(null)
    const isConnected = ref(false)
    const isInitialised = ref(false)
    const stopConnectionWatcher = ref<WatchStopHandle | null>(null)

    const processedEventIds = new Set<string>()

    const currentUserId = computed(() => session.value?.profile?.id ?? '')
    const isSupported = computed(
      () => typeof window !== 'undefined' && 'EventSource' in window,
    )
    const shouldConnect = computed(
      () =>
        isSupported.value &&
        loggedIn.value &&
        Boolean(currentUserId.value) &&
        Boolean(notificationTopic),
    )

    const clearReconnectTimer = () => {
      if (reconnectTimer.value) {
        clearTimeout(reconnectTimer.value)
        reconnectTimer.value = null
      }
    }

    const closeEventSource = () => {
      if (eventSource.value) {
        eventSource.value.close()
        eventSource.value = null
      }
      isConnected.value = false
    }

    const scheduleReconnect = () => {
      clearReconnectTimer()

      reconnectTimer.value = setTimeout(() => {
        reconnectTimer.value = null
        connect()
      }, reconnectDelay)
    }

    const trackEventId = (eventId: string) => {
      processedEventIds.add(eventId)
      if (processedEventIds.size > MAX_TRACKED_EVENT_IDS) {
        const iterator = processedEventIds.values()
        const firstValue = iterator.next().value
        if (typeof firstValue === 'string') {
          processedEventIds.delete(firstValue)
        }
      }
    }

    const hasProcessedEvent = (eventId: string) =>
      processedEventIds.has(eventId)

    const handleNotificationEvent = (
      payload: MercureNotificationPayload,
      eventId?: string,
    ) => {
      if (!payload || typeof payload !== 'object') {
        return
      }

      if (eventId && hasProcessedEvent(eventId)) {
        return
      }

      const targets = parseScopeTargets(payload.scopeTarget)
      if (!isTargetedForUser(targets, currentUserId.value)) {
        return
      }

      const message = buildNotificationText(payload)
      if (!message) {
        return
      }

      const typeCandidate =
        payload.pushType ?? payload.type ?? payload.severity ?? 'info'
      const notificationType = parseNotificationType(typeCandidate)

      notificationStore.addNotification(message, notificationType)

      if (eventId) {
        trackEventId(eventId)
      }
    }

    const connect = () => {
      if (eventSource.value || !shouldConnect.value) {
        return
      }

      try {
        const url = new URL(hubUrl)
        url.searchParams.append('topic', notificationTopic)

        const source = new EventSource(url.toString(), {
          withCredentials: false,
        })

        source.onopen = () => {
          isConnected.value = true
          clearReconnectTimer()
        }

        source.onerror = () => {
          isConnected.value = false
          closeEventSource()
          scheduleReconnect()
        }

        source.onmessage = (event) => {
          if (!event.data) {
            return
          }

          try {
            const parsed = JSON.parse(event.data) as MercureNotificationPayload
            handleNotificationEvent(parsed, event.lastEventId || undefined)
          } catch (error) {
            console.error('Unable to parse notification event', error)
          }
        }

        eventSource.value = source
      } catch (error) {
        console.error('Unable to connect to notification hub', error)
        scheduleReconnect()
      }
    }

    const teardownConnection = () => {
      clearReconnectTimer()
      closeEventSource()
      processedEventIds.clear()
    }

    const initialise = () => {
      if (isInitialised.value || import.meta.server) {
        return
      }

      isInitialised.value = true

      stopConnectionWatcher.value = watch(
        shouldConnect,
        (active) => {
          if (active) {
            connect()
          } else {
            teardownConnection()
          }
        },
        { immediate: true },
      )
    }

    const teardown = () => {
      if (!isInitialised.value) {
        return
      }

      stopConnectionWatcher.value?.()
      stopConnectionWatcher.value = null
      teardownConnection()
      isInitialised.value = false
    }

    return {
      initialise,
      teardown,
      connect,
      isConnected,
    }
  },
)
