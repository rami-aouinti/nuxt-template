import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp

  vueApp.use(ToastService)
  vueApp.component('Toast', Toast)
})
