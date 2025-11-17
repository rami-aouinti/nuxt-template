<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import FlagSpan from '~/components/FlagSpan.vue'
import { Notify } from '~/stores/notification'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import type {
  Experience,
  Formation,
  Hobby,
  Project,
  Reference,
  ResumeLanguage,
  Skill,
} from '~/types/resume'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'

definePageMeta({
  title: 'navigation.profileResume',
  middleware: 'auth',
})

const { t, locale } = useI18n()
const translate = useTranslateWithFallback()
const jobApi = useJobPlatformApi()

const dateFormatter = createDateFormatter(locale, { dateStyle: 'medium' })
const dateFallbackText = computed(() =>
  translate('profile.resume.labels.dateFallback', 'Date unavailable'),
)
const presentLabel = computed(() =>
  translate('profile.resume.labels.present', 'Present'),
)

function formatDateRange(start?: string | null, end?: string | null) {
  const startText = start
    ? formatDateValue(start, dateFormatter.value, '')
    : ''
  const endText = end
    ? formatDateValue(end, dateFormatter.value, '')
    : presentLabel.value

  if (!startText && !endText) {
    return dateFallbackText.value
  }

  if (!startText) {
    return endText
  }

  if (!endText) {
    return startText
  }

  return `${startText} – ${endText}`
}

function toDateInput(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10)
  }
  return date.toISOString().slice(0, 10)
}

function fromDateInput(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toISOString()
}

function resolveErrorMessage(error: unknown, fallback: string) {
  if (error instanceof FetchError) {
    const data = error.data as Record<string, unknown> | undefined
    if (data?.message && typeof data.message === 'string') {
      return data.message
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && typeof error.message === 'string') {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}

type DialogMode = 'create' | 'edit'
type ResumeSectionKey =
  | 'education'
  | 'experience'
  | 'language'
  | 'skill'
  | 'hobby'
  | 'project'
  | 'reference'

type DialogState<T> = {
  open: boolean
  mode: DialogMode
  entry: T | null
}

function createDialogState<T>(): DialogState<T> {
  return reactive({
    open: false,
    mode: 'create' as DialogMode,
    entry: null as T | null,
  })
}

const educationItems = ref<Formation[]>([])
const educationLoading = ref(false)
const educationError = ref('')
const educationDialog = createDialogState<Formation>()
const educationForm = reactive({
  name: '',
  school: '',
  gradeLevel: '',
  description: '',
  startedAt: '',
  endedAt: '',
})
const educationFormError = ref('')
const isSavingEducation = ref(false)

const experienceItems = ref<Experience[]>([])
const experienceLoading = ref(false)
const experienceError = ref('')
const experienceDialog = createDialogState<Experience>()
const experienceForm = reactive({
  title: '',
  company: '',
  description: '',
  startedAt: '',
  endedAt: '',
})
const experienceFormError = ref('')
const isSavingExperience = ref(false)

const languageItems = ref<ResumeLanguage[]>([])
const languageLoading = ref(false)
const languageError = ref('')
const languageDialog = createDialogState<ResumeLanguage>()
const languageForm = reactive({
  name: '',
  level: 3,
  flag: '',
})
const languageFormError = ref('')
const isSavingLanguage = ref(false)

const skillItems = ref<Skill[]>([])
const skillLoading = ref(false)
const skillError = ref('')
const skillDialog = createDialogState<Skill>()
const skillForm = reactive({
  name: '',
  type: '',
  level: 5,
})
const skillFormError = ref('')
const isSavingSkill = ref(false)

const hobbyItems = ref<Hobby[]>([])
const hobbyLoading = ref(false)
const hobbyError = ref('')
const hobbyDialog = createDialogState<Hobby>()
const hobbyForm = reactive({
  name: '',
  icon: '',
})
const hobbyFormError = ref('')
const isSavingHobby = ref(false)

const projectItems = ref<Project[]>([])
const projectLoading = ref(false)
const projectError = ref('')
const projectDialog = createDialogState<Project>()
const projectForm = reactive({
  name: '',
  description: '',
  gitLink: '',
})
const projectFormError = ref('')
const isSavingProject = ref(false)

const referenceItems = ref<Reference[]>([])
const referenceLoading = ref(false)
const referenceError = ref('')
const referenceDialog = createDialogState<Reference>()
const referenceForm = reactive({
  title: '',
  company: '',
  description: '',
  startedAt: '',
  endedAt: '',
})
const referenceFormError = ref('')
const isSavingReference = ref(false)

const deleteDialog = reactive({
  open: false,
  section: null as ResumeSectionKey | null,
  id: null as string | null,
  label: '',
})
const deleteError = ref('')
const isDeleting = ref(false)

function resetEducationForm() {
  educationForm.name = ''
  educationForm.school = ''
  educationForm.gradeLevel = ''
  educationForm.description = ''
  educationForm.startedAt = ''
  educationForm.endedAt = ''
  educationFormError.value = ''
  educationDialog.entry = null
  educationDialog.mode = 'create'
}

function resetExperienceForm() {
  experienceForm.title = ''
  experienceForm.company = ''
  experienceForm.description = ''
  experienceForm.startedAt = ''
  experienceForm.endedAt = ''
  experienceFormError.value = ''
  experienceDialog.entry = null
  experienceDialog.mode = 'create'
}

function resetLanguageForm() {
  languageForm.name = ''
  languageForm.level = 3
  languageForm.flag = ''
  languageFormError.value = ''
  languageDialog.entry = null
  languageDialog.mode = 'create'
}

function resetSkillForm() {
  skillForm.name = ''
  skillForm.type = ''
  skillForm.level = 5
  skillFormError.value = ''
  skillDialog.entry = null
  skillDialog.mode = 'create'
}

function resetHobbyForm() {
  hobbyForm.name = ''
  hobbyForm.icon = ''
  hobbyFormError.value = ''
  hobbyDialog.entry = null
  hobbyDialog.mode = 'create'
}

function resetProjectForm() {
  projectForm.name = ''
  projectForm.description = ''
  projectForm.gitLink = ''
  projectFormError.value = ''
  projectDialog.entry = null
  projectDialog.mode = 'create'
}

function resetReferenceForm() {
  referenceForm.title = ''
  referenceForm.company = ''
  referenceForm.description = ''
  referenceForm.startedAt = ''
  referenceForm.endedAt = ''
  referenceFormError.value = ''
  referenceDialog.entry = null
  referenceDialog.mode = 'create'
}

watch(
  () => educationDialog.open,
  (open) => {
    if (!open) {
      resetEducationForm()
    }
  },
)

watch(
  () => experienceDialog.open,
  (open) => {
    if (!open) {
      resetExperienceForm()
    }
  },
)

watch(
  () => languageDialog.open,
  (open) => {
    if (!open) {
      resetLanguageForm()
    }
  },
)

watch(
  () => skillDialog.open,
  (open) => {
    if (!open) {
      resetSkillForm()
    }
  },
)

watch(
  () => hobbyDialog.open,
  (open) => {
    if (!open) {
      resetHobbyForm()
    }
  },
)

watch(
  () => projectDialog.open,
  (open) => {
    if (!open) {
      resetProjectForm()
    }
  },
)

watch(
  () => referenceDialog.open,
  (open) => {
    if (!open) {
      resetReferenceForm()
    }
  },
)

watch(
  () => deleteDialog.open,
  (open) => {
    if (!open) {
      deleteDialog.section = null
      deleteDialog.id = null
      deleteDialog.label = ''
      deleteError.value = ''
    }
  },
)

async function loadEducation() {
  educationLoading.value = true
  educationError.value = ''
  try {
    educationItems.value = await jobApi.resume.education.list<Formation>()
  } catch (error) {
    educationError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.educationLoadFailed',
        'Unable to load your education history.',
      ),
    )
  } finally {
    educationLoading.value = false
  }
}

