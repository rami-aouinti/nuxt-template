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
const { t } = useI18n()
const radiusOptions = computed(() =>
  themeRadiusOptions.map((option) => ({
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
          />
        </template>
      </v-tooltip>
    </template>
    <v-card width="360" class="app-settings-card">
      <v-card-text class="app-settings-card__body">
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
        <v-divider class="my-4" />
        <v-label class="mb-2"> {{ t('app.settings.cornerRadius') }} </v-label>
        <v-item-group
          v-model="rounded"
          class="app-settings-card__options app-settings-card__options--grid"
          mandatory
        >
          <v-item
            v-for="option in radiusOptions"
            :key="option.value"
            :value="option.value"
          >
            <template #default="{ isSelected, toggle }">
              <v-sheet
                class="app-settings-card__option"
                border="thin opacity-50"
                color="transparent"
                rounded="lg"
                :elevation="isSelected ? 2 : 0"
                @click="toggle"
              >
                <v-checkbox-btn
                  :model-value="isSelected"
                  density="comfortable"
                  color="primary"
                  class="mr-3"
                  hide-details
                />
                <div class="text-start">
                  <div class="font-weight-medium">{{ option.label }}</div>
                  <div class="text-caption text-medium-emphasis">
                    {{ option.description }}
                  </div>
                </div>
              </v-sheet>
            </template>
          </v-item>
        </v-item-group>
        <v-label class="mb-2"> {{ t('app.settings.shadowDepth') }} </v-label>
        <v-item-group
          v-model="shadowPreset"
          class="app-settings-card__options app-settings-card__options--grid"
          mandatory
        >
          <v-item
            v-for="option in shadowOptions"
            :key="option.value"
            :value="option.value"
          >
            <template #default="{ isSelected, toggle }">
              <v-sheet
                class="app-settings-card__option"
                border="thin opacity-50"
                color="transparent"
                rounded="lg"
                :elevation="isSelected ? 2 : 0"
                @click="toggle"
              >
                <v-checkbox-btn
                  :model-value="isSelected"
                  density="comfortable"
                  color="primary"
                  class="mr-3"
                  hide-details
                />
                <div class="text-start">
                  <div class="font-weight-medium">{{ option.label }}</div>
                  <div class="text-caption text-medium-emphasis">
                    {{ option.description }}
                  </div>
                </div>
              </v-sheet>
            </template>
          </v-item>
        </v-item-group>
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
  align-items: stretch;
  text-align: left;
  gap: 16px;
  overflow-y: auto;
}

.app-settings-card__body :deep(.v-color-picker) {
  align-self: center;
}

.app-settings-card__options {
  margin-bottom: 8px;
}

.app-settings-card__options--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.app-settings-card__option {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

.app-settings-card__option:hover {
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
}

.app-settings-card__option :deep(.v-selection-control) {
  margin-inline-end: 12px;
}
</style>
