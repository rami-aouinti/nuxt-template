<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'

import { useFrontendWorkplaceApi } from '~/composables/useFrontendWorkplaceApi'
import { Notify } from '~/stores/notification'
import type { FrontendWorkplaceUpdatePayload } from '~/types/workplace'

const props = defineProps<{
  modelValue: boolean
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

const activeTab = ref<'create' | 'update' | 'delete' | 'plugins' | 'members'>('create')

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

  activeTab.value = 'create'
}

watch(
  () => dialog.value,
  (isOpen) => {
    if (!isOpen) {
      resetFormState()
    }
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
      translate('workplace.dialog.messages.createSuccess', 'World created successfully.'),
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
      translate('workplace.dialog.messages.updateSuccess', 'World updated successfully.'),
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
      translate('workplace.dialog.messages.deleteSuccess', 'World deleted successfully.'),
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
    dialog.value = false
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
    dialog.value = false
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
</script>

<template>
  <v-dialog v-model="dialog" max-width="640">
    <v-card>
      <v-card-title class="text-wrap">
        {{ translate('workplace.dialog.title', 'Manage your world') }}
      </v-card-title>
      <v-tabs
        v-model="activeTab"
        grow
        class="px-4"
      >
        <v-tab value="create">{{ translate('common.actions.create', 'Create') }}</v-tab>
        <v-tab value="update">{{ translate('common.actions.edit', 'Edit') }}</v-tab>
        <v-tab value="delete">{{ translate('common.actions.delete', 'Delete') }}</v-tab>
        <v-tab value="plugins">{{ translate('workplace.dialog.tabs.plugins', 'Plugins') }}</v-tab>
        <v-tab value="members">{{ translate('workplace.dialog.tabs.members', 'Members') }}</v-tab>
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
              :label="translate('workplace.dialog.fields.isPrivate', 'Private world')"
              :disabled="createState.loading"
            />
            <v-switch
              v-model="createState.enabled"
              :label="translate('workplace.dialog.fields.enabled', 'Enable world')"
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
            <v-text-field
              v-model="updateState.workplace"
              :label="translate('workplace.dialog.fields.identifier', 'World identifier')"
              :disabled="updateState.loading"
              :hint="translate('workplace.dialog.hints.identifier', 'Use the slug or ID of the world.')"
              persistent-hint
            />
            <v-text-field
              v-model="updateState.name"
              :label="translate('workplace.dialog.fields.optionalName', 'World name (optional)')"
              :disabled="updateState.loading"
            />
            <v-switch
              v-model="updateState.isPrivate"
              :label="translate('workplace.dialog.fields.isPrivate', 'Private world')"
              :disabled="updateState.loading"
            />
            <v-switch
              v-model="updateState.enabled"
              :label="translate('workplace.dialog.fields.enabled', 'Enable world')"
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
            <v-text-field
              v-model="deleteState.workplace"
              :label="translate('workplace.dialog.fields.identifier', 'World identifier')"
              :disabled="deleteState.loading"
            />
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
            <v-text-field
              v-model="pluginState.workplace"
              :label="translate('workplace.dialog.fields.identifier', 'World identifier')"
              :disabled="pluginState.loadingAdd || pluginState.loadingRemove"
            />
            <v-textarea
              v-model="pluginState.values"
              :label="translate('workplace.dialog.fields.plugins', 'Plugin identifiers')"
              :hint="translate('workplace.dialog.hints.list', 'Use commas or line breaks to separate values.')"
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
              {{ translate('workplace.dialog.actions.addPlugins', 'Add plugins') }}
            </v-btn>
            <v-btn
              variant="tonal"
              color="error"
              :loading="pluginState.loadingRemove"
              :disabled="pluginState.loadingAdd"
              @click="handlePluginAction('remove')"
            >
              {{ translate('workplace.dialog.actions.removePlugins', 'Remove plugins') }}
            </v-btn>
          </v-card-actions>
        </v-window-item>
        <v-window-item value="members">
          <v-card-text class="d-flex flex-column gap-4">
            <v-text-field
              v-model="memberState.workplace"
              :label="translate('workplace.dialog.fields.identifier', 'World identifier')"
              :disabled="memberState.loadingAdd || memberState.loadingRemove"
            />
            <v-textarea
              v-model="memberState.values"
              :label="translate('workplace.dialog.fields.members', 'Member identifiers')"
              :hint="translate('workplace.dialog.hints.list', 'Use commas or line breaks to separate values.')"
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
              {{ translate('workplace.dialog.actions.addMembers', 'Add members') }}
            </v-btn>
            <v-btn
              variant="tonal"
              color="error"
              :loading="memberState.loadingRemove"
              :disabled="memberState.loadingAdd"
              @click="handleMemberAction('remove')"
            >
              {{ translate('workplace.dialog.actions.removeMembers', 'Remove members') }}
            </v-btn>
          </v-card-actions>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>
