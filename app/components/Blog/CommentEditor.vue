<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    loading?: boolean
    disabled?: boolean
    rows?: number
    autoGrow?: boolean
    cardVariant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text'
  }>(),
  {
    modelValue: '',
    placeholder: '',
    loading: false,
    disabled: false,
    rows: 2,
    autoGrow: true,
    cardVariant: 'outlined',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
  cancel: []
}>()

const content = computed(() => props.modelValue ?? '')
const isLoading = computed(() => props.loading ?? false)
const isDisabled = computed(() => props.disabled ?? false)
const canSubmit = computed(
  () =>
    !isLoading.value && !isDisabled.value && content.value.trim().length > 0,
)

const normalizedVariant = computed(() => props.cardVariant ?? 'outlined')
const editorClasses = computed(() => [
  'blog-comment-editor',
  `blog-comment-editor--${normalizedVariant.value}`,
])

const updateContent = (value: string) => emit('update:modelValue', value)
const submit = () => {
  if (!canSubmit.value) return
  emit('submit')
}
const cancel = () => emit('cancel')

const textareaDisabled = computed(() => isLoading.value || isDisabled.value)
</script>

<template>
  <AppCard :variant="cardVariant" :class="editorClasses" elevation="0">
    <div class="blog-comment-editor__input">
      <v-textarea
        :model-value="content"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="textareaDisabled"
        hide-details
        @update:model-value="updateContent"
      />
    </div>
    <div class="blog-comment-editor__actions">
      <div class="blog-comment-editor__actions-left">
        <slot
          name="actions-left"
          :loading="isLoading"
          :disabled="textareaDisabled"
          :can-submit="canSubmit"
        />
      </div>
      <v-spacer />
      <div class="blog-comment-editor__actions-right">
        <slot
          name="actions-right"
          :loading="isLoading"
          :disabled="textareaDisabled"
          :can-submit="canSubmit"
          :submit="submit"
          :cancel="cancel"
        >
          <AppButton
            color="primary"
            variant="text"
            :loading="isLoading"
            :disabled="!canSubmit"
            icon
            @click="submit"
          >
            <v-icon>mdi-send</v-icon>
          </AppButton>
        </slot>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.blog-comment-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
}

.blog-comment-editor--outlined,
.blog-comment-editor--elevated,
.blog-comment-editor--tonal {
  background-color: rgba(var(--v-theme-surface-variant), 0.12);
}

.blog-comment-editor--flat,
.blog-comment-editor--text {
  background-color: transparent;
}

.blog-comment-editor__textarea :deep(textarea) {
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 0;
}

.blog-comment-editor__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blog-comment-editor__actions-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.blog-comment-editor__actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
