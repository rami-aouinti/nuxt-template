<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useFrontendWorkplaceApi } from '~/composables/useFrontendWorkplaceApi'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useAdminStore } from '~/stores/admin'
import { Notify } from '~/stores/notification'
import type { AdminPlugin } from '~/types/plugin'
import type { User } from '~/types/user'
import type { Workplace } from '~/types/workplace'

const props = defineProps<{
  workplace: Workplace
}>()

const emit = defineEmits<{
  (e: 'refresh' | 'deleted'): void
}>()

const translate = useTranslateWithFallback()

const menu = ref(false)
const editDialog = ref(false)
const memberDialog = ref(false)
const pluginDialog = ref(false)
const deleteDialog = ref(false)

const adminStore = useAdminStore()
const { users, usersPending, plugins, pluginsPending } = storeToRefs(adminStore)

const editState = reactive({
  name: props.workplace.name ?? '',
  loading: false,
  error: '',
})

watch(
  () => props.workplace,
  (value) => {
    editState.name = value?.name ?? ''
  },
  { deep: true },
)

watch(editDialog, (open) => {
  if (open) {
    editState.error = ''
    editState.name = props.workplace.name ?? ''
  }
})

const memberState = reactive({
  selected: [] as string[],
  loading: false,
  error: '',
})

const pluginState = reactive({
  selected: [] as string[],
  loading: false,
  error: '',
})

const deleteState = reactive({
  confirmation: '',
  loading: false,
  error: '',
})

watch(memberDialog, (open) => {
  if (open) {
    memberState.error = ''
    if (!users.value?.length && !usersPending.value) {
      void adminStore.fetchUsers().catch(() => {})
    }
  } else {
    memberState.selected = []
  }
})

watch(pluginDialog, (open) => {
  if (open) {
    pluginState.error = ''
    if (!plugins.value?.length && !pluginsPending.value) {
      void adminStore.fetchPlugins().catch(() => {})
    }
  } else {
    pluginState.selected = []
  }
})

watch(deleteDialog, (open) => {
  if (open) {
    deleteState.error = ''
    deleteState.confirmation = ''
  }
})

const userItems = computed(() => {
  return (users.value ?? []).map((user: User) => {
    const fullName = [user.firstName, user.lastName]
      .filter((part) => typeof part === 'string' && part.trim().length > 0)
      .join(' ')
    const displayName = fullName || user.username || user.email
    const secondary = user.email && user.email !== displayName ? user.email : ''

    return {
      title: displayName,
      value: user.id || user.username,
      subtitle: secondary,
    }
  })
})

const pluginItems = computed(() => {
  return (plugins.value ?? []).map((plugin: AdminPlugin) => ({
    title: plugin.name || plugin.key,
    value: plugin.key,
    subtitle: plugin.description ?? plugin.subTitle ?? '',
  }))
})

const { updateWorkplace, deleteWorkplace, addMembers, addPlugins } =
  useFrontendWorkplaceApi()

function extractErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }
  if (typeof (error as { data?: { message?: string } }).data === 'object') {
    const data = (error as { data?: { message?: string } }).data
    if (
      data &&
      typeof data.message === 'string' &&
      data.message.trim().length > 0
    ) {
      return data.message
    }
  }
  return fallback
}

async function handleEditSubmit() {
  editState.error = ''
  const name = editState.name.trim()

  if (!name) {
    editState.error = translate(
      'workplace.dialog.validation.nameRequired',
      'The world name is required.',
    )
    Notify.error(editState.error)
    return
  }

  editState.loading = true
  try {
    await updateWorkplace(props.workplace.slug, { name })
    Notify.success(
      translate(
        'workplace.dialog.messages.updateSuccess',
        'World updated successfully.',
      ),
    )
    editDialog.value = false
    emit('refresh')
  } catch (error) {
    editState.error = extractErrorMessage(
      error,
      translate('common.unexpectedError', 'An unexpected error occurred.'),
    )
    Notify.error(editState.error)
  } finally {
    editState.loading = false
  }
}

