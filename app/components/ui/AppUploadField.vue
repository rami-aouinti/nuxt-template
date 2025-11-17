<template>
  <div class="app-upload-field" :class="{ 'app-upload-field--disabled': disabled }">
    <label v-if="label" class="app-upload-field__label">{{ label }}</label>

    <div
      class="app-upload-field__drop"
      :class="{
        'app-upload-field__drop--has-preview': hasPreview,
        'app-upload-field__drop--has-selection': hasSelection,
        'app-upload-field__drop--rounded': rounded,
      }"
      role="button"
      :tabindex="disabled ? -1 : 0"
      @click="triggerUpload"
      @keydown.enter.prevent="triggerUpload"
      @keydown.space.prevent="triggerUpload"
    >
      <input
        ref="inputRef"
        class="app-upload-field__input"
        type="file"
        :multiple="multiple"
        :accept="accept"
        :disabled="disabled"
        @change="onFileChange"
      />

      <Transition name="app-upload-field-fade" mode="out-in">
        <div v-if="hasPreview" key="preview" class="app-upload-field__preview">
          <img :src="previewSource" alt="" loading="lazy" />
          <div v-if="filesCount > 1" class="app-upload-field__preview-count">
            +{{ filesCount - 1 }}
          </div>
          <v-btn
            v-if="clearable"
            class="app-upload-field__clear"
            size="small"
            color="surface"
            variant="flat"
            rounded="pill"
            @click.stop="clearSelection"
          >
            {{ clearLabel }}
          </v-btn>
        </div>
        <div v-else key="placeholder" class="app-upload-field__placeholder">
          <div class="app-upload-field__placeholder-icon">
            <v-icon :icon="icon" size="36" />
          </div>
          <p class="app-upload-field__placeholder-title">
            {{ hasSelection ? selectionSummary : placeholderText }}
          </p>
          <p v-if="hint && !hasSelection" class="app-upload-field__placeholder-hint">
            {{ hint }}
          </p>
          <p v-else-if="hasSelection && showFileNames" class="app-upload-field__placeholder-hint">
            {{ fileNames.join(', ') }}
          </p>
          <div class="app-upload-field__placeholder-actions">
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              rounded="pill"
              :disabled="disabled"
              @click.stop="triggerUpload"
            >
              {{ buttonLabel }}
            </v-btn>
            <v-btn
              v-if="hasSelection && clearable"
              class="mt-2"
              variant="text"
              size="small"
              color="on-surface"
              @click.stop="clearSelection"
            >
              {{ clearLabel }}
            </v-btn>
          </div>
        </div>
      </Transition>
    </div>

    <Transition name="app-upload-field-fade">
      <ul
        v-if="showFileNames && hasSelection && hasPreview"
        key="file-list"
        class="app-upload-field__files"
      >
        <li v-for="(name, index) in fileNames" :key="`${name}-${index}`">
          {{ name }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: File | File[] | null
    label?: string
    hint?: string
    placeholder?: string
    actionLabel?: string
    replaceLabel?: string
    clearLabel?: string
    multiple?: boolean
    disabled?: boolean
    accept?: string
    rounded?: boolean
    icon?: string
    showFileNames?: boolean
    clearable?: boolean
  }>(),
  {
    label: undefined,
    hint: undefined,
    placeholder: 'Click to upload a file',
    actionLabel: 'Select file',
    replaceLabel: 'Replace file',
    clearLabel: 'Remove',
    multiple: false,
    disabled: false,
    accept: undefined,
    rounded: true,
    icon: 'mdi-cloud-upload',
    showFileNames: true,
    clearable: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [File | File[] | null]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const previewUrls = ref<string[]>([])

const normalizedValue = computed<File[]>(() => {
  const value = props.modelValue
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return [value]
})

const filesCount = computed(() => normalizedValue.value.length)
const hasSelection = computed(() => filesCount.value > 0)

const fileNames = computed(() =>
  normalizedValue.value
    .map((file) => (file instanceof File ? file.name : ''))
    .filter((name): name is string => Boolean(name?.length)),
)

const previewSource = computed(() => previewUrls.value[0] ?? null)
const hasPreview = computed(() => Boolean(previewSource.value))

const placeholderText = computed(() => props.placeholder)
const buttonLabel = computed(() => (hasSelection.value ? props.replaceLabel : props.actionLabel))
const selectionSummary = computed(() => {
  const count = filesCount.value
  if (!count) {
    return ''
  }

  if (count === 1) {
    return fileNames.value[0]
  }

  return `${count} files selected`
})

watch(
  normalizedValue,
  (files) => {
    previewUrls.value.forEach((url) => URL.revokeObjectURL(url))
    const previews: string[] = []

    for (const file of files) {
      if (file instanceof File && file.type.startsWith('image/')) {
        previews.push(URL.createObjectURL(file))
      }
    }

    previewUrls.value = previews
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      if (inputRef.value) {
        inputRef.value.value = ''
      }
    }
  },
)

