<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'
import { useStorage } from '@vueuse/core'
import { useTheme } from 'vuetify'

import { useFrontendWorkplaceApi } from '~/composables/useFrontendWorkplaceApi'
import {
  applyRadiusPreset,
  applyShadowPreset,
  themeRadiusOptions,
  themeShadowOptions,
  type ThemeRadiusPreset,
  type ThemeShadowPreset,
  useThemePreferences,
} from '~/composables/useThemePreferences'
import { Notify } from '~/stores/notification'
import type { FrontendWorkplaceUpdatePayload, Workplace } from '~/types/workplace'

type WorkplaceDesignSettings = {
  primary: string
  radius: ThemeRadiusPreset
  shadow: ThemeShadowPreset
}

type WorkplaceOption = {
  title: string
  value: string
  raw: Workplace
}

const props = defineProps<{
  modelValue: boolean
  workplaces?: Workplace[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()

const translate = (key: string, fallback: string) => {
  const value = t(key)
  return value && value !== key ? value : fallback
}

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const theme = useTheme()
const { radius: globalRadius, shadow: globalShadow } = useThemePreferences()

const workplaceItems = computed<WorkplaceOption[]>(() =>
  (props.workplaces ?? []).map((workplace) => ({
    title: workplace.name,
    value: workplace.slug || workplace.id,
    raw: workplace,
  })),
)

const designStorage = useStorage<Record<string, WorkplaceDesignSettings>>(
  'workplace-design-preferences',
  {},
)

const DEFAULT_PRIMARY_COLOR = '#1697f6'

const colorSwatches = [
  ['#1697f6', '#ff9800'],
  ['#4CAF50', '#FF5252'],
  ['#9C27b0', '#E91E63'],
  ['#304156', '#3f51b5'],
  ['#002FA7', '#492d22'],
]

function getCurrentPrimaryColor() {
  return (
    theme.themes.value.light?.colors?.primary ||
    theme.themes.value.dark?.colors?.primary ||
    DEFAULT_PRIMARY_COLOR
  )
}

const activeTab = ref<
  'create' | 'update' | 'delete' | 'plugins' | 'members' | 'design'
>('create')

const createState = reactive({
  name: '',
  isPrivate: false,
  enabled: true,
  loading: false,
  error: '',
})

const updateState = reactive({
  workplace: '',
  name: '',
  isPrivate: false,
  enabled: true,
  loading: false,
  error: '',
})

const deleteState = reactive({
  workplace: '',
  loading: false,
  error: '',
})

const pluginState = reactive({
  workplace: '',
  values: '',
  loadingAdd: false,
  loadingRemove: false,
  error: '',
})

const memberState = reactive({
  workplace: '',
  values: '',
  loadingAdd: false,
  loadingRemove: false,
  error: '',
})

const designState = reactive({
  workplace: '',
  color: getCurrentPrimaryColor(),
  radius: globalRadius.value,
  shadow: globalShadow.value,
  saving: false,
  error: '',
})

const shouldRestoreTheme = ref(true)

const initialTheme = reactive<WorkplaceDesignSettings>({
  primary: getCurrentPrimaryColor(),
  radius: globalRadius.value,
  shadow: globalShadow.value,
})

const designRadiusOptions = computed(() =>
  themeRadiusOptions.map((option) => ({
    ...option,
    label: t(option.labelKey),
    description: t(option.descriptionKey),
  })),
)

const designShadowOptions = computed(() =>
  themeShadowOptions.map((option) => ({
    ...option,
    label: t(option.labelKey),
    description: t(option.descriptionKey),
  })),
)

function createWorkplaceModel(target: { workplace: string }) {
  return computed({
    get: () => target.workplace,
    set: (value: string | null | undefined) => {
      target.workplace = typeof value === 'string' ? value.trim() : ''
    },
  })
}

const updateWorkplaceModel = createWorkplaceModel(updateState)
const deleteWorkplaceModel = createWorkplaceModel(deleteState)
const pluginWorkplaceModel = createWorkplaceModel(pluginState)
const memberWorkplaceModel = createWorkplaceModel(memberState)
const designWorkplaceModel = createWorkplaceModel(designState)

const {
  createWorkplace,
  updateWorkplace,
  deleteWorkplace,
  addPlugins,
  removePlugins,
  addMembers,
  removeMembers,
} = useFrontendWorkplaceApi()

function resetFormState() {
  createState.name = ''
  createState.isPrivate = false
  createState.enabled = true
  createState.error = ''
  createState.loading = false

  updateState.workplace = ''
  updateState.name = ''
  updateState.isPrivate = false
  updateState.enabled = true
  updateState.error = ''
  updateState.loading = false

  deleteState.workplace = ''
  deleteState.error = ''
  deleteState.loading = false

  pluginState.workplace = ''
  pluginState.values = ''
  pluginState.error = ''
  pluginState.loadingAdd = false
  pluginState.loadingRemove = false

  memberState.workplace = ''
  memberState.values = ''
  memberState.error = ''
  memberState.loadingAdd = false
  memberState.loadingRemove = false

  designState.workplace = ''
  designState.color = getCurrentPrimaryColor()
  designState.radius = globalRadius.value
  designState.shadow = globalShadow.value
  designState.error = ''
  designState.saving = false

  shouldRestoreTheme.value = true

  activeTab.value = 'create'
}

watch(
  () => dialog.value,
  (isOpen) => {
    if (isOpen) {
      initialTheme.primary = getCurrentPrimaryColor()
      initialTheme.radius = globalRadius.value
      initialTheme.shadow = globalShadow.value
      shouldRestoreTheme.value = true
      return
    }

    if (shouldRestoreTheme.value) {
      applyDesign(initialTheme)
    }

    resetFormState()
    shouldRestoreTheme.value = true
  },
)

function extractErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (error instanceof FetchError) {
    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
    const data = error.data as Record<string, unknown> | undefined
    if (data?.message && typeof data.message === 'string') {
      return data.message
    }
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}

function parseIdentifiers(input: string) {
  return input
    .split(/[\n,]+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

function applyDesign(settings: WorkplaceDesignSettings) {
  if (!import.meta.client) {
    return
  }

  applyRadiusPreset(settings.radius)
  applyShadowPreset(settings.shadow)

  const lightTheme = theme.themes.value.light
  const darkTheme = theme.themes.value.dark

  if (lightTheme?.colors) {
    lightTheme.colors.primary = settings.primary
  }

  if (darkTheme?.colors) {
    darkTheme.colors.primary = settings.primary
  }
}

watch(
  () => designState.workplace,
  (workplace) => {
    if (!workplace) {
      designState.color = getCurrentPrimaryColor()
      designState.radius = globalRadius.value
      designState.shadow = globalShadow.value
      return
    }

    const savedDesign = designStorage.value[workplace]
    if (savedDesign) {
      designState.color = savedDesign.primary
      designState.radius = savedDesign.radius
      designState.shadow = savedDesign.shadow
      return
    }

    designState.color = getCurrentPrimaryColor()
    designState.radius = globalRadius.value
    designState.shadow = globalShadow.value
  },
)

watch(
  () => [designState.color, designState.radius, designState.shadow],
  () => {
    if (!dialog.value || !designState.workplace) {
      return
    }

    applyDesign({
      primary: designState.color,
      radius: designState.radius,
      shadow: designState.shadow,
    })
  },
  { deep: true },
)

async function handleCreate() {
  createState.error = ''
  const name = createState.name.trim()

  if (!name) {
    createState.error = translate(
      'workplace.dialog.validation.nameRequired',
      'The world name is required.',
    )
    Notify.error(createState.error)
    return
  }

  createState.loading = true
  try {
    await createWorkplace({
      name,
      isPrivate: createState.isPrivate,
      enabled: createState.enabled,
    })
    Notify.success(
      translate(
        'workplace.dialog.messages.createSuccess',
        'World created successfully.',
      ),
    )
    dialog.value = false
  } catch (error) {
    createState.error = extractErrorMessage(
      error,
      translate('common.unexpectedError', 'An unexpected error occurred.'),
    )
    Notify.error(createState.error)
  } finally {
    createState.loading = false
  }
}

async function handleUpdate() {
  updateState.error = ''
  const workplace = updateState.workplace.trim()
  const name = updateState.name.trim()

  if (!workplace) {
    updateState.error = translate(
      'workplace.dialog.validation.identifierRequired',
      'The world identifier is required.',
    )
    Notify.error(updateState.error)
    return
  }

  const payload: FrontendWorkplaceUpdatePayload = {
    isPrivate: updateState.isPrivate,
    enabled: updateState.enabled,
  }
  if (name.length > 0) {
    payload.name = name
  }

  updateState.loading = true
  try {
    await updateWorkplace(workplace, payload)
    Notify.success(
      translate(
        'workplace.dialog.messages.updateSuccess',
        'World updated successfully.',
      ),
    )
    dialog.value = false
  } catch (error) {
    updateState.error = extractErrorMessage(
      error,
      translate('common.unexpectedError', 'An unexpected error occurred.'),
    )
    Notify.error(updateState.error)
  } finally {
    updateState.loading = false
  }
}

async function handleDelete() {
  deleteState.error = ''
  const workplace = deleteState.workplace.trim()

  if (!workplace) {
    deleteState.error = translate(
      'workplace.dialog.validation.identifierRequired',
      'The world identifier is required.',
    )
    Notify.error(deleteState.error)
    return
  }

  deleteState.loading = true
  try {
    await deleteWorkplace(workplace)
    Notify.success(
      translate(
        'workplace.dialog.messages.deleteSuccess',
        'World deleted successfully.',
      ),
    )
    dialog.value = false
  } catch (error) {
    deleteState.error = extractErrorMessage(
      error,
      translate('common.unexpectedError', 'An unexpected error occurred.'),
    )
    Notify.error(deleteState.error)
  } finally {
    deleteState.loading = false
  }
}

async function handlePluginAction(action: 'add' | 'remove') {
  pluginState.error = ''
  const workplace = pluginState.workplace.trim()
  const identifiers = parseIdentifiers(pluginState.values)

  if (!workplace) {
    pluginState.error = translate(
      'workplace.dialog.validation.identifierRequired',
      'The world identifier is required.',
    )
    Notify.error(pluginState.error)
    return
  }

  if (!identifiers.length) {
    pluginState.error = translate(
      'workplace.dialog.validation.pluginsRequired',
      'At least one plugin identifier is required.',
    )
    Notify.error(pluginState.error)
    return
  }

  if (action === 'add') {
    pluginState.loadingAdd = true
  } else {
    pluginState.loadingRemove = true
  }

  try {
    const payload = { plugins: identifiers }
    if (action === 'add') {
      await addPlugins(workplace, payload)
      Notify.success(
        translate(
          'workplace.dialog.messages.addPluginsSuccess',
          'Plugins added successfully.',
        ),
      )
    } else {
      await removePlugins(workplace, payload)
      Notify.success(
        translate(
          'workplace.dialog.messages.removePluginsSuccess',
          'Plugins removed successfully.',
        ),
      )
    }
    pluginState.values = ''
  } catch (error) {
    pluginState.error = extractErrorMessage(
      error,
      translate('common.unexpectedError', 'An unexpected error occurred.'),
    )
    Notify.error(pluginState.error)
  } finally {
    pluginState.loadingAdd = false
    pluginState.loadingRemove = false
  }
}

async function handleMemberAction(action: 'add' | 'remove') {
  memberState.error = ''
  const workplace = memberState.workplace.trim()
  const identifiers = parseIdentifiers(memberState.values)

  if (!workplace) {
    memberState.error = translate(
      'workplace.dialog.validation.identifierRequired',
      'The world identifier is required.',
    )
    Notify.error(memberState.error)
    return
  }

  if (!identifiers.length) {
    memberState.error = translate(
      'workplace.dialog.validation.membersRequired',
      'At least one member identifier is required.',
    )
    Notify.error(memberState.error)
    return
  }

  if (action === 'add') {
    memberState.loadingAdd = true
  } else {
    memberState.loadingRemove = true
  }

  try {
    const payload = { members: identifiers }
    if (action === 'add') {
      await addMembers(workplace, payload)
      Notify.success(
        translate(
          'workplace.dialog.messages.addMembersSuccess',
          'Members added successfully.',
        ),
      )
    } else {
      await removeMembers(workplace, payload)
      Notify.success(
        translate(
          'workplace.dialog.messages.removeMembersSuccess',
          'Members removed successfully.',
        ),
      )
    }
    memberState.values = ''
  } catch (error) {
    memberState.error = extractErrorMessage(
      error,
      translate('common.unexpectedError', 'An unexpected error occurred.'),
    )
    Notify.error(memberState.error)
  } finally {
    memberState.loadingAdd = false
    memberState.loadingRemove = false
  }
}

function handleDesignSave() {
  designState.error = ''
  const workplace = designState.workplace.trim()

  if (!workplace) {
    designState.error = translate(
      'workplace.dialog.validation.identifierRequired',
      'The world identifier is required.',
    )
    Notify.error(designState.error)
    return
  }

  const settings: WorkplaceDesignSettings = {
    primary: designState.color,
    radius: designState.radius,
    shadow: designState.shadow,
  }

  designState.saving = true
  try {
    designStorage.value = {
      ...designStorage.value,
      [workplace]: settings,
    }
    applyDesign(settings)
    shouldRestoreTheme.value = false
    Notify.success(
      translate(
        'workplace.dialog.messages.designSaved',
        'Design saved successfully.',
      ),
    )
    dialog.value = false
  } finally {
    designState.saving = false
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="640">
    <v-card>
      <v-card-title class="text-wrap">
        {{ translate('workplace.dialog.title', 'Manage your world') }}
      </v-card-title>
      <v-tabs v-model="activeTab" grow class="px-4">
        <v-tab value="create">{{
          translate('common.actions.create', 'Create')
        }}</v-tab>
        <v-tab value="update">{{
          translate('common.actions.edit', 'Edit')
        }}</v-tab>
        <v-tab value="delete">{{
          translate('common.actions.delete', 'Delete')
        }}</v-tab>
        <v-tab value="plugins">{{
          translate('workplace.dialog.tabs.plugins', 'Plugins')
        }}</v-tab>
        <v-tab value="members">{{
          translate('workplace.dialog.tabs.members', 'Members')
        }}</v-tab>
        <v-tab value="design">{{
          translate('workplace.dialog.tabs.design', 'Design')
        }}</v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="activeTab">
        <v-window-item value="create">
          <v-card-text class="d-flex flex-column gap-4">
            <v-text-field
              v-model="createState.name"
              :label="translate('workplace.dialog.fields.name', 'World name')"
              :disabled="createState.loading"
              autofocus
            />
            <v-switch
              v-model="createState.isPrivate"
              :label="
                translate('workplace.dialog.fields.isPrivate', 'Private world')
              "
              :disabled="createState.loading"
            />
            <v-switch
              v-model="createState.enabled"
              :label="
                translate('workplace.dialog.fields.enabled', 'Enable world')
              "
              :disabled="createState.loading"
            />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              variant="text"
              :disabled="createState.loading"
              @click="dialog = false"
            >
              {{ translate('common.actions.close', 'Close') }}
            </v-btn>
            <v-btn
              color="primary"
              :loading="createState.loading"
              @click="handleCreate"
            >
              {{ translate('workplace.dialog.actions.create', 'Create world') }}
            </v-btn>
          </v-card-actions>
        </v-window-item>
        <v-window-item value="update">
          <v-card-text class="d-flex flex-column gap-4">
            <v-combobox
              v-model="updateWorkplaceModel"
              :items="workplaceItems"
              item-title="title"
              item-value="value"
              :label="
                translate(
                  'workplace.dialog.fields.identifier',
                  'World identifier',
                )
              "
              :disabled="updateState.loading"
              :hint="
                translate(
                  'workplace.dialog.hints.identifier',
                  'Use the slug or ID of the world.',
                )
              "
              persistent-hint
              clearable
              hide-no-data
              variant="outlined"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      item.raw.slug && item.raw.slug !== item.raw.id
                        ? item.raw.slug + ' • ' + item.raw.id
                        : item.raw.id
                    }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-combobox>
            <v-text-field
              v-model="updateState.name"
              :label="
                translate(
                  'workplace.dialog.fields.optionalName',
                  'World name (optional)',
                )
              "
              :disabled="updateState.loading"
            />
            <v-switch
              v-model="updateState.isPrivate"
              :label="
                translate('workplace.dialog.fields.isPrivate', 'Private world')
              "
              :disabled="updateState.loading"
            />
            <v-switch
              v-model="updateState.enabled"
              :label="
                translate('workplace.dialog.fields.enabled', 'Enable world')
              "
              :disabled="updateState.loading"
            />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              variant="text"
              :disabled="updateState.loading"
              @click="dialog = false"
            >
              {{ translate('common.actions.close', 'Close') }}
            </v-btn>
            <v-btn
              color="primary"
              :loading="updateState.loading"
              @click="handleUpdate"
            >
              {{ translate('workplace.dialog.actions.update', 'Save changes') }}
            </v-btn>
          </v-card-actions>
        </v-window-item>
        <v-window-item value="delete">
          <v-card-text class="d-flex flex-column gap-4">
            <v-combobox
              v-model="deleteWorkplaceModel"
              :items="workplaceItems"
              item-title="title"
              item-value="value"
              :label="
                translate(
                  'workplace.dialog.fields.identifier',
                  'World identifier',
                )
              "
              :disabled="deleteState.loading"
              clearable
              hide-no-data
              variant="outlined"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      item.raw.slug && item.raw.slug !== item.raw.id
                        ? item.raw.slug + ' • ' + item.raw.id
                        : item.raw.id
                    }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-combobox>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              variant="text"
              :disabled="deleteState.loading"
              @click="dialog = false"
            >
              {{ translate('common.actions.close', 'Close') }}
            </v-btn>
            <v-btn
              color="error"
              :loading="deleteState.loading"
              @click="handleDelete"
            >
              {{ translate('workplace.dialog.actions.delete', 'Delete world') }}
            </v-btn>
          </v-card-actions>
        </v-window-item>
        <v-window-item value="plugins">
          <v-card-text class="d-flex flex-column gap-4">
            <v-combobox
              v-model="pluginWorkplaceModel"
              :items="workplaceItems"
              item-title="title"
              item-value="value"
              :label="
                translate(
                  'workplace.dialog.fields.identifier',
                  'World identifier',
                )
              "
              :disabled="pluginState.loadingAdd || pluginState.loadingRemove"
              clearable
              hide-no-data
              variant="outlined"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      item.raw.slug && item.raw.slug !== item.raw.id
                        ? item.raw.slug + ' • ' + item.raw.id
                        : item.raw.id
                    }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-combobox>
            <v-textarea
              v-model="pluginState.values"
              :label="
                translate(
                  'workplace.dialog.fields.plugins',
                  'Plugin identifiers',
                )
              "
              :hint="
                translate(
                  'workplace.dialog.hints.list',
                  'Use commas or line breaks to separate values.',
                )
              "
              persistent-hint
              :disabled="pluginState.loadingAdd || pluginState.loadingRemove"
              rows="3"
            />
          </v-card-text>
          <v-card-actions class="justify-space-between flex-wrap gap-2">
            <v-btn
              variant="tonal"
              color="primary"
              :loading="pluginState.loadingAdd"
              :disabled="pluginState.loadingRemove"
              @click="handlePluginAction('add')"
            >
              {{
                translate('workplace.dialog.actions.addPlugins', 'Add plugins')
              }}
            </v-btn>
            <v-btn
              variant="tonal"
              color="error"
              :loading="pluginState.loadingRemove"
              :disabled="pluginState.loadingAdd"
              @click="handlePluginAction('remove')"
            >
              {{
                translate(
                  'workplace.dialog.actions.removePlugins',
                  'Remove plugins',
                )
              }}
            </v-btn>
          </v-card-actions>
        </v-window-item>
        <v-window-item value="members">
          <v-card-text class="d-flex flex-column gap-4">
            <v-combobox
              v-model="memberWorkplaceModel"
              :items="workplaceItems"
              item-title="title"
              item-value="value"
              :label="
                translate(
                  'workplace.dialog.fields.identifier',
                  'World identifier',
                )
              "
              :disabled="memberState.loadingAdd || memberState.loadingRemove"
              clearable
              hide-no-data
              variant="outlined"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      item.raw.slug && item.raw.slug !== item.raw.id
                        ? item.raw.slug + ' • ' + item.raw.id
                        : item.raw.id
                    }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-combobox>
            <v-textarea
              v-model="memberState.values"
              :label="
                translate(
                  'workplace.dialog.fields.members',
                  'Member identifiers',
                )
              "
              :hint="
                translate(
                  'workplace.dialog.hints.list',
                  'Use commas or line breaks to separate values.',
                )
              "
              persistent-hint
              :disabled="memberState.loadingAdd || memberState.loadingRemove"
              rows="3"
            />
          </v-card-text>
          <v-card-actions class="justify-space-between flex-wrap gap-2">
            <v-btn
              variant="tonal"
              color="primary"
              :loading="memberState.loadingAdd"
              :disabled="memberState.loadingRemove"
              @click="handleMemberAction('add')"
            >
              {{
                translate('workplace.dialog.actions.addMembers', 'Add members')
              }}
            </v-btn>
            <v-btn
              variant="tonal"
              color="error"
              :loading="memberState.loadingRemove"
              :disabled="memberState.loadingAdd"
              @click="handleMemberAction('remove')"
            >
              {{
                translate(
                  'workplace.dialog.actions.removeMembers',
                  'Remove members',
                )
              }}
            </v-btn>
          </v-card-actions>
        </v-window-item>
        <v-window-item value="design">
          <v-card-text class="workplace-dialog__design">
            <v-combobox
              v-model="designWorkplaceModel"
              :items="workplaceItems"
              item-title="title"
              item-value="value"
              :label="
                translate(
                  'workplace.dialog.fields.identifier',
                  'World identifier',
                )
              "
              :hint="
                translate(
                  'workplace.dialog.hints.identifier',
                  'Use the slug or ID of the world.',
                )
              "
              persistent-hint
              clearable
              hide-no-data
              variant="outlined"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      item.raw.slug && item.raw.slug !== item.raw.id
                        ? item.raw.slug + ' • ' + item.raw.id
                        : item.raw.id
                    }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-combobox>
            <v-label class="mb-2">
              {{ translate('app.settings.themePalette', 'Theme palette') }}
            </v-label>
            <v-color-picker
              v-model="designState.color"
              show-swatches
              elevation="0"
              width="288"
              mode="rgb"
              :modes="['rgb', 'hex', 'hsl']"
              :swatches="colorSwatches"
            />
            <v-divider class="my-4" />
            <v-label class="mb-2">
              {{ translate('app.settings.cornerRadius', 'Corner radius') }}
            </v-label>
            <v-item-group
              v-model="designState.radius"
              class="workplace-dialog__design-options"
              mandatory
            >
              <v-item
                v-for="option in designRadiusOptions"
                :key="option.value"
                :value="option.value"
              >
                <template #default="{ isSelected, toggle }">
                  <v-sheet
                    class="workplace-dialog__design-option"
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
            <v-label class="mb-2">
              {{ translate('app.settings.shadowDepth', 'Shadow depth') }}
            </v-label>
            <v-item-group
              v-model="designState.shadow"
              class="workplace-dialog__design-options"
              mandatory
            >
              <v-item
                v-for="option in designShadowOptions"
                :key="option.value"
                :value="option.value"
              >
                <template #default="{ isSelected, toggle }">
                  <v-sheet
                    class="workplace-dialog__design-option"
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
          <v-card-actions class="justify-end">
            <v-btn
              variant="text"
              :disabled="designState.saving"
              @click="dialog = false"
            >
              {{ translate('common.actions.close', 'Close') }}
            </v-btn>
            <v-btn
              color="primary"
              :loading="designState.saving"
              @click="handleDesignSave"
            >
              {{ translate('workplace.dialog.actions.saveDesign', 'Save design') }}
            </v-btn>
          </v-card-actions>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.workplace-dialog__design {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.workplace-dialog__design :deep(.v-color-picker) {
  align-self: center;
}

.workplace-dialog__design-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.workplace-dialog__design-option {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

.workplace-dialog__design-option:hover {
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
}

.workplace-dialog__design-option :deep(.v-selection-control) {
  margin-inline-end: 12px;
}
</style>
