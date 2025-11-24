import PrimeVue from 'primevue/config'

import { usePrimeVue } from '~/primevue/config'

export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp
  const { config } = usePrimeVue()

  app.use(PrimeVue, config)
})