async function handleMemberSubmit() {
  memberState.error = ''
  if (!memberState.selected.length) {
    memberState.error = translate(
      'workplace.dialog.validation.membersRequired',
      'At least one member identifier is required.',
    )
    Notify.error(memberState.error)
    return
  }

  memberState.loading = true
  try {
    await addMembers(props.workplace.slug, { members: memberState.selected })
    Notify.success(
      translate(
        'workplace.dialog.messages.addMembersSuccess',
        'Members added successfully.',
      ),
    )
    memberDialog.value = false
    emit('refresh')
  } catch (error) {
    memberState.error = extractErrorMessage(
      error,
      translate('common.unexpectedError', 'An unexpected error occurred.'),
    )
    Notify.error(memberState.error)
  } finally {
    memberState.loading = false
  }
}

async function handlePluginSubmit() {
  pluginState.error = ''
  if (!pluginState.selected.length) {
    pluginState.error = translate(
      'workplace.dialog.validation.pluginsRequired',
      'At least one plugin identifier is required.',
    )
    Notify.error(pluginState.error)
    return
  }

  pluginState.loading = true
  try {
    await addPlugins(props.workplace.slug, { plugins: pluginState.selected })
    Notify.success(
      translate(
        'workplace.dialog.messages.addPluginsSuccess',
        'Plugins added successfully.',
      ),
    )
    pluginDialog.value = false
    emit('refresh')
  } catch (error) {
    pluginState.error = extractErrorMessage(
      error,
      translate('common.unexpectedError', 'An unexpected error occurred.'),
    )
    Notify.error(pluginState.error)
  } finally {
    pluginState.loading = false
  }
}

