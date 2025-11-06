import { useLocalStorage } from '@vueuse/core'
import type { AuthProfile } from '~/types/auth'

export const useAuthProfileCache = () =>
  useLocalStorage<AuthProfile | null>('auth-profile-cache', null, {
    deep: true,
  })