async function loadExperiences() {
  experienceLoading.value = true
  experienceError.value = ''
  try {
    experienceItems.value = await jobApi.resume.experience.list<Experience>()
  } catch (error) {
    experienceError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.experienceLoadFailed',
        'Unable to load your professional experience.',
      ),
    )
  } finally {
    experienceLoading.value = false
  }
}

async function loadLanguages() {
  languageLoading.value = true
  languageError.value = ''
  try {
    languageItems.value = await jobApi.resume.language.list<ResumeLanguage>()
  } catch (error) {
    languageError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.languageLoadFailed',
        'Unable to load your languages.',
      ),
    )
  } finally {
    languageLoading.value = false
  }
}
async function loadSkills() {
  skillLoading.value = true
  skillError.value = ''
  try {
    skillItems.value = await jobApi.resume.skill.list<Skill>()
  } catch (error) {
    skillError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.skillLoadFailed',
        'Unable to load your skills.',
      ),
    )
  } finally {
    skillLoading.value = false
  }
}

async function loadHobbies() {
  hobbyLoading.value = true
  hobbyError.value = ''
  try {
    hobbyItems.value = await jobApi.resume.hobby.list<Hobby>()
  } catch (error) {
    hobbyError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.hobbyLoadFailed',
        'Unable to load your hobbies.',
      ),
    )
  } finally {
    hobbyLoading.value = false
  }
}

async function loadProjects() {
  projectLoading.value = true
  projectError.value = ''
  try {
    projectItems.value = await jobApi.resume.project.list<Project>()
  } catch (error) {
    projectError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.projectLoadFailed',
        'Unable to load your projects.',
      ),
    )
  } finally {
    projectLoading.value = false
  }
}

async function loadReferences() {
  referenceLoading.value = true
  referenceError.value = ''
  try {
    referenceItems.value = await jobApi.resume.reference.list<Reference>()
  } catch (error) {
    referenceError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.referenceLoadFailed',
        'Unable to load your references.',
      ),
    )
  } finally {
    referenceLoading.value = false
  }
}

function openEducationDialog(entry?: Formation | null) {
  if (entry) {
    educationDialog.mode = 'edit'
    educationDialog.entry = entry
    educationForm.name = entry.name
    educationForm.school = entry.school
    educationForm.gradeLevel = entry.gradeLevel?.toString() ?? ''
    educationForm.description = entry.description
    educationForm.startedAt = toDateInput(entry.startedAt)
    educationForm.endedAt = toDateInput(entry.endedAt ?? null)
  }
  educationDialog.open = true
}

function openExperienceDialog(entry?: Experience | null) {
  if (entry) {
    experienceDialog.mode = 'edit'
    experienceDialog.entry = entry
    experienceForm.title = entry.title
    experienceForm.company = entry.company
    experienceForm.description = entry.description
    experienceForm.startedAt = toDateInput(entry.startedAt)
    experienceForm.endedAt = toDateInput(entry.endedAt ?? null)
  }
  experienceDialog.open = true
}

function openLanguageDialog(entry?: ResumeLanguage | null) {
  if (entry) {
    languageDialog.mode = 'edit'
    languageDialog.entry = entry
    languageForm.name = entry.name
    languageForm.level = entry.level
    languageForm.flag = entry.flag
  }
  languageDialog.open = true
}

function openSkillDialog(entry?: Skill | null) {
  if (entry) {
    skillDialog.mode = 'edit'
    skillDialog.entry = entry
    skillForm.name = entry.name
    skillForm.type = entry.type
    skillForm.level = entry.level
  }
  skillDialog.open = true
}

function openHobbyDialog(entry?: Hobby | null) {
  if (entry) {
    hobbyDialog.mode = 'edit'
    hobbyDialog.entry = entry
    hobbyForm.name = entry.name
    hobbyForm.icon = entry.icon
  }
  hobbyDialog.open = true
}

function openProjectDialog(entry?: Project | null) {
  if (entry) {
    projectDialog.mode = 'edit'
    projectDialog.entry = entry
    projectForm.name = entry.name
    projectForm.description = entry.description
    projectForm.gitLink = entry.gitLink ?? ''
  }
  projectDialog.open = true
}

function openReferenceDialog(entry?: Reference | null) {
  if (entry) {
    referenceDialog.mode = 'edit'
    referenceDialog.entry = entry
    referenceForm.title = entry.title
    referenceForm.company = entry.company
    referenceForm.description = entry.description
    referenceForm.startedAt = toDateInput(entry.startedAt)
    referenceForm.endedAt = toDateInput(entry.endedAt ?? null)
  }
  referenceDialog.open = true
}

function upsertItem<T extends { id: string }>(items: T[], entry: T) {
  const index = items.findIndex((item) => item.id === entry.id)
  if (index !== -1) {
    items.splice(index, 1, entry)
  } else {
    items.unshift(entry)
  }
}

async function submitEducationForm() {
  educationFormError.value = ''
  isSavingEducation.value = true
  const gradeLevelValue = Number(educationForm.gradeLevel)
  const payload = {
    name: educationForm.name,
    school: educationForm.school,
    gradeLevel:
      educationForm.gradeLevel.trim().length > 0 &&
      !Number.isNaN(gradeLevelValue)
        ? gradeLevelValue
        : null,
    description: educationForm.description,
    startedAt: fromDateInput(educationForm.startedAt),
    endedAt: fromDateInput(educationForm.endedAt),
  }
  try {
    if (educationDialog.mode === 'edit' && educationDialog.entry) {
      const updated = await jobApi.resume.education.update<Formation>(
        educationDialog.entry.id,
        payload,
      )
      upsertItem(educationItems.value, updated)
    } else {
      const created = await jobApi.resume.education.create<Formation>(payload)
      educationItems.value.unshift(created)
    }
    Notify.success(
      translate(
        'profile.resume.notifications.educationSaved',
        'Education entry saved successfully.',
      ),
    )
    educationDialog.open = false
  } catch (error) {
    educationFormError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.educationSaveFailed',
        'Unable to save this education entry.',
      ),
    )
  } finally {
    isSavingEducation.value = false
  }
}

