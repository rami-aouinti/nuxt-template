<script setup lang="ts">
import { mergeProps, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  useThemePreferences,
  themeRadiusOptions,
  themeShadowOptions,
  type ThemeRadiusPreset,
  type ThemeShadowPreset,
} from '~/composables/useThemePreferences'

const theme = useTheme()
const primary = useStorage('theme-primary', '#f30775')
const { radius, shadow } = useThemePreferences()
const color = computed({
  get() {
    return theme.themes.value.light!.colors.primary
  },
  set(val: string) {
    primary.value = val
    theme.themes.value.light!.colors.primary = val
    theme.themes.value.dark!.colors.primary = val
  },
})
const rounded = computed<ThemeRadiusPreset>({
  get() {
    return radius.value
  },
  set(preset) {
    radius.value = preset
  },
})
const shadowPreset = computed<ThemeShadowPreset>({
  get() {
    return shadow.value
  },
  set(preset) {
    shadow.value = preset
  },
})
const colors = [
  ['#1697f6', '#ff9800'],
  ['#4CAF50', '#FF5252'],
  ['#9C27b0', '#E91E63'],
  ['#304156', '#3f51b5'],
  ['#002FA7', '#492d22'],
]
const menuShow = ref(false)
const { t } = useI18n()
const radiusOptions = computed(() =>
  themeRadiusOptions
    .filter((option) => option.value !== 'lg')
    .map((option) => ({
      ...option,
      label: t(option.labelKey),
      description: t(option.descriptionKey),
    })),
)
const shadowOptions = computed(() =>
  themeShadowOptions.map((option) => ({
    ...option,
    label: t(option.labelKey),
    description: t(option.descriptionKey),
  })),
)
const themePaletteLabel = computed(() => t('app.settings.themePalette'))
const themeMenuAriaLabel = computed(() => t('app.settings.openThemeMenu'))
</script>

<template>
  <v-menu
    v-model="menuShow"
    :close-on-content-click="false"
    location="top right"
    offset="15"
  >
    <template #activator="{ props: menu }">
      <v-tooltip
        :text="themePaletteLabel"
        :aria-label="themePaletteLabel"
        location="top"
      >
        <template #activator="{ props: tooltip }">
          <v-btn
            icon="mdi-palette-outline"
            v-bind="mergeProps(menu, tooltip)"
            :rounded="0"
            :aria-label="themeMenuAriaLabel"
            variant="text"
            class="app-settings__trigger"
          />
        </template>
      </v-tooltip>
    </template>
    <v-card width="360" class="app-settings-card">
      <v-card-text class="app-settings-card__body">
        <v-label class="mb-2"> {{ t('app.settings.cornerRadius') }} </v-label>
        <v-btn-toggle
          v-model="rounded"
          class="app-settings-card__toggle justify-center"
          density="compact"
          mandatory
        >
          <v-btn
            v-for="option in radiusOptions"
            :key="option.value"
            :value="option.value"
            class="app-settings-card__toggle-btn"
            color="primary"
            rounded="lg"
            size="small"
            variant="tonal"
            :title="option.description"
          >
            {{ option.label }}
          </v-btn>
        </v-btn-toggle>
        <v-label class="mb-2"> {{ t('app.settings.shadowDepth') }} </v-label>
        <v-btn-toggle
          v-model="shadowPreset"
          class="app-settings-card__toggle justify-center"
          density="compact"
          mandatory
        >
          <v-btn
            v-for="option in shadowOptions"
            :key="option.value"
            :value="option.value"
            class="app-settings-card__toggle-btn"
            color="primary"
            rounded="lg"
            size="small"
            variant="tonal"
            :title="option.description"
          >
            {{ option.label }}
          </v-btn>
        </v-btn-toggle>
        <v-label class="mb-3"> {{ themePaletteLabel }} </v-label>
        <v-color-picker
          v-model="color"
          show-swatches
          elevation="0"
          width="288"
          mode="rgb"
          :modes="['rgb', 'hex', 'hsl']"
          :swatches="colors"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<style scoped>
.app-settings__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 9999px;
}

.app-settings__trigger :deep(.v-icon) {
  font-size: 22px;
}

.app-settings-card {
  max-height: 520px;
}

.app-settings-card__body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  gap: 16px;
  overflow-y: auto;
}

.app-settings-card__body :deep(.v-color-picker) {
  align-self: center;
}

.app-settings-card__toggle {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.app-settings-card__toggle-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: normal;
}
</style>
