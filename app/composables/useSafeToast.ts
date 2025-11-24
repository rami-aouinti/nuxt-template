import { useToast as usePrimeToast } from 'primevue/usetoast'

const fallbackToast = {
  add: () => {},
  remove: () => {},
  clear: () => {},
}

export function useSafeToast() {
  if (!import.meta.client) {
    return fallbackToast
  }

  try {
    return usePrimeToast()
  } catch (error) {
    console.warn('PrimeVue ToastService is not available.', error)
    return fallbackToast
  }
}

export default useSafeToast