async function submitExperienceForm() {
  experienceFormError.value = ''
  isSavingExperience.value = true
  const payload = {
    title: experienceForm.title,
    company: experienceForm.company,
    description: experienceForm.description,
    startedAt: fromDateInput(experienceForm.startedAt),
    endedAt: fromDateInput(experienceForm.endedAt),
  }
  try {
    if (experienceDialog.mode === 'edit' && experienceDialog.entry) {
      const updated = await jobApi.resume.experience.update<Experience>(
        experienceDialog.entry.id,
        payload,
      )
      upsertItem(experienceItems.value, updated)
    } else {
      const created = await jobApi.resume.experience.create<Experience>(payload)
      experienceItems.value.unshift(created)
    }
    Notify.success(
      translate(
        'profile.resume.notifications.experienceSaved',
        'Experience saved successfully.',
      ),
    )
    experienceDialog.open = false
  } catch (error) {
    experienceFormError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.experienceSaveFailed',
        'Unable to save this experience.',
      ),
    )
  } finally {
    isSavingExperience.value = false
  }
}

async function submitLanguageForm() {
  languageFormError.value = ''
  isSavingLanguage.value = true
  const payload = {
    name: languageForm.name,
    level: languageForm.level,
    flag: languageForm.flag,
  }
  try {
    if (languageDialog.mode === 'edit' && languageDialog.entry) {
      const updated = await jobApi.resume.language.update<ResumeLanguage>(
        languageDialog.entry.id,
        payload,
      )
      upsertItem(languageItems.value, updated)
    } else {
      const created = await jobApi.resume.language.create<ResumeLanguage>(
        payload,
      )
      languageItems.value.unshift(created)
    }
    Notify.success(
      translate(
        'profile.resume.notifications.languageSaved',
        'Language saved successfully.',
      ),
    )
    languageDialog.open = false
  } catch (error) {
    languageFormError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.languageSaveFailed',
        'Unable to save this language.',
      ),
    )
  } finally {
    isSavingLanguage.value = false
  }
}
async function submitSkillForm() {
  skillFormError.value = ''
  isSavingSkill.value = true
  const payload = {
    name: skillForm.name,
    type: skillForm.type,
    level: skillForm.level,
  }
  try {
    if (skillDialog.mode === 'edit' && skillDialog.entry) {
      const updated = await jobApi.resume.skill.update<Skill>(
        skillDialog.entry.id,
        payload,
      )
      upsertItem(skillItems.value, updated)
    } else {
      const created = await jobApi.resume.skill.create<Skill>(payload)
      skillItems.value.unshift(created)
    }
    Notify.success(
      translate(
        'profile.resume.notifications.skillSaved',
        'Skill saved successfully.',
      ),
    )
    skillDialog.open = false
  } catch (error) {
    skillFormError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.skillSaveFailed',
        'Unable to save this skill.',
      ),
    )
  } finally {
    isSavingSkill.value = false
  }
}

async function submitHobbyForm() {
  hobbyFormError.value = ''
  isSavingHobby.value = true
  const payload = {
    name: hobbyForm.name,
    icon: hobbyForm.icon,
  }
  try {
    if (hobbyDialog.mode === 'edit' && hobbyDialog.entry) {
      const updated = await jobApi.resume.hobby.update<Hobby>(
        hobbyDialog.entry.id,
        payload,
      )
      upsertItem(hobbyItems.value, updated)
    } else {
      const created = await jobApi.resume.hobby.create<Hobby>(payload)
      hobbyItems.value.unshift(created)
    }
    Notify.success(
      translate(
        'profile.resume.notifications.hobbySaved',
        'Hobby saved successfully.',
      ),
    )
    hobbyDialog.open = false
  } catch (error) {
    hobbyFormError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.hobbySaveFailed',
        'Unable to save this hobby.',
      ),
    )
  } finally {
    isSavingHobby.value = false
  }
}

async function submitProjectForm() {
  projectFormError.value = ''
  isSavingProject.value = true
  const payload = {
    name: projectForm.name,
    description: projectForm.description,
    gitLink: projectForm.gitLink || null,
  }
  try {
    if (projectDialog.mode === 'edit' && projectDialog.entry) {
      const updated = await jobApi.resume.project.update<Project>(
        projectDialog.entry.id,
        payload,
      )
      upsertItem(projectItems.value, updated)
    } else {
      const created = await jobApi.resume.project.create<Project>(payload)
      projectItems.value.unshift(created)
    }
    Notify.success(
      translate(
        'profile.resume.notifications.projectSaved',
        'Project saved successfully.',
      ),
    )
    projectDialog.open = false
  } catch (error) {
    projectFormError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.projectSaveFailed',
        'Unable to save this project.',
      ),
    )
  } finally {
    isSavingProject.value = false
  }
}

async function submitReferenceForm() {
  referenceFormError.value = ''
  isSavingReference.value = true
  const payload = {
    title: referenceForm.title,
    company: referenceForm.company,
    description: referenceForm.description,
    startedAt: fromDateInput(referenceForm.startedAt),
    endedAt: fromDateInput(referenceForm.endedAt),
  }
  try {
    if (referenceDialog.mode === 'edit' && referenceDialog.entry) {
      const updated = await jobApi.resume.reference.update<Reference>(
        referenceDialog.entry.id,
        payload,
      )
      upsertItem(referenceItems.value, updated)
    } else {
      const created = await jobApi.resume.reference.create<Reference>(payload)
      referenceItems.value.unshift(created)
    }
    Notify.success(
      translate(
        'profile.resume.notifications.referenceSaved',
        'Reference saved successfully.',
      ),
    )
    referenceDialog.open = false
  } catch (error) {
    referenceFormError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.referenceSaveFailed',
        'Unable to save this reference.',
      ),
    )
  } finally {
    isSavingReference.value = false
  }
}

async function deleteEducation(id: string) {
  await jobApi.resume.education.delete(id)
  educationItems.value = educationItems.value.filter((item) => item.id !== id)
  Notify.success(
    translate(
      'profile.resume.notifications.educationDeleted',
      'Education entry deleted.',
    ),
  )
}

async function deleteExperience(id: string) {
  await jobApi.resume.experience.delete(id)
  experienceItems.value = experienceItems.value.filter((item) => item.id !== id)
  Notify.success(
    translate(
      'profile.resume.notifications.experienceDeleted',
      'Experience deleted.',
    ),
  )
}

async function deleteLanguage(id: string) {
  await jobApi.resume.language.delete(id)
  languageItems.value = languageItems.value.filter((item) => item.id !== id)
  Notify.success(
    translate(
      'profile.resume.notifications.languageDeleted',
      'Language deleted.',
    ),
  )
}

async function deleteSkill(id: string) {
  await jobApi.resume.skill.delete(id)
  skillItems.value = skillItems.value.filter((item) => item.id !== id)
  Notify.success(
    translate(
      'profile.resume.notifications.skillDeleted',
      'Skill deleted.',
    ),
  )
}

