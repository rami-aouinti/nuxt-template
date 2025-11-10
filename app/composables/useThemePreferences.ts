import { createSharedComposable, syncRefs, useSessionStorage, useStorage } from '@vueuse/core'
import { useCookie } from 'nuxt/app'
import { watch } from 'vue'

type ThemeRadiusPreset = 'none' | 'xs' | 'sm' | 'md' | 'lg'
type ThemeShadowPreset = 'none' | 'soft' | 'regular' | 'bold' | 'deep'

export const themeRadiusOptions: ReadonlyArray<{
  label: string
  description: string
  value: ThemeRadiusPreset
}> = [
  { label: 'Square', description: 'Sharp corners without any rounding.', value: 'none' },
  { label: 'Subtle', description: 'Very small rounding for minimal curves.', value: 'xs' },
  { label: 'Soft', description: 'Balanced rounding for most surfaces.', value: 'sm' },
  { label: 'Rounded', description: 'Generous curves for a friendly layout.', value: 'md' },
  { label: 'Pill', description: 'Fully rounded edges for pill-shaped elements.', value: 'lg' },
]

export const themeShadowOptions: ReadonlyArray<{
  label: string
  description: string
  value: ThemeShadowPreset
}> = [
  { label: 'None', description: 'Removes all elevation shadows.', value: 'none' },
  { label: 'Feather', description: 'A barely visible soft glow.', value: 'soft' },
  { label: 'Classic', description: 'Balanced shadow for everyday use.', value: 'regular' },
  { label: 'Strong', description: 'Pronounced elevation with clear depth.', value: 'bold' },
  { label: 'Focus', description: 'Deep and vibrant with theme accent.', value: 'deep' },
]

const radiusValues: Record<ThemeRadiusPreset, string> = {
  none: '0px',
  xs: '4px',
  sm: '10px',
  md: '18px',
  lg: '999px',
}

const shadowValues: Record<ThemeShadowPreset, string> = {
  none: 'none',
  soft: '0 4px 12px rgba(15, 23, 42, 0.08)',
  regular: '0 10px 26px rgba(15, 23, 42, 0.14)',
  bold: '0 18px 42px rgba(15, 23, 42, 0.2)',
  deep: '0 24px 52px rgba(var(--v-theme-primary), 0.28)',
}

const RADIUS_STORAGE_KEY = 'theme-rounded'
const SHADOW_STORAGE_KEY = 'theme-shadow'

function applyRadiusPreset(preset: ThemeRadiusPreset) {
  if (!import.meta.client) return

  const value = radiusValues[preset] ?? radiusValues.md
  document.documentElement.style.setProperty('--app-rounded', value)
}

function applyShadowPreset(preset: ThemeShadowPreset) {
  if (!import.meta.client) return

  const value = shadowValues[preset] ?? shadowValues.regular
  document.documentElement.style.setProperty('--app-shadow', value)
}

const useThemePreferencesShared = createSharedComposable(() => {
  const radiusStorage = useStorage<ThemeRadiusPreset>(RADIUS_STORAGE_KEY, 'md')
  const radiusSession = useSessionStorage<ThemeRadiusPreset>(RADIUS_STORAGE_KEY, radiusStorage.value)
  const radiusCookie = useCookie<ThemeRadiusPreset>(RADIUS_STORAGE_KEY, {
    sameSite: 'lax',
    default: () => radiusStorage.value,
  })

  syncRefs(radiusStorage, radiusSession, { immediate: true })
  syncRefs(radiusStorage, radiusCookie, { immediate: true })

  const shadowStorage = useStorage<ThemeShadowPreset>(SHADOW_STORAGE_KEY, 'regular')
  const shadowSession = useSessionStorage<ThemeShadowPreset>(SHADOW_STORAGE_KEY, shadowStorage.value)
  const shadowCookie = useCookie<ThemeShadowPreset>(SHADOW_STORAGE_KEY, {
    sameSite: 'lax',
    default: () => shadowStorage.value,
  })

  syncRefs(shadowStorage, shadowSession, { immediate: true })
  syncRefs(shadowStorage, shadowCookie, { immediate: true })

  if (import.meta.client) {
    watch(
      radiusStorage,
      (preset) => {
        applyRadiusPreset(preset)
      },
      { immediate: true },
    )

    watch(
      shadowStorage,
      (preset) => {
        applyShadowPreset(preset)
      },
      { immediate: true },
    )
  }

  return {
    radius: radiusStorage,
    shadow: shadowStorage,
  }
})

export function useThemePreferences() {
  return useThemePreferencesShared()
}

export type { ThemeRadiusPreset, ThemeShadowPreset }
export {
  applyRadiusPreset,
  applyShadowPreset,
  radiusValues,
  shadowValues,
  RADIUS_STORAGE_KEY,
  SHADOW_STORAGE_KEY,
}
