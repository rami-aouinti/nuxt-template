<template>
  <v-container class="py-10">
    <v-row class="mb-6" align="center" justify="space-between">
      <v-col cols="12" md="8">
        <div class="text-caption text-uppercase text-primary mb-1">{{ t('Courses') }}</div>
        <div class="text-h4 font-weight-bold">{{ t('Add a new course') }}</div>
        <div class="text-body-1 text-medium-emphasis">
          {{
            t(
              'Create a course with sections for Tests, Project based learning, Assessments, Courses, Dropbox, Agenda and more. Logging in as teacher provides you with editing privileges.',
            )
          }}
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end gap-2">
        <v-btn
          color="secondary"
          prepend-icon="mdi-arrow-left"
          variant="tonal"
          @click="router.back()"
        >
          {{ t('Back') }}
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus-circle"
          variant="elevated"
          @click="createForm?.submitForm && createForm.submitForm()"
        >
          {{ t('Create this course') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-alert
          border="start"
          color="primary"
          icon="mdi-information-outline"
          variant="tonal"
          class="mb-6"
        >
          {{
            t(
              'Once you click on "Create a course", a complete workspace is generated for your learners with ready-to-use tools.',
            )
          }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="pa-6" rounded="xl" elevation="4">
          <div class="d-flex align-center mb-4 gap-3">
            <v-avatar color="primary" variant="tonal">
              <v-icon icon="mdi-school-outline" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-semibold">{{ t('Course details') }}</div>
              <div class="text-body-2 text-medium-emphasis">
                {{ t('Fill in the essentials, then adjust advanced options if needed.') }}
              </div>
            </div>
          </div>

          <CourseForm
            ref="createForm"
            :errors="violations"
            :values="item"
            @submit="submitCourse"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-overlay :model-value="isLoading" class="align-center justify-center" persistent>
      <v-progress-circular color="primary" indeterminate size="64" />
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CourseForm from '../../../components/education/course/Form.vue'
import courseService from '../../../services/courseService'
import { useNotification } from '~/composables/education/notification'

const item = ref<Record<string, any>>({})
const router = useRouter()
const { t } = useI18n()

const isLoading = ref(false)
const violations = ref<Record<string, any> | null>(null)
const createForm = ref<InstanceType<typeof CourseForm> | null>(null)
const { showSuccessNotification, showErrorNotification } = useNotification()

const submitCourse = async (formData: Record<string, any>) => {
  isLoading.value = true
  violations.value = null
  try {
    const response = await courseService.createCourse(formData)
    const courseId = response.courseId
    const sessionId = 0

    if (!courseId) {
      throw new Error(
        t('Course ID is missing. Unable to navigate to the course home page.'),
      )
    }

    showSuccessNotification(t('Course created successfully.'))
    await router.push(`/course/${courseId}/home?sid=${sessionId}`)
  } catch (error: any) {
    console.error(error)

    const errorMessage =
      error?.message ||
      (error?.response?.data?.message
        ? error.response.data.message
        : t('An unexpected error occurred.'))
    showErrorNotification(errorMessage)

    if (error?.response?.data?.violations) {
      violations.value = error.response.data.violations
    }
  } finally {
    isLoading.value = false
  }
}
</script>
