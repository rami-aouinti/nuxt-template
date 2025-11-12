<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'

import { useAdminStore } from '~/stores/admin'
import { Notify } from '~/stores/notification'
import type { AdminPlugin, AdminPluginPayload } from '~/types/plugin'
import AppButton from "~/components/ui/AppButton.vue";
import AppList from "~/components/ui/AppList.vue";

definePageMeta({
  title: 'navigation.plugins',
  icon: 'mdi-puzzle-outline',
  drawerIndex: 0,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()
const adminStore = useAdminStore()
const {
  plugins: pluginsRef,
  pluginsPending: pending,
  pluginsError: error,
  pluginCount: pluginCountRef,
} = storeToRefs(adminStore)

await Promise.all([adminStore.fetchPlugins(), adminStore.fetchPluginCount()])

const search = ref('')

const headers = computed<DataTableHeader[]>(() => [
  { title: t('pluginManagement.plugins.table.name'), key: 'name' },
  { title: t('pluginManagement.plugins.table.key'), key: 'key' },
  {
    title: t('pluginManagement.plugins.table.status'),
    key: 'active',
    sortable: false,
  },
  {
    title: t('pluginManagement.plugins.table.installed'),
    key: 'installed',
    sortable: false,
  },
  {
    title: t('pluginManagement.plugins.table.updatedAt'),
    key: 'updatedAt',
  },
  {
    title: '',
    key: 'actions',
    sortable: false,
    align: 'end',
    width: 200,
    exportable: false,
  },
])

const items = computed<AdminPlugin[]>(() => pluginsRef.value ?? [])
const tableError = computed(() =>
  error.value ? t('pluginManagement.plugins.errors.loadFailed') : null,
)

const pluginCountDisplay = computed(
  () => pluginCountRef.value ?? items.value.length,
)

const dateFormatter = computed(
  () =>
    new Intl.DateTimeFormat(locale.value ?? 'en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
)

function formatDate(value: string | number | Date | null | undefined) {
  if (value == null) {
    return t('pluginManagement.plugins.labels.notAvailable')
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string'
      ? value
      : t('pluginManagement.plugins.labels.notAvailable')
  }

  return dateFormatter.value.format(date)
}

function displayOptional(value: unknown) {
  if (value == null) {
    return t('pluginManagement.plugins.labels.notAvailable')
  }

  if (typeof value === 'string') {
    const normalized = value.trim()
    return normalized.length > 0
      ? normalized
      : t('pluginManagement.plugins.labels.notAvailable')
  }

  return String(value)
}

function resolveIdentifier(plugin: AdminPlugin | null) {
  if (!plugin) {
    return ''
  }

  const id = typeof plugin.id === 'string' ? plugin.id.trim() : ''
  if (id) {
    return id
  }

  return plugin.key
}

const refresh = () =>
  Promise.all([adminStore.refreshPlugins(), adminStore.refreshPluginCount()])

const actionLoading = ref(false)
const deleteLoading = ref(false)
const viewLoading = ref(false)

const formError = ref('')
const deleteError = ref('')
const viewError = ref('')

const createDialog = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)
const viewDialog = ref(false)

const editingPlugin = ref<AdminPlugin | null>(null)
const deletingPlugin = ref<AdminPlugin | null>(null)
const viewPlugin = ref<AdminPlugin | null>(null)

interface PluginFormState {
  key: string
  name: string
  subTitle: string
  description: string
  logo: string
  icon: string
  link: string
  pricing: string
  action: string
  active: boolean
  installed: boolean
}

const defaultFormState = (): PluginFormState => ({
  key: '',
  name: '',
  subTitle: '',
  description: '',
  logo: '',
  icon: '',
  link: '',
  pricing: '',
  action: '',
  active: true,
  installed: false,
})

const form = reactive<PluginFormState>(defaultFormState())

const canSubmit = computed(
  () =>
    form.key.trim().length > 0 &&
    form.name.trim().length > 0 &&
    !actionLoading.value,
)

function resetForm() {
  Object.assign(form, defaultFormState())
}

function populateForm(plugin: AdminPlugin) {
  form.key = plugin.key ?? ''
  form.name = plugin.name ?? ''
  form.subTitle = plugin.subTitle ?? ''
  form.description = plugin.description ?? ''
  form.logo = plugin.logo ?? ''
  form.icon = plugin.icon ?? ''
  form.link = plugin.link ?? ''
  form.pricing = plugin.pricing ?? ''
  form.action = plugin.action ?? ''
  form.active = Boolean(plugin.active)
  form.installed = Boolean(plugin.installed)
}

function extractRequestError(error: unknown, fallback: string) {
  if (error && typeof error === 'object') {
    const withData = error as {
      data?: { message?: unknown; error?: unknown }
      message?: unknown
    }

    if (withData.data && typeof withData.data === 'object') {
      const data = withData.data as Record<string, unknown>
      const message = data.message
      const errorMessage = data.error

      if (typeof message === 'string' && message.trim().length > 0) {
        return message
      }
      if (typeof errorMessage === 'string' && errorMessage.trim().length > 0) {
        return errorMessage
      }
    }

    if (
      typeof withData.message === 'string' &&
      withData.message.trim().length > 0
    ) {
      return withData.message
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}

function normalizeOptionalField(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function buildPayload(): AdminPluginPayload {
  const payload: AdminPluginPayload = {
    key: form.key.trim(),
    name: form.name.trim(),
    active: form.active,
    installed: form.installed,
  }

  const optionalMap: Array<[keyof AdminPluginPayload, string]> = [
    ['subTitle', form.subTitle],
    ['description', form.description],
    ['logo', form.logo],
    ['icon', form.icon],
    ['link', form.link],
    ['pricing', form.pricing],
    ['action', form.action],
  ]

  for (const [key, value] of optionalMap) {
    const normalized = normalizeOptionalField(value)
    if (normalized !== undefined) {
      payload[key] = normalized
    }
  }

  return payload
}

function openCreate() {
  createDialog.value = true
}

function closeCreate() {
  if (actionLoading.value) {
    return
  }

  createDialog.value = false
}

async function submitCreate() {
  formError.value = ''

  if (!canSubmit.value) {
    formError.value = t('pluginManagement.plugins.errors.invalidForm')
    return
  }

  actionLoading.value = true
  try {
    const payload = buildPayload()
    await $fetch('/api/v1/plugin', {
      method: 'POST',
      body: payload,
    })

    Notify.success(t('pluginManagement.plugins.notifications.createSuccess'))
    createDialog.value = false
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('pluginManagement.plugins.errors.createFailed'),
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openEdit(plugin: AdminPlugin) {
  editingPlugin.value = plugin
  populateForm(plugin)
  formError.value = ''
  editDialog.value = true
}

function closeEdit() {
  if (actionLoading.value) {
    return
  }

  editDialog.value = false
}

async function submitEdit() {
  if (!editingPlugin.value) {
    return
  }

  formError.value = ''

  if (!canSubmit.value) {
    formError.value = t('pluginManagement.plugins.errors.invalidForm')
    return
  }

  const id = resolveIdentifier(editingPlugin.value)
  if (!id) {
    formError.value = t('pluginManagement.plugins.errors.missingIdentifier')
    return
  }

  actionLoading.value = true
  try {
    const payload = buildPayload()
    await $fetch(`/api/v1/plugin/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: payload,
    })

    Notify.success(t('pluginManagement.plugins.notifications.updateSuccess'))
    editDialog.value = false
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('pluginManagement.plugins.errors.updateFailed'),
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openDelete(plugin: AdminPlugin) {
  deletingPlugin.value = plugin
  deleteError.value = ''
  deleteDialog.value = true
}

function closeDelete() {
  if (deleteLoading.value) {
    return
  }

  deleteDialog.value = false
}

async function confirmDelete() {
  if (!deletingPlugin.value) {
    return
  }

  deleteError.value = ''
  const id = resolveIdentifier(deletingPlugin.value)
  if (!id) {
    deleteError.value = t('pluginManagement.plugins.errors.missingIdentifier')
    return
  }

  deleteLoading.value = true
  try {
    await $fetch(`/api/v1/plugin/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })

    Notify.success(t('pluginManagement.plugins.notifications.deleteSuccess'))
    deleteDialog.value = false
    await refresh()
  } catch (error) {
    deleteError.value = extractRequestError(
      error,
      t('pluginManagement.plugins.errors.deleteFailed'),
    )
    Notify.error(deleteError.value)
  } finally {
    deleteLoading.value = false
  }
}

async function openView(plugin: AdminPlugin) {
  viewDialog.value = true
  viewPlugin.value = plugin
  viewError.value = ''
  viewLoading.value = true

  const id = resolveIdentifier(plugin)
  if (!id) {
    viewLoading.value = false
    viewError.value = t('pluginManagement.plugins.errors.missingIdentifier')
    return
  }

  try {
    const response = await $fetch<AdminPlugin>(
      `/api/v1/plugin/${encodeURIComponent(id)}`,
    )
    viewPlugin.value = response
  } catch (error) {
    viewError.value = extractRequestError(
      error,
      t('pluginManagement.plugins.errors.loadDetails'),
    )
  } finally {
    viewLoading.value = false
  }
}

function closeView() {
  if (viewLoading.value) {
    return
  }

  viewDialog.value = false
}

watch(createDialog, (value) => {
  if (!value) {
    actionLoading.value = false
    formError.value = ''
    resetForm()
  }
})

watch(editDialog, (value) => {
  if (!value) {
    actionLoading.value = false
    formError.value = ''
    editingPlugin.value = null
    resetForm()
  }
})

watch(deleteDialog, (value) => {
  if (!value) {
    deleteLoading.value = false
    deleteError.value = ''
    deletingPlugin.value = null
  }
})

watch(viewDialog, (value) => {
  if (!value) {
    viewLoading.value = false
    viewError.value = ''
    viewPlugin.value = null
  }
})
</script>

<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col>
        <AdminDataTable
          v-model:search="search"
          :headers="headers"
          :items="items"
          :loading="pending"
          :error="tableError"
          :title="t('pluginManagement.plugins.cardTitle')"
          :subtitle="t('pluginManagement.plugins.cardSubtitle')"
          :search-placeholder="t('pluginManagement.plugins.searchPlaceholder')"
          item-value="key"
          color="primary"
          @refresh="refresh"
        >
          <template #header-actions>
            <div class="d-flex align-center gap-2 flex-wrap justify-end w-100">
              <v-chip
                color="primary"
                variant="tonal"
                class="text-uppercase font-weight-medium"
              >
                {{
                  t('pluginManagement.plugins.labels.total', {
                    count: pluginCountDisplay,
                  })
                }}
              </v-chip>
              <AppButton color="primary" @click="openCreate">
                <v-icon icon="mdi-plus" start />
                {{ t('pluginManagement.plugins.dialogs.create.title') }}
              </AppButton>
            </div>
          </template>

          <template #[`item.active`]="{ value }">
            <v-chip
              :color="value ? 'success' : 'warning'"
              class="text-uppercase font-weight-medium"
              size="small"
              variant="flat"
            >
              {{
                value
                  ? t('pluginManagement.plugins.labels.active')
                  : t('pluginManagement.plugins.labels.inactive')
              }}
            </v-chip>
          </template>

          <template #[`item.installed`]="{ value }">
            <v-chip
              :color="value ? 'primary' : 'default'"
              class="text-uppercase font-weight-medium"
              size="small"
              variant="flat"
            >
              {{
                value
                  ? t('pluginManagement.plugins.labels.installed')
                  : t('pluginManagement.plugins.labels.notInstalled')
              }}
            </v-chip>
          </template>

          <template #[`item.updatedAt`]="{ value }">
            {{ formatDate(value) }}
          </template>

          <template #[`item.actions`]="{ item }">
            <div class="d-flex justify-end gap-1">
              <v-tooltip
                :text="t('pluginManagement.plugins.actions.view')"
                :aria-label="t('pluginManagement.plugins.actions.view')"
                location="top"
              >
                <template #activator="{ props }">
                  <AppButton
                    v-bind="props"
                    icon="mdi-eye-outline"
                    variant="text"
                    color="primary"
                    @click="openView(item as AdminPlugin)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip
                :text="t('pluginManagement.plugins.actions.edit')"
                :aria-label="t('pluginManagement.plugins.actions.edit')"
                location="top"
              >
                <template #activator="{ props }">
                  <AppButton
                    v-bind="props"
                    icon="mdi-pencil-outline"
                    variant="text"
                    color="primary"
                    @click="openEdit(item as AdminPlugin)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip
                :text="t('pluginManagement.plugins.actions.delete')"
                :aria-label="t('pluginManagement.plugins.actions.delete')"
                location="top"
              >
                <template #activator="{ props }">
                  <AppButton
                    v-bind="props"
                    icon="mdi-trash-can-outline"
                    variant="text"
                    color="error"
                    @click="openDelete(item as AdminPlugin)"
                  />
                </template>
              </v-tooltip>
            </div>
          </template>
        </AdminDataTable>
      </v-col>
    </v-row>

    <AppModal
      v-model="createDialog"
      :max-width="680"
      icon="mdi-puzzle-plus"
      :close-disabled="actionLoading"
      :title="t('pluginManagement.plugins.dialogs.create.title')"
      @close="closeCreate"
    >
      <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
        {{ formError }}
      </v-alert>

      <v-form @submit.prevent="submitCreate">
        <v-row class="g-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name"
              :label="t('pluginManagement.plugins.fields.name')"
              :disabled="actionLoading"
              required
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.key"
              :label="t('pluginManagement.plugins.fields.key')"
              :disabled="actionLoading"
              required
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.subTitle"
              :label="t('pluginManagement.plugins.fields.subTitle')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.pricing"
              :label="t('pluginManagement.plugins.fields.pricing')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              :label="t('pluginManagement.plugins.fields.description')"
              :disabled="actionLoading"
              auto-grow
              rows="3"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.logo"
              :label="t('pluginManagement.plugins.fields.logo')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.icon"
              :label="t('pluginManagement.plugins.fields.icon')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.link"
              :label="t('pluginManagement.plugins.fields.link')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.action"
              :label="t('pluginManagement.plugins.fields.action')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-switch
              v-model="form.active"
              :label="t('pluginManagement.plugins.fields.active')"
              :disabled="actionLoading"
              color="primary"
              inset
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-switch
              v-model="form.installed"
              :label="t('pluginManagement.plugins.fields.installed')"
              :disabled="actionLoading"
              color="primary"
              inset
            />
          </v-col>
        </v-row>
      </v-form>

      <template #actions>
        <AppButton variant="text" :disabled="actionLoading" @click="closeCreate">
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          color="primary"
          :disabled="!canSubmit"
          :loading="actionLoading"
          @click="submitCreate"
        >
          {{ t('common.actions.create') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal
      v-model="editDialog"
      :max-width="680"
      icon="mdi-pencil-outline"
      :close-disabled="actionLoading"
      :title="
        t('pluginManagement.plugins.dialogs.edit.title', {
          name:
            editingPlugin?.name ??
            t('pluginManagement.plugins.labels.pluginFallback'),
        })
      "
      @close="closeEdit"
    >
      <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
        {{ formError }}
      </v-alert>

      <v-form @submit.prevent="submitEdit">
        <v-row class="g-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name"
              :label="t('pluginManagement.plugins.fields.name')"
              :disabled="actionLoading"
              required
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.key"
              :label="t('pluginManagement.plugins.fields.key')"
              :disabled="actionLoading"
              required
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.subTitle"
              :label="t('pluginManagement.plugins.fields.subTitle')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.pricing"
              :label="t('pluginManagement.plugins.fields.pricing')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              :label="t('pluginManagement.plugins.fields.description')"
              :disabled="actionLoading"
              auto-grow
              rows="3"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.logo"
              :label="t('pluginManagement.plugins.fields.logo')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.icon"
              :label="t('pluginManagement.plugins.fields.icon')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.link"
              :label="t('pluginManagement.plugins.fields.link')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.action"
              :label="t('pluginManagement.plugins.fields.action')"
              :disabled="actionLoading"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-switch
              v-model="form.active"
              :label="t('pluginManagement.plugins.fields.active')"
              :disabled="actionLoading"
              color="primary"
              inset
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-switch
              v-model="form.installed"
              :label="t('pluginManagement.plugins.fields.installed')"
              :disabled="actionLoading"
              color="primary"
              inset
            />
          </v-col>
        </v-row>
      </v-form>

      <template #actions>
        <AppButton variant="text" :disabled="actionLoading" @click="closeEdit">
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          color="primary"
          :disabled="!canSubmit"
          :loading="actionLoading"
          @click="submitEdit"
        >
          {{ t('common.actions.save') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal
      v-model="deleteDialog"
      :max-width="520"
      icon="mdi-trash-can-outline"
      :close-disabled="deleteLoading"
      :title="t('pluginManagement.plugins.dialogs.delete.title')"
      @close="closeDelete"
    >
      <v-alert v-if="deleteError" type="error" variant="tonal" class="mb-4">
        {{ deleteError }}
      </v-alert>

      <p class="text-body-1">
        {{
          t('pluginManagement.plugins.dialogs.delete.message', {
            name:
              deletingPlugin?.name ??
              t('pluginManagement.plugins.labels.pluginFallback'),
          })
        }}
      </p>

      <template #actions>
        <AppButton variant="text" :disabled="deleteLoading" @click="closeDelete">
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          color="error"
          :loading="deleteLoading"
          :disabled="deleteLoading"
          @click="confirmDelete"
        >
          {{ t('common.actions.delete') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal
      v-model="viewDialog"
      :max-width="640"
      icon="mdi-eye-outline"
      :close-disabled="viewLoading"
      :title="
        t('pluginManagement.plugins.dialogs.view.title', {
          name:
            viewPlugin?.name ??
            t('pluginManagement.plugins.labels.pluginFallback'),
        })
      "
      @close="closeView"
    >
      <v-alert v-if="viewError" type="error" variant="tonal" class="mb-4">
        {{ viewError }}
      </v-alert>

      <v-skeleton-loader
        v-else-if="viewLoading"
        type="article"
        class="rounded-lg"
      />

      <div v-else class="d-flex flex-column gap-4">
        <div class="d-flex gap-2 flex-wrap">
          <v-chip
            :color="viewPlugin?.active ? 'success' : 'warning'"
            variant="flat"
            class="text-uppercase"
            size="small"
          >
            {{
              viewPlugin?.active
                ? t('pluginManagement.plugins.labels.active')
                : t('pluginManagement.plugins.labels.inactive')
            }}
          </v-chip>
          <v-chip
            :color="viewPlugin?.installed ? 'primary' : 'default'"
            variant="flat"
            class="text-uppercase"
            size="small"
          >
            {{
              viewPlugin?.installed
                ? t('pluginManagement.plugins.labels.installed')
                : t('pluginManagement.plugins.labels.notInstalled')
            }}
          </v-chip>
        </div>

        <AppList lines="two" density="comfortable" class="rounded-lg">
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.name') }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ viewPlugin?.name }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.key') }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ viewPlugin?.key }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.subTitle') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ displayOptional(viewPlugin?.subTitle ?? null) }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.description') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ displayOptional(viewPlugin?.description ?? null) }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.link') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <template v-if="viewPlugin?.link">
                <a
                  :href="viewPlugin.link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ viewPlugin.link }}
                </a>
              </template>
              <span v-else>{{ displayOptional(null) }}</span>
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.pricing') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ displayOptional(viewPlugin?.pricing ?? null) }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.logo') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ displayOptional(viewPlugin?.logo ?? null) }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.icon') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ displayOptional(viewPlugin?.icon ?? null) }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.fields.action') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ displayOptional(viewPlugin?.action ?? null) }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.labels.createdAt') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate(viewPlugin?.createdAt ?? null) }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-medium-emphasis">
              {{ t('pluginManagement.plugins.labels.updatedAt') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate(viewPlugin?.updatedAt ?? null) }}
            </v-list-item-subtitle>
          </v-list-item>
        </AppList>
      </div>

      <template #actions>
        <AppButton variant="text" :disabled="viewLoading" @click="closeView">
          {{ t('common.actions.close') }}
        </AppButton>
      </template>
    </AppModal>
  </v-container>
</template>