async function deleteHobby(id: string) {
  await jobApi.resume.hobby.delete(id)
  hobbyItems.value = hobbyItems.value.filter((item) => item.id !== id)
  Notify.success(
    translate(
      'profile.resume.notifications.hobbyDeleted',
      'Hobby deleted.',
    ),
  )
}

async function deleteProject(id: string) {
  await jobApi.resume.project.delete(id)
  projectItems.value = projectItems.value.filter((item) => item.id !== id)
  Notify.success(
    translate(
      'profile.resume.notifications.projectDeleted',
      'Project deleted.',
    ),
  )
}

async function deleteReference(id: string) {
  await jobApi.resume.reference.delete(id)
  referenceItems.value = referenceItems.value.filter((item) => item.id !== id)
  Notify.success(
    translate(
      'profile.resume.notifications.referenceDeleted',
      'Reference deleted.',
    ),
  )
}

function requestDelete(section: ResumeSectionKey, id: string, label: string) {
  deleteDialog.section = section
  deleteDialog.id = id
  deleteDialog.label = label
  deleteDialog.open = true
}

async function confirmDelete() {
  if (!deleteDialog.section || !deleteDialog.id) {
    return
  }
  deleteError.value = ''
  isDeleting.value = true
  try {
    switch (deleteDialog.section) {
      case 'education':
        await deleteEducation(deleteDialog.id)
        break
      case 'experience':
        await deleteExperience(deleteDialog.id)
        break
      case 'language':
        await deleteLanguage(deleteDialog.id)
        break
      case 'skill':
        await deleteSkill(deleteDialog.id)
        break
      case 'hobby':
        await deleteHobby(deleteDialog.id)
        break
      case 'project':
        await deleteProject(deleteDialog.id)
        break
      case 'reference':
        await deleteReference(deleteDialog.id)
        break
      default:
        break
    }
    deleteDialog.open = false
  } catch (error) {
    deleteError.value = resolveErrorMessage(
      error,
      translate(
        'profile.resume.notifications.deleteFailed',
        'Unable to delete this entry.',
      ),
    )
  } finally {
    isDeleting.value = false
  }
}

const deleteDialogTitle = computed(() => {
  if (!deleteDialog.section) {
    return ''
  }
  const fallbacks: Record<ResumeSectionKey, string> = {
    education: 'Delete education entry',
    experience: 'Delete experience',
    language: 'Delete language',
    skill: 'Delete skill',
    hobby: 'Delete hobby',
    project: 'Delete project',
    reference: 'Delete reference',
  }
  return translate(
    `profile.resume.dialogs.delete.${deleteDialog.section}`,
    fallbacks[deleteDialog.section],
  )
})

const deleteDialogDescription = computed(() =>
  translate(
    'profile.resume.dialogs.delete.description',
    'This action cannot be undone.',
  ),
)

