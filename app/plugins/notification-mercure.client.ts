import { defineNuxtPlugin } from '#app'
import { useNotificationMercureStore } from '~/stores/notificationMercure'

export default defineNuxtPlugin(() => {
  const store = useNotificationMercureStore()
  store.initialise()
})