async function handleDeleteSubmit() {
  deleteState.error = ''
  const confirmation = deleteState.confirmation.trim()

  if (confirmation !== props.workplace.slug) {
    deleteState.error = translate(
      'workplace.dialog.validation.identifierRequired',
      'The world identifier is required.',
    )
    Notify.error(deleteState.error)
    return
  }

  deleteState.loading = true
  try {
    await deleteWorkplace(props.workplace.slug)
    Notify.success(
      translate(
        'workplace.dialog.messages.deleteSuccess',
        'World deleted successfully.',
      ),
    )
    deleteDialog.value = false
    emit('deleted')
    emit('refresh')
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
</script>

<template>
  <div>
    <v-menu v-model="menu" location="bottom end" offset="8">
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          icon
          variant="text"
          size="small"
          density="compact"
          style="color: rgba(var(--v-theme-on-surface), 0.92)"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list density="compact" class="py-1">
        <v-list-item
          prepend-icon="mdi-pencil"
          :title="translate('common.actions.edit', 'Edit')"
          @click="editDialog = true"
        />
        <v-list-item
          prepend-icon="mdi-account-plus"
          :title="
            translate('workplace.dialog.actions.addMembers', 'Add members')
          "
          @click="memberDialog = true"
        />
        <v-list-item
          prepend-icon="mdi-puzzle-plus"
          :title="
            translate('workplace.dialog.actions.addPlugins', 'Install plugins')
          "
          @click="pluginDialog = true"
        />
        <v-divider class="my-1" />
        <v-list-item
          prepend-icon="mdi-delete"
          :title="translate('common.actions.delete', 'Delete')"
          color="error"
          @click="deleteDialog = true"
        />
      </v-list>
    </v-menu>

    <v-dialog v-model="editDialog" max-width="480">
      <v-card>
        <v-card-title class="text-wrap">
          {{ translate('workplace.dialog.actions.update', 'Edit world') }}
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{
              translate(
                'workplace.dialog.hints.identifier',
                'Update the visible name of your world.',
              )
            }}
          </p>
          <v-text-field
            v-model="editState.name"
            :label="translate('workplace.dialog.fields.name', 'World name')"
            :error="Boolean(editState.error)"
            :error-messages="editState.error ? [editState.error] : []"
            prepend-inner-icon="mdi-earth"
            clearable
            autofocus
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="editDialog = false">
            {{ translate('common.actions.cancel', 'Cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="editState.loading"
            @click="handleEditSubmit"
          >
            {{ translate('common.actions.save', 'Save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="memberDialog" max-width="520">
      <v-card>
        <v-card-title class="text-wrap">
          {{ translate('workplace.dialog.actions.addMembers', 'Add members') }}
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{
              translate(
                'workplace.dialog.hints.list',
                'Pick the teammates you want to invite to this world.',
              )
            }}
          </p>
          <v-autocomplete
            v-model="memberState.selected"
            :items="userItems"
            :loading="usersPending"
            multiple
            chips
            closable-chips
            clearable
            hide-selected
            item-title="title"
            item-value="value"
            :label="translate('workplace.dialog.fields.members', 'Members')"
            prepend-inner-icon="mdi-account-multiple"
            :error="Boolean(memberState.error)"
            :error-messages="memberState.error ? [memberState.error] : []"
          >
            <template #chip="{ item }">
              <v-chip
                :text="item?.title ?? ''"
                color="primary"
                size="small"
                class="me-2 mb-2"
              />
            </template>
            <template #item="{ props: slotProps, item }">
              <v-list-item
                v-bind="slotProps"
                :title="item.title"
                :subtitle="item.subtitle"
              >
                <template #prepend>
                  <v-avatar color="primary" variant="tonal" size="28">
                    <span class="text-caption">
                      {{ item.title?.slice(0, 2)?.toUpperCase() }}
                    </span>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="memberDialog = false">
            {{ translate('common.actions.cancel', 'Cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="memberState.loading"
            @click="handleMemberSubmit"
          >
            {{
              translate('workplace.dialog.actions.addMembers', 'Add members')
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="pluginDialog" max-width="520">
      <v-card>
        <v-card-title class="text-wrap">
          {{
            translate('workplace.dialog.actions.addPlugins', 'Install plugins')
          }}
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{
              translate(
                'workplace.dialog.hints.list',
                'Choose the plugins that will power this world.',
              )
            }}
          </p>
          <v-autocomplete
            v-model="pluginState.selected"
            :items="pluginItems"
            :loading="pluginsPending"
            multiple
            chips
            closable-chips
            clearable
            hide-selected
            item-title="title"
            item-value="value"
            :label="translate('workplace.dialog.fields.plugins', 'Plugins')"
            prepend-inner-icon="mdi-puzzle"
            :error="Boolean(pluginState.error)"
            :error-messages="pluginState.error ? [pluginState.error] : []"
          >
            <template #chip="{ item }">
              <v-chip
                :text="item?.title ?? ''"
                color="secondary"
                size="small"
                class="me-2 mb-2"
              />
            </template>
            <template #item="{ props: slotProps, item }">
              <v-list-item
                v-bind="slotProps"
                :title="item.title"
                :subtitle="item.subtitle"
              >
                <template #prepend>
                  <v-avatar color="secondary" variant="tonal" size="28">
                    <v-icon size="18">mdi-puzzle</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="pluginDialog = false">
            {{ translate('common.actions.cancel', 'Cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="pluginState.loading"
            @click="handlePluginSubmit"
          >
            {{
              translate(
                'workplace.dialog.actions.addPlugins',
                'Install plugins',
              )
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="480">
      <v-card>
        <v-card-title class="text-wrap text-error">
          {{ translate('workplace.dialog.actions.delete', 'Delete world') }}
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{
              translate(
                'workplace.dialog.hints.delete',
                'Type the world identifier to confirm this action.',
              )
            }}
          </p>
          <v-alert type="warning" variant="tonal" class="mb-4" border="start">
            {{
              translate(
                'workplace.dialog.messages.deleteConfirmation',
                'Deleting a world is permanent and cannot be undone.',
              )
            }}
          </v-alert>
          <v-text-field
            v-model="deleteState.confirmation"
            :label="
              translate(
                'workplace.dialog.fields.identifier',
                'World identifier',
              )
            "
            :hint="props.workplace.slug"
            persistent-hint
            prepend-inner-icon="mdi-alert"
            :error="Boolean(deleteState.error)"
            :error-messages="deleteState.error ? [deleteState.error] : []"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="deleteDialog = false">
            {{ translate('common.actions.cancel', 'Cancel') }}
          </v-btn>
          <v-btn
            color="error"
            :loading="deleteState.loading"
            @click="handleDeleteSubmit"
          >
            {{ translate('workplace.dialog.actions.delete', 'Delete world') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.v-list-item[color='error'] {
  --v-theme-overlay-multiplier: 0;
}
</style>