await Promise.all([
  loadEducation(),
  loadExperiences(),
  loadLanguages(),
  loadSkills(),
  loadHobbies(),
  loadProjects(),
  loadReferences(),
])
</script>
<template>
  <ProfilePageShell>
    <v-row>
      <v-col cols="12">
        <AppCard
          class="profile-resume__intro mb-6"
          :title="translate('profile.resume.page.title', 'Resume builder')"
          :subtitle="
            translate(
              'profile.resume.page.subtitle',
              'Curate every part of your story from a single workspace.',
            )
          "
        >
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{
              translate(
                'profile.resume.page.description',
                'Collect your studies, experience, skills, and passions to generate beautiful resumes for recruiters.',
              )
            }}
          </p>
        </AppCard>
      </v-col>
    </v-row>

    <v-row class="profile-resume__grid" dense>
      <v-col cols="12" lg="6">
        <AppCard class="profile-resume__section">
          <template #title>
            <div class="profile-resume__section-header">
              <div>
                <p class="text-h6 mb-1">
                  {{
                    translate(
                      'profile.resume.sections.education.title',
                      'Education',
                    )
                  }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{
                    translate(
                      'profile.resume.sections.education.description',
                      'Showcase degrees, bootcamps, and formative training.',
                    )
                  }}
                </p>
              </div>
              <AppButton
                size="small"
                color="primary"
                variant="text"
                @click="openEducationDialog()"
              >
                {{
                  translate(
                    'profile.resume.sections.education.add',
                    'Add education',
                  )
                }}
              </AppButton>
            </div>
          </template>

          <div class="profile-resume__section-body">
            <div v-if="educationLoading" class="profile-resume__loading">
              <v-progress-circular color="primary" indeterminate />
            </div>

            <v-alert
              v-else-if="educationError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center justify-space-between gap-4">
                <span>{{ educationError }}</span>
                <AppButton
                  size="small"
                  variant="text"
                  color="primary"
                  @click="loadEducation"
                >
                  {{ translate('profile.resume.actions.retry', 'Retry') }}
                </AppButton>
              </div>
            </v-alert>

            <div v-else>
              <p
                v-if="educationItems.length === 0"
                class="text-body-2 text-medium-emphasis mb-0"
              >
                {{
                  translate(
                    'profile.resume.sections.education.empty',
                    'You have not added any education yet.',
                  )
                }}
              </p>

              <div v-else class="profile-resume__entries">
                <div
                  v-for="education in educationItems"
                  :key="education.id"
                  class="profile-resume__entry"
                >
                  <div class="profile-resume__entry-header">
                    <div>
                      <p class="text-subtitle-1 mb-1">{{ education.name }}</p>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ education.school }} ·
                        {{ formatDateRange(education.startedAt, education.endedAt) }}
                      </p>
                      <p
                        v-if="education.gradeLevel != null"
                        class="text-caption text-medium-emphasis mb-0"
                      >
                        {{
                          translate(
                            'profile.resume.labels.gradeLevel',
                            'Grade level: {level}',
                          ).replace('{level}', String(education.gradeLevel))
                        }}
                      </p>
                    </div>
                    <div class="profile-resume__entry-actions">
                      <v-btn
                        variant="text"
                        icon="mdi-pencil"
                        size="small"
                        @click="openEducationDialog(education)"
                      />
                      <v-btn
                        variant="text"
                        color="error"
                        icon="mdi-delete-outline"
                        size="small"
                        @click="
                          requestDelete(
                            'education',
                            education.id,
                            education.name,
                          )
                        "
                      />
                    </div>
                  </div>
                  <p class="text-body-2 mb-0">
                    {{
                      education.description ||
                        translate(
                          'profile.resume.labels.noDescription',
                          'No description provided yet.',
                        )
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" lg="6">
        <AppCard class="profile-resume__section">
          <template #title>
            <div class="profile-resume__section-header">
              <div>
                <p class="text-h6 mb-1">
                  {{
                    translate(
                      'profile.resume.sections.experience.title',
                      'Experience',
                    )
                  }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{
                    translate(
                      'profile.resume.sections.experience.description',
                      'Document your work history and impact.',
                    )
                  }}
                </p>
              </div>
              <AppButton
                size="small"
                color="primary"
                variant="text"
                @click="openExperienceDialog()"
              >
                {{
                  translate(
                    'profile.resume.sections.experience.add',
                    'Add experience',
                  )
                }}
              </AppButton>
            </div>
          </template>

          <div class="profile-resume__section-body">
            <div v-if="experienceLoading" class="profile-resume__loading">
              <v-progress-circular color="primary" indeterminate />
            </div>

            <v-alert
              v-else-if="experienceError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center justify-space-between gap-4">
                <span>{{ experienceError }}</span>
                <AppButton
                  size="small"
                  variant="text"
                  color="primary"
                  @click="loadExperiences"
                >
                  {{ translate('profile.resume.actions.retry', 'Retry') }}
                </AppButton>
              </div>
            </v-alert>

            <div v-else>
              <p
                v-if="experienceItems.length === 0"
                class="text-body-2 text-medium-emphasis mb-0"
              >
                {{
                  translate(
                    'profile.resume.sections.experience.empty',
                    'Add your first job to get started.',
                  )
                }}
              </p>

              <div v-else class="profile-resume__entries">
                <div
                  v-for="experience in experienceItems"
                  :key="experience.id"
                  class="profile-resume__entry"
                >
                  <div class="profile-resume__entry-header">
                    <div>
                      <p class="text-subtitle-1 mb-1">{{ experience.title }}</p>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ experience.company }} ·
                        {{ formatDateRange(experience.startedAt, experience.endedAt) }}
                      </p>
                    </div>
                    <div class="profile-resume__entry-actions">
                      <v-btn
                        variant="text"
                        icon="mdi-pencil"
                        size="small"
                        @click="openExperienceDialog(experience)"
                      />
                      <v-btn
                        variant="text"
                        color="error"
                        icon="mdi-delete-outline"
                        size="small"
                        @click="
                          requestDelete(
                            'experience',
                            experience.id,
                            experience.title,
                          )
                        "
                      />
                    </div>
                  </div>
                  <p class="text-body-2 mb-0">
                    {{
                      experience.description ||
                        translate(
                          'profile.resume.labels.noDescription',
                          'No description provided yet.',
                        )
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" lg="6">
        <AppCard class="profile-resume__section">
          <template #title>
            <div class="profile-resume__section-header">
              <div>
                <p class="text-h6 mb-1">
                  {{
                    translate(
                      'profile.resume.sections.languages.title',
                      'Languages',
                    )
                  }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{
                    translate(
                      'profile.resume.sections.languages.description',
                      'Highlight how you collaborate around the world.',
                    )
                  }}
                </p>
              </div>
              <AppButton
                size="small"
                color="primary"
                variant="text"
                @click="openLanguageDialog()"
              >
                {{
                  translate(
                    'profile.resume.sections.languages.add',
                    'Add language',
                  )
                }}
              </AppButton>
            </div>
          </template>

          <div class="profile-resume__section-body">
            <div v-if="languageLoading" class="profile-resume__loading">
              <v-progress-circular color="primary" indeterminate />
            </div>

            <v-alert
              v-else-if="languageError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center justify-space-between gap-4">
                <span>{{ languageError }}</span>
                <AppButton
                  size="small"
                  variant="text"
                  color="primary"
                  @click="loadLanguages"
                >
                  {{ translate('profile.resume.actions.retry', 'Retry') }}
                </AppButton>
              </div>
            </v-alert>

            <div v-else>
              <p
                v-if="languageItems.length === 0"
                class="text-body-2 text-medium-emphasis mb-0"
              >
                {{
                  translate(
                    'profile.resume.sections.languages.empty',
                    'List the languages you master.',
                  )
                }}
              </p>

              <div v-else class="profile-resume__chip-list">
                <v-chip
                  v-for="language in languageItems"
                  :key="language.id"
                  class="profile-resume__chip"
                  variant="outlined"
                  rounded="lg"
                >
                  <div class="profile-resume__chip-content">
                    <FlagSpan
                      :code="language.flag"
                      class="mr-2"
                      size="1.5rem"
                    />
                    <div>
                      <p class="text-body-1 mb-0">{{ language.name }}</p>
                      <p class="text-caption text-medium-emphasis mb-0">
                        {{
                          translate(
                            'profile.resume.labels.languageLevel',
                            'Level: {level}',
                          ).replace('{level}', String(language.level))
                        }}
                      </p>
                    </div>
                  </div>
                  <template #append>
                    <div class="profile-resume__chip-actions">
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        size="small"
                        @click="openLanguageDialog(language)"
                      />
                      <v-btn
                        icon="mdi-delete-outline"
                        variant="text"
                        color="error"
                        size="small"
                        @click="
                          requestDelete('language', language.id, language.name)
                        "
                      />
                    </div>
                  </template>
                </v-chip>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>
      <v-col cols="12" lg="6">
        <AppCard class="profile-resume__section">
          <template #title>
            <div class="profile-resume__section-header">
              <div>
                <p class="text-h6 mb-1">
                  {{
                    translate(
                      'profile.resume.sections.skills.title',
                      'Skills',
                    )
                  }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{
                    translate(
                      'profile.resume.sections.skills.description',
                      'Capture your strongest tools and methods.',
                    )
                  }}
                </p>
              </div>
              <AppButton
                size="small"
                color="primary"
                variant="text"
                @click="openSkillDialog()"
              >
                {{
                  translate(
                    'profile.resume.sections.skills.add',
                    'Add skill',
                  )
                }}
              </AppButton>
            </div>
          </template>

          <div class="profile-resume__section-body">
            <div v-if="skillLoading" class="profile-resume__loading">
              <v-progress-circular color="primary" indeterminate />
            </div>

            <v-alert
              v-else-if="skillError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center justify-space-between gap-4">
                <span>{{ skillError }}</span>
                <AppButton
                  size="small"
                  variant="text"
                  color="primary"
                  @click="loadSkills"
                >
                  {{ translate('profile.resume.actions.retry', 'Retry') }}
                </AppButton>
              </div>
            </v-alert>

            <div v-else>
              <p
                v-if="skillItems.length === 0"
                class="text-body-2 text-medium-emphasis mb-0"
              >
                {{
                  translate(
                    'profile.resume.sections.skills.empty',
                    'Showcase what you bring to each role.',
                  )
                }}
              </p>

              <div v-else class="profile-resume__entries">
                <div
                  v-for="skill in skillItems"
                  :key="skill.id"
                  class="profile-resume__entry profile-resume__entry--dense"
                >
                  <div>
                    <p class="text-subtitle-2 mb-0">{{ skill.name }}</p>
                    <p class="text-caption text-medium-emphasis mb-1">
                      {{ skill.type }}
                    </p>
                    <v-progress-linear
                      :model-value="(skill.level / 10) * 100"
                      height="6"
                      color="primary"
                      rounded
                    />
                  </div>
                  <div class="profile-resume__entry-actions">
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      size="small"
                      @click="openSkillDialog(skill)"
                    />
                    <v-btn
                      icon="mdi-delete-outline"
                      variant="text"
                      color="error"
                      size="small"
                      @click="requestDelete('skill', skill.id, skill.name)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" lg="6">
        <AppCard class="profile-resume__section">
          <template #title>
            <div class="profile-resume__section-header">
              <div>
                <p class="text-h6 mb-1">
                  {{
                    translate(
                      'profile.resume.sections.hobbies.title',
                      'Hobbies',
                    )
                  }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{
                    translate(
                      'profile.resume.sections.hobbies.description',
                      'Share what energizes you outside work.',
                    )
                  }}
                </p>
              </div>
              <AppButton
                size="small"
                color="primary"
                variant="text"
                @click="openHobbyDialog()"
              >
                {{
                  translate(
                    'profile.resume.sections.hobbies.add',
                    'Add hobby',
                  )
                }}
              </AppButton>
            </div>
          </template>

          <div class="profile-resume__section-body">
            <div v-if="hobbyLoading" class="profile-resume__loading">
              <v-progress-circular color="primary" indeterminate />
            </div>

            <v-alert
              v-else-if="hobbyError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center justify-space-between gap-4">
                <span>{{ hobbyError }}</span>
                <AppButton
                  size="small"
                  variant="text"
                  color="primary"
                  @click="loadHobbies"
                >
                  {{ translate('profile.resume.actions.retry', 'Retry') }}
                </AppButton>
              </div>
            </v-alert>

            <div v-else>
              <p
                v-if="hobbyItems.length === 0"
                class="text-body-2 text-medium-emphasis mb-0"
              >
                {{
                  translate(
                    'profile.resume.sections.hobbies.empty',
                    'Let recruiters know what motivates you.',
                  )
                }}
              </p>

              <div v-else class="profile-resume__chip-list">
                <v-chip
                  v-for="hobby in hobbyItems"
                  :key="hobby.id"
                  class="profile-resume__chip"
                  rounded="lg"
                  variant="outlined"
                >
                  <v-icon :icon="hobby.icon" class="mr-2" />
                  <span>{{ hobby.name }}</span>
                  <template #append>
                    <div class="profile-resume__chip-actions">
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        size="small"
                        @click="openHobbyDialog(hobby)"
                      />
                      <v-btn
                        icon="mdi-delete-outline"
                        variant="text"
                        color="error"
                        size="small"
                        @click="requestDelete('hobby', hobby.id, hobby.name)"
                      />
                    </div>
                  </template>
                </v-chip>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" lg="6">
        <AppCard class="profile-resume__section">
          <template #title>
            <div class="profile-resume__section-header">
              <div>
                <p class="text-h6 mb-1">
                  {{
                    translate(
                      'profile.resume.sections.projects.title',
                      'Projects',
                    )
                  }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{
                    translate(
                      'profile.resume.sections.projects.description',
                      'Celebrate the products and initiatives you delivered.',
                    )
                  }}
                </p>
              </div>
              <AppButton
                size="small"
                color="primary"
                variant="text"
                @click="openProjectDialog()"
              >
                {{
                  translate(
                    'profile.resume.sections.projects.add',
                    'Add project',
                  )
                }}
              </AppButton>
            </div>
          </template>

          <div class="profile-resume__section-body">
            <div v-if="projectLoading" class="profile-resume__loading">
              <v-progress-circular color="primary" indeterminate />
            </div>

            <v-alert
              v-else-if="projectError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center justify-space-between gap-4">
                <span>{{ projectError }}</span>
                <AppButton
                  size="small"
                  variant="text"
                  color="primary"
                  @click="loadProjects"
                >
                  {{ translate('profile.resume.actions.retry', 'Retry') }}
                </AppButton>
              </div>
            </v-alert>

            <div v-else>
              <p
                v-if="projectItems.length === 0"
                class="text-body-2 text-medium-emphasis mb-0"
              >
                {{
                  translate(
                    'profile.resume.sections.projects.empty',
                    'Show the projects you are most proud of.',
                  )
                }}
              </p>

              <div v-else class="profile-resume__entries">
                <div
                  v-for="project in projectItems"
                  :key="project.id"
                  class="profile-resume__entry"
                >
                  <div class="profile-resume__entry-header">
                    <div>
                      <p class="text-subtitle-1 mb-1">{{ project.name }}</p>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{
                          project.gitLink ||
                            translate(
                              'profile.resume.labels.noLink',
                              'No repository shared',
                            )
                        }}
                      </p>
                    </div>
                    <div class="profile-resume__entry-actions">
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        size="small"
                        @click="openProjectDialog(project)"
                      />
                      <v-btn
                        icon="mdi-delete-outline"
                        variant="text"
                        color="error"
                        size="small"
                        @click="
                          requestDelete('project', project.id, project.name)
                        "
                      />
                    </div>
                  </div>
                  <p class="text-body-2 mb-0">
                    {{
                      project.description ||
                        translate(
                          'profile.resume.labels.noDescription',
                          'No description provided yet.',
                        )
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" lg="6">
        <AppCard class="profile-resume__section">
          <template #title>
            <div class="profile-resume__section-header">
              <div>
                <p class="text-h6 mb-1">
                  {{
                    translate(
                      'profile.resume.sections.references.title',
                      'References',
                    )
                  }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{
                    translate(
                      'profile.resume.sections.references.description',
                      'Invite teams to contact trusted partners.',
                    )
                  }}
                </p>
              </div>
              <AppButton
                size="small"
                color="primary"
                variant="text"
                @click="openReferenceDialog()"
              >
                {{
                  translate(
                    'profile.resume.sections.references.add',
                    'Add reference',
                  )
                }}
              </AppButton>
            </div>
          </template>

          <div class="profile-resume__section-body">
            <div v-if="referenceLoading" class="profile-resume__loading">
              <v-progress-circular color="primary" indeterminate />
            </div>

            <v-alert
              v-else-if="referenceError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center justify-space-between gap-4">
                <span>{{ referenceError }}</span>
                <AppButton
                  size="small"
                  variant="text"
                  color="primary"
                  @click="loadReferences"
                >
                  {{ translate('profile.resume.actions.retry', 'Retry') }}
                </AppButton>
              </div>
            </v-alert>

            <div v-else>
              <p
                v-if="referenceItems.length === 0"
                class="text-body-2 text-medium-emphasis mb-0"
              >
                {{
                  translate(
                    'profile.resume.sections.references.empty',
                    'Collect recommendations from peers and clients.',
                  )
                }}
              </p>

              <div v-else class="profile-resume__entries">
                <div
                  v-for="reference in referenceItems"
                  :key="reference.id"
                  class="profile-resume__entry"
                >
                  <div class="profile-resume__entry-header">
                    <div>
                      <p class="text-subtitle-1 mb-1">{{ reference.title }}</p>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ reference.company }} ·
                        {{ formatDateRange(reference.startedAt, reference.endedAt) }}
                      </p>
                    </div>
                    <div class="profile-resume__entry-actions">
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        size="small"
                        @click="openReferenceDialog(reference)"
                      />
                      <v-btn
                        icon="mdi-delete-outline"
                        variant="text"
                        color="error"
                        size="small"
                        @click="
                          requestDelete('reference', reference.id, reference.title)
                        "
                      />
                    </div>
                  </div>
                  <p class="text-body-2 mb-0">
                    {{
                      reference.description ||
                        translate(
                          'profile.resume.labels.noDescription',
                          'No description provided yet.',
                        )
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>
    </v-row>
    <v-dialog v-model="educationDialog.open" max-width="640">
      <v-card>
        <v-card-title>
          {{
            educationDialog.mode === 'edit'
              ? translate(
                  'profile.resume.dialogs.education.edit',
                  'Edit education',
                )
              : translate(
                  'profile.resume.dialogs.education.create',
                  'Add education',
                )
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="educationFormError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ educationFormError }}
          </v-alert>
          <v-form @submit.prevent="submitEducationForm">
            <v-text-field
              v-model="educationForm.name"
              :label="translate('profile.resume.fields.name', 'Name')"
              variant="outlined"
              class="mb-4"
              required
            />
            <v-text-field
              v-model="educationForm.school"
              :label="translate('profile.resume.fields.school', 'School')"
              variant="outlined"
              class="mb-4"
            />
            <v-text-field
              v-model="educationForm.gradeLevel"
              :label="
                translate('profile.resume.fields.gradeLevel', 'Grade level')
              "
              variant="outlined"
              class="mb-4"
              type="number"
              min="1"
              max="8"
            />
            <v-textarea
              v-model="educationForm.description"
              :label="
                translate('profile.resume.fields.description', 'Description')
              "
              variant="outlined"
              rows="3"
              class="mb-4"
              auto-grow
            />
            <v-text-field
              v-model="educationForm.startedAt"
              :label="translate('profile.resume.fields.startedAt', 'Start date')"
              type="date"
              variant="outlined"
              class="mb-4"
            />
            <v-text-field
              v-model="educationForm.endedAt"
              :label="translate('profile.resume.fields.endedAt', 'End date')"
              type="date"
              variant="outlined"
              class="mb-6"
            />
            <div class="profile-resume__dialog-actions">
              <AppButton
                variant="text"
                :disabled="isSavingEducation"
                @click="educationDialog.open = false"
              >
                {{ t('common.actions.cancel') }}
              </AppButton>
              <AppButton
                type="submit"
                color="primary"
                :loading="isSavingEducation"
              >
                {{
                  educationDialog.mode === 'edit'
                    ? t('common.actions.save')
                    : t('common.actions.create')
                }}
              </AppButton>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="experienceDialog.open" max-width="640">
      <v-card>
        <v-card-title>
          {{
            experienceDialog.mode === 'edit'
              ? translate(
                  'profile.resume.dialogs.experience.edit',
                  'Edit experience',
                )
              : translate(
                  'profile.resume.dialogs.experience.create',
                  'Add experience',
                )
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="experienceFormError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ experienceFormError }}
          </v-alert>
          <v-form @submit.prevent="submitExperienceForm">
            <v-text-field
              v-model="experienceForm.title"
              :label="translate('profile.resume.fields.title', 'Title')"
              variant="outlined"
              class="mb-4"
              required
            />
            <v-text-field
              v-model="experienceForm.company"
              :label="translate('profile.resume.fields.company', 'Company')"
              variant="outlined"
              class="mb-4"
            />
            <v-textarea
              v-model="experienceForm.description"
              :label="
                translate('profile.resume.fields.description', 'Description')
              "
              variant="outlined"
              rows="3"
              class="mb-4"
              auto-grow
            />
            <v-text-field
              v-model="experienceForm.startedAt"
              :label="translate('profile.resume.fields.startedAt', 'Start date')"
              type="date"
              variant="outlined"
              class="mb-4"
            />
            <v-text-field
              v-model="experienceForm.endedAt"
              :label="translate('profile.resume.fields.endedAt', 'End date')"
              type="date"
              variant="outlined"
              class="mb-6"
            />
            <div class="profile-resume__dialog-actions">
              <AppButton
                variant="text"
                :disabled="isSavingExperience"
                @click="experienceDialog.open = false"
              >
                {{ t('common.actions.cancel') }}
              </AppButton>
              <AppButton
                type="submit"
                color="primary"
                :loading="isSavingExperience"
              >
                {{
                  experienceDialog.mode === 'edit'
                    ? t('common.actions.save')
                    : t('common.actions.create')
                }}
              </AppButton>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="languageDialog.open" max-width="520">
      <v-card>
        <v-card-title>
          {{
            languageDialog.mode === 'edit'
              ? translate(
                  'profile.resume.dialogs.languages.edit',
                  'Edit language',
                )
              : translate(
                  'profile.resume.dialogs.languages.create',
                  'Add language',
                )
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="languageFormError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ languageFormError }}
          </v-alert>
          <v-form @submit.prevent="submitLanguageForm">
            <v-text-field
              v-model="languageForm.name"
              :label="translate('profile.resume.fields.name', 'Name')"
              variant="outlined"
              class="mb-4"
              required
            />
            <v-text-field
              v-model="languageForm.flag"
              :label="translate('profile.resume.fields.flag', 'Flag code')"
              variant="outlined"
              class="mb-4"
              placeholder="fr"
            />
            <v-slider
              v-model="languageForm.level"
              :min="1"
              :max="5"
              :step="1"
              thumb-label
              color="primary"
              class="mb-6"
              :label="translate('profile.resume.fields.level', 'Level')"
            />
            <div class="profile-resume__dialog-actions">
              <AppButton
                variant="text"
                :disabled="isSavingLanguage"
                @click="languageDialog.open = false"
              >
                {{ t('common.actions.cancel') }}
              </AppButton>
              <AppButton
                type="submit"
                color="primary"
                :loading="isSavingLanguage"
              >
                {{
                  languageDialog.mode === 'edit'
                    ? t('common.actions.save')
                    : t('common.actions.create')
                }}
              </AppButton>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="skillDialog.open" max-width="520">
      <v-card>
        <v-card-title>
          {{
            skillDialog.mode === 'edit'
              ? translate('profile.resume.dialogs.skills.edit', 'Edit skill')
              : translate('profile.resume.dialogs.skills.create', 'Add skill')
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="skillFormError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ skillFormError }}
          </v-alert>
          <v-form @submit.prevent="submitSkillForm">
            <v-text-field
              v-model="skillForm.name"
              :label="translate('profile.resume.fields.name', 'Name')"
              variant="outlined"
              class="mb-4"
              required
            />
            <v-text-field
              v-model="skillForm.type"
              :label="translate('profile.resume.fields.type', 'Category')"
              variant="outlined"
              class="mb-4"
            />
            <v-slider
              v-model="skillForm.level"
              :min="1"
              :max="10"
              :step="1"
              thumb-label
              color="primary"
              class="mb-6"
              :label="translate('profile.resume.fields.level', 'Level')"
            />
            <div class="profile-resume__dialog-actions">
              <AppButton
                variant="text"
                :disabled="isSavingSkill"
                @click="skillDialog.open = false"
              >
                {{ t('common.actions.cancel') }}
              </AppButton>
              <AppButton
                type="submit"
                color="primary"
                :loading="isSavingSkill"
              >
                {{
                  skillDialog.mode === 'edit'
                    ? t('common.actions.save')
                    : t('common.actions.create')
                }}
              </AppButton>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="hobbyDialog.open" max-width="520">
      <v-card>
        <v-card-title>
          {{
            hobbyDialog.mode === 'edit'
              ? translate('profile.resume.dialogs.hobbies.edit', 'Edit hobby')
              : translate('profile.resume.dialogs.hobbies.create', 'Add hobby')
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="hobbyFormError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ hobbyFormError }}
          </v-alert>
          <v-form @submit.prevent="submitHobbyForm">
            <v-text-field
              v-model="hobbyForm.name"
              :label="translate('profile.resume.fields.name', 'Name')"
              variant="outlined"
              class="mb-4"
              required
            />
            <v-text-field
              v-model="hobbyForm.icon"
              :label="translate('profile.resume.fields.icon', 'Icon name')"
              variant="outlined"
              class="mb-6"
              placeholder="mdi-music"
            />
            <div class="profile-resume__dialog-actions">
              <AppButton
                variant="text"
                :disabled="isSavingHobby"
                @click="hobbyDialog.open = false"
              >
                {{ t('common.actions.cancel') }}
              </AppButton>
              <AppButton
                type="submit"
                color="primary"
                :loading="isSavingHobby"
              >
                {{
                  hobbyDialog.mode === 'edit'
                    ? t('common.actions.save')
                    : t('common.actions.create')
                }}
              </AppButton>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="projectDialog.open" max-width="640">
      <v-card>
        <v-card-title>
          {{
            projectDialog.mode === 'edit'
              ? translate('profile.resume.dialogs.projects.edit', 'Edit project')
              : translate('profile.resume.dialogs.projects.create', 'Add project')
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="projectFormError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ projectFormError }}
          </v-alert>
          <v-form @submit.prevent="submitProjectForm">
            <v-text-field
              v-model="projectForm.name"
              :label="translate('profile.resume.fields.name', 'Name')"
              variant="outlined"
              class="mb-4"
              required
            />
            <v-text-field
              v-model="projectForm.gitLink"
              :label="
                translate('profile.resume.fields.gitLink', 'Repository link')
              "
              variant="outlined"
              class="mb-4"
              placeholder="https://"
            />
            <v-textarea
              v-model="projectForm.description"
              :label="
                translate('profile.resume.fields.description', 'Description')
              "
              variant="outlined"
              rows="4"
              class="mb-6"
              auto-grow
            />
            <div class="profile-resume__dialog-actions">
              <AppButton
                variant="text"
                :disabled="isSavingProject"
                @click="projectDialog.open = false"
              >
                {{ t('common.actions.cancel') }}
              </AppButton>
              <AppButton
                type="submit"
                color="primary"
                :loading="isSavingProject"
              >
                {{
                  projectDialog.mode === 'edit'
                    ? t('common.actions.save')
                    : t('common.actions.create')
                }}
              </AppButton>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="referenceDialog.open" max-width="640">
      <v-card>
        <v-card-title>
          {{
            referenceDialog.mode === 'edit'
              ? translate(
                  'profile.resume.dialogs.references.edit',
                  'Edit reference',
                )
              : translate(
                  'profile.resume.dialogs.references.create',
                  'Add reference',
                )
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="referenceFormError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ referenceFormError }}
          </v-alert>
          <v-form @submit.prevent="submitReferenceForm">
            <v-text-field
              v-model="referenceForm.title"
              :label="translate('profile.resume.fields.title', 'Title')"
              variant="outlined"
              class="mb-4"
              required
            />
            <v-text-field
              v-model="referenceForm.company"
              :label="translate('profile.resume.fields.company', 'Company')"
              variant="outlined"
              class="mb-4"
            />
            <v-textarea
              v-model="referenceForm.description"
              :label="
                translate('profile.resume.fields.description', 'Description')
              "
              variant="outlined"
              rows="4"
              class="mb-4"
              auto-grow
            />
            <v-text-field
              v-model="referenceForm.startedAt"
              :label="translate('profile.resume.fields.startedAt', 'Start date')"
              type="date"
              variant="outlined"
              class="mb-4"
            />
            <v-text-field
              v-model="referenceForm.endedAt"
              :label="translate('profile.resume.fields.endedAt', 'End date')"
              type="date"
              variant="outlined"
              class="mb-6"
            />
            <div class="profile-resume__dialog-actions">
              <AppButton
                variant="text"
                :disabled="isSavingReference"
                @click="referenceDialog.open = false"
              >
                {{ t('common.actions.cancel') }}
              </AppButton>
              <AppButton
                type="submit"
                color="primary"
                :loading="isSavingReference"
              >
                {{
                  referenceDialog.mode === 'edit'
                    ? t('common.actions.save')
                    : t('common.actions.create')
                }}
              </AppButton>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog.open" max-width="480">
      <v-card>
        <v-card-title>
          {{ deleteDialogTitle }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="deleteError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ deleteError }}
          </v-alert>
          <p class="text-body-1 mb-2">
            {{
              translate(
                'profile.resume.dialogs.delete.confirmation',
                'Are you sure you want to remove this entry?',
              )
            }}
          </p>
          <p class="text-body-2 font-weight-medium mb-4">
            {{
              deleteDialog.label ||
                translate('profile.resume.dialogs.delete.itemFallback', 'This entry')
            }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ deleteDialogDescription }}
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <AppButton
            variant="text"
            :disabled="isDeleting"
            @click="deleteDialog.open = false"
          >
            {{ t('common.actions.cancel') }}
          </AppButton>
          <AppButton
            color="error"
            :loading="isDeleting"
            @click="confirmDelete"
          >
            {{ t('common.actions.delete') }}
          </AppButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </ProfilePageShell>
</template>
<style scoped>
.profile-resume__intro {
  border-radius: 24px;
}

.profile-resume__grid {
  row-gap: 16px;
}

.profile-resume__section {
  height: 100%;
}

.profile-resume__section-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.profile-resume__section-body {
  padding: 16px;
}

.profile-resume__loading {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

.profile-resume__entries {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-resume__entry {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.profile-resume__entry--dense {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.profile-resume__entry-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.profile-resume__entry-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-resume__chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.profile-resume__chip {
  padding-right: 8px;
}

.profile-resume__chip-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-resume__chip-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-resume__dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 600px) {
  .profile-resume__section-body {
    padding: 8px;
  }

  .profile-resume__entry {
    padding: 12px;
  }
}
</style>