onBeforeUnmount(() => {
  previewUrls.value.forEach((url) => URL.revokeObjectURL(url))
})

function triggerUpload() {
  if (props.disabled) {
    return
  }

  inputRef.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement | null
  const files = target?.files ? Array.from(target.files) : []

  if (props.multiple) {
    emit('update:modelValue', files)
  } else {
    emit('update:modelValue', files[0] ?? null)
  }
}

function clearSelection() {
  if (!props.clearable) {
    return
  }

  emit('update:modelValue', props.multiple ? [] : null)
  if (inputRef.value) {
    inputRef.value.value = ''
  }
}
</script>

<style scoped>
.app-upload-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-upload-field__label {
  font-weight: 600;
  font-size: 0.95rem;
}

.app-upload-field__drop {
  position: relative;
  border-radius: 1rem;
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.3);
  background: rgba(var(--v-theme-surface), 0.8);
  padding: 1.5rem;
  min-height: 220px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.app-upload-field__drop--rounded {
  border-radius: 1.5rem;
}

.app-upload-field__drop--has-preview {
  border-style: solid;
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 10px 25px rgba(var(--v-theme-primary), 0.15);
  padding: 0;
}

.app-upload-field__drop--has-selection:not(.app-upload-field__drop--has-preview) {
  border-color: rgba(var(--v-theme-primary), 0.6);
  background: rgba(var(--v-theme-primary), 0.06);
}

.app-upload-field__drop:hover {
  border-color: rgba(var(--v-theme-primary), 0.8);
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.15);
}

.app-upload-field--disabled .app-upload-field__drop,
.app-upload-field--disabled .app-upload-field__drop:hover {
  cursor: not-allowed;
  border-color: rgba(var(--v-theme-on-surface), 0.12);
  box-shadow: none;
  opacity: 0.7;
}

.app-upload-field__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}

.app-upload-field__preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.app-upload-field__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.app-upload-field__preview-count {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(var(--v-theme-surface), 0.9);
  color: rgb(var(--v-theme-on-surface));
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.app-upload-field__clear {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  box-shadow: none;
  background: rgba(var(--v-theme-surface), 0.9);
}

.app-upload-field__placeholder-icon {
  color: rgba(var(--v-theme-primary), 0.8);
  margin-bottom: 0.75rem;
}

.app-upload-field__placeholder-title {
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}

.app-upload-field__placeholder-hint {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.app-upload-field__placeholder-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1rem;
}

.app-upload-field__files {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.app-upload-field__files li {
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
}

.app-upload-field-fade-enter-active,
.app-upload-field-fade-leave-active {
  transition: opacity 0.2s ease;
}

.app-upload-field-fade-enter-from,
.app-upload-field-fade-leave-to {
  opacity: 0;
}
</style>
