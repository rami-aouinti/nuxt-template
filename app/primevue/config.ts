import type { PrimeVueConfiguration } from 'primevue/config'

export function usePrimeVue() {
  const config: PrimeVueConfiguration = {
    ripple: true,
    unstyled: false,
    locale: {},
  }

  return { config }
}
