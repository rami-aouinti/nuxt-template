<script setup lang="ts">
import { mergeProps } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  useThemePreferences,
  themeRadiusOptions,
  themeShadowOptions,
  type ThemeRadiusPreset,
  type ThemeShadowPreset,
} from '~/composables/useThemePreferences'

const theme = useTheme()
const primary = useStorage('theme-primary', '#1697f6')
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
</script>

<template>
  <v-menu
    v-model="menuShow"
    :close-on-content-click="false"
    location="top right"
    offset="15"
  >
    <template #activator="{ props: menu }">
      <v-tooltip location="top" text="Theme Palette">
        <template #activator="{ props: tooltip }">
          <v-btn
            icon="mdi-palette-outline"
            v-bind="mergeProps(menu, tooltip)"
            :rounded="0"
          />
        </template>
      </v-tooltip>
    </template>
    <v-card width="360" class="app-settings-card">
      <v-card-text class="app-settings-card__body">
        <v-label class="mb-3"> Theme Palette </v-label>
        <v-color-picker
          v-model="color"
          show-swatches
          elevation="0"
          width="288"
          mode="rgb"
          :modes="['rgb', 'hex', 'hsl']"
          :swatches="colors"
        />
        <v-divider class="my-4" />
        <v-label class="mb-2"> Corner Radius </v-label>
        <v-btn-toggle
          v-model="rounded"
          class="mb-4 text-left d-flex flex-column gap-2"
          density="comfortable"
          divided
          mandatory
        >
          <v-btn
            v-for="option in themeRadiusOptions"
            :key="option.value"
            :value="option.value"
            variant="text"
            class="justify-start text-left"
            block
          >
            <div class="text-start">
              <div class="font-weight-medium">{{ option.label }}</div>
              <div class="text-caption text-medium-emphasis">{{ option.description }}</div>
            </div>
          </v-btn>
        </v-btn-toggle>
        <v-label class="mb-2"> Shadow Depth </v-label>
        <v-btn-toggle
          v-model="shadowPreset"
          class="text-left d-flex flex-column gap-2"
          density="comfortable"
          divided
          mandatory
        >
          <v-btn
            v-for="option in themeShadowOptions"
            :key="option.value"
            :value="option.value"
            variant="text"
            class="justify-start text-left"
            block
          >
            <div class="text-start">
              <div class="font-weight-medium">{{ option.label }}</div>
              <div class="text-caption text-medium-emphasis">{{ option.description }}</div>
            </div>
          </v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<style scoped>
.app-settings-card {
  max-height: 520px;
}

.app-settings-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  overflow-y: auto;
}

.app-settings-card__body :deep(.v-btn-toggle) {
  width: 100%;
}
</style>
