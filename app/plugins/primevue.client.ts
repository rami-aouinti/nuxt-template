import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp

  app.use(PrimeVue)
  app.use(ToastService)
  app.component('Toast', Toast)
})
