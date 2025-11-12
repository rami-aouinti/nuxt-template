import { createSharedComposable, syncRefs, useSessionStorage, useStorage } from '@vueuse/core'
import { useCookie } from 'nuxt/app'
import { watch } from 'vue'

type ThemeRadiusPreset = 'none' | 'xs' | 'sm' | 'md' | 'lg'
type ThemeShadowPreset = 'none' | 'soft' | 'regular' | 'bold' | 'deep'

type ThemeOption<TValue> = {
  value: TValue
  labelKey: string
  descriptionKey: string
}

export const themeRadiusOptions: ReadonlyArray<ThemeOption<ThemeRadiusPreset>> = [
  {
    value: 'none',
    labelKey: 'app.settings.cornerRadiusOptions.none.label',
    descriptionKey: 'app.settings.cornerRadiusOptions.none.description',
  },
  {
    value: 'xs',
    labelKey: 'app.settings.cornerRadiusOptions.xs.label',
    descriptionKey: 'app.settings.cornerRadiusOptions.xs.description',
  },
  {
    value: 'sm',
    labelKey: 'app.settings.cornerRadiusOptions.sm.label',
    descriptionKey: 'app.settings.cornerRadiusOptions.sm.description',
  },
  {
    value: 'md',
    labelKey: 'app.settings.cornerRadiusOptions.md.label',
    descriptionKey: 'app.settings.cornerRadiusOptions.md.description',
  },
  {
    value: 'lg',
    labelKey: 'app.settings.cornerRadiusOptions.lg.label',
    descriptionKey: 'app.settings.cornerRadiusOptions.lg.description',
  },
]

export const themeShadowOptions: ReadonlyArray<ThemeOption<ThemeShadowPreset>> = [
  {
    value: 'none',
    labelKey: 'app.settings.shadowDepthOptions.none.label',
    descriptionKey: 'app.settings.shadowDepthOptions.none.description',
  },
  {
    value: 'soft',
    labelKey: 'app.settings.shadowDepthOptions.soft.label',
    descriptionKey: 'app.settings.shadowDepthOptions.soft.description',
  },
  {
    value: 'regular',
    labelKey: 'app.settings.shadowDepthOptions.regular.label',
    descriptionKey: 'app.settings.shadowDepthOptions.regular.description',
  },
  {
    value: 'bold',
    labelKey: 'app.settings.shadowDepthOptions.bold.label',
    descriptionKey: 'app.settings.shadowDepthOptions.bold.description',
  },
  {
    value: 'deep',
    labelKey: 'app.settings.shadowDepthOptions.deep.label',
    descriptionKey: 'app.settings.shadowDepthOptions.deep.description',
  },
]

export type { ThemeOption }

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

const shadowHoverValues: Record<ThemeShadowPreset, string> = {
  none: 'none',
  soft: '0 12px 30px rgba(15, 23, 42, 0.14)',
  regular: '0 18px 44px rgba(15, 23, 42, 0.2)',
  bold: '0 26px 56px rgba(15, 23, 42, 0.26)',
  deep: '0 32px 68px rgba(var(--v-theme-primary), 0.34)',
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
  const hoverValue = shadowHoverValues[preset] ?? shadowHoverValues.regular
  document.documentElement.style.setProperty('--app-shadow', value)
  document.documentElement.style.setProperty('--app-shadow-hover', hoverValue)
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
  shadowHoverValues,
  RADIUS_STORAGE_KEY,
  SHADOW_STORAGE_KEY,
}
