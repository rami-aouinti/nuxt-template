<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'

import { useFrontendWorkplaceApi } from '~/composables/useFrontendWorkplaceApi'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { Notify } from '~/stores/notification'
import type { Workplace } from '~/types/workplace'

const props = defineProps<{
  modelValue: boolean
  workplaces?: Workplace[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const translate = useTranslateWithFallback()

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const stepperItems = [
  {
    value: 'details',
    titleKey: 'workplace.dialog.steps.details',
    titleFallback: 'World details',
  },
  {
    value: 'settings',
    titleKey: 'workplace.dialog.steps.settings',
    titleFallback: 'World settings',
  },
] as const

type StepValue = (typeof stepperItems)[number]['value']

const activeStep = ref<StepValue>(stepperItems[0].value)

const createState = reactive({
  name: '',
  isPrivate: false,
  enabled: true,
  loading: false,
  error: '',
  nameError: '',
})

const { createWorkplace } = useFrontendWorkplaceApi()

const currentStepIndex = computed(() =>
  stepperItems.findIndex((step) => step.value === activeStep.value),
)

const isFirstStep = computed(() => currentStepIndex.value <= 0)
const isLastStep = computed(
  () => currentStepIndex.value === stepperItems.length - 1,
)

function resetFormState() {
  createState.name = ''
  createState.isPrivate = false
  createState.enabled = true
  createState.loading = false
  createState.error = ''
  createState.nameError = ''
  activeStep.value = stepperItems[0].value
}

watch(
  () => dialog.value,
  (isOpen) => {
    if (!isOpen) {
      resetFormState()
    }
  },
)

watch(
  () => createState.name,
  () => {
    if (createState.nameError) {
      createState.nameError = ''
    }
  },
)

function validateName() {
  const name = createState.name.trim()

  if (!name) {
    const message = translate(
      'workplace.dialog.validation.nameRequired',
      'The world name is required.',
    )
    createState.nameError = message
    Notify.error(message)
    return false
  }

  createState.nameError = ''
  return true
}

function goToNextStep() {
  if (isLastStep.value) {
    return
  }

  if (activeStep.value === 'details' && !validateName()) {
    return
  }

  const nextStep = stepperItems[currentStepIndex.value + 1]
  if (nextStep) {
    activeStep.value = nextStep.value
  }
}

function goToPreviousStep() {
  if (isFirstStep.value) {
    return
  }

  const previousStep = stepperItems[currentStepIndex.value - 1]
  if (previousStep) {
    activeStep.value = previousStep.value
  }
}

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

async function handleCreate() {
  createState.error = ''

  if (!validateName()) {
    return
  }

  createState.loading = true
  try {
    await createWorkplace({
      name: createState.name.trim(),
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
</script>

<template>
  <AppModal
    v-model="dialog"
    icon="mdi-blogger"
    :title="translate('workplace.dialog.title', 'Manage your world')"
    max-width="520"
    persistent
  >
    <v-card-text class="pt-6">
      <v-stepper v-model="activeStep" class="workplace-dialog__stepper" flat>
        <v-stepper-header>
          <v-stepper-item
            v-for="(step, index) in stepperItems"
            :key="step.value"
            :value="step.value"
            :complete="index < currentStepIndex"
            :title="translate(step.titleKey, step.titleFallback)"
          />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item value="details">
            <div class="workplace-dialog__step-content">
              <v-text-field
                v-model="createState.name"
                :label="translate('workplace.dialog.fields.name', 'World name')"
                :disabled="createState.loading"
                variant="outlined"
                :error-messages="
                  createState.nameError ? [createState.nameError] : []
                "
                hide-details="auto"
              />
            </div>
          </v-stepper-window-item>
          <v-stepper-window-item value="settings">
            <div class="workplace-dialog__step-content">
              <v-switch
                v-model="createState.isPrivate"
                :label="
                  translate(
                    'workplace.dialog.fields.isPrivate',
                    'Private world',
                  )
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
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>
      <v-alert
        v-if="createState.error"
        class="mt-4"
        density="compact"
        type="error"
        variant="tonal"
      >
        {{ createState.error }}
      </v-alert>
    </v-card-text>
    <v-divider />
    <v-card-actions class="justify-space-between align-center flex-wrap gap-3">
      <v-btn
        variant="text"
        :disabled="createState.loading"
        @click="dialog = false"
      >
        {{ translate('common.actions.close', 'Close') }}
      </v-btn>
      <div class="workplace-dialog__actions">
        <v-btn
          variant="text"
          :disabled="createState.loading || isFirstStep"
          @click="goToPreviousStep"
        >
          {{ translate('common.actions.back', 'Back') }}
        </v-btn>
        <v-btn
          v-if="!isLastStep"
          color="primary"
          :disabled="createState.loading"
          @click="goToNextStep"
        >
          {{ translate('common.actions.continue', 'Continue') }}
        </v-btn>
        <v-btn
          v-else
          color="primary"
          :loading="createState.loading"
          @click="handleCreate"
        >
          {{ translate('workplace.dialog.actions.create', 'Create world') }}
        </v-btn>
      </div>
    </v-card-actions>
  </AppModal>
</template>

<style scoped>
.workplace-dialog {
  overflow: hidden;
}

.workplace-dialog__stepper :deep(.v-stepper-header) {
  padding-bottom: 16px;
}

.workplace-dialog__step-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
}

.workplace-dialog__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
