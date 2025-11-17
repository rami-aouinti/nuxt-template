<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import type { Applicant, Company, Job } from '~/types/job'
import {
  ContractType,
  LanguageLevel,
  WorkType,
} from '~/types/job'
import { useJobStore } from '~/stores/job'
import { Notify } from '~/stores/notification'

type ApplicationDialogMode = 'select' | 'create'

definePageMeta({
  layout: 'default',
  title: 'Job platform',
})

const JOB_PLATFORM_MEDIA_BASE_URL = 'https://job.bro-world.org'
const jobApi = useJobPlatformApi()
const { loggedIn } = useAppUserSession()

const {
  data: jobCompanies,
  pending: companiesPending,
  error: companiesError,
} = await useFetch<Company[]>('/api/job/companies')

const normalizeMediaUrl = (path?: string | null) => {
  if (!path) {
    return null
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${JOB_PLATFORM_MEDIA_BASE_URL}${path}`
}

const companyShowcase = computed(() => {
  return (jobCompanies.value ?? []).map((company) => ({
    ...company,
    logo: normalizeMediaUrl(company.logo) ?? undefined,
    medias: company.medias?.map((media) => ({
      ...media,
      url: normalizeMediaUrl(media.url) ?? media.url,
    })),
  }))
})

const visibleCompanies = computed(() => companyShowcase.value.slice(0, 6))
const totalCompanyProfiles = computed(() => companyShowcase.value.length)

const sampleJobs: Job[] = [
  {
    id: 'job-senior-frontend',
    title: 'Senior Frontend Engineer',
    description:
      'Lead the experience layer of our job platform, evolve the design system, and mentor a remote squad of product engineers.',
    work:
      'Collaborate with design and product to deliver polished features every sprint while keeping a high-quality bar for accessibility and performance.',
    requiredSkills: ['Vue 3', 'Nuxt 3', 'TypeScript', 'Design Systems', 'Testing Library'],
    experience: '5+ years',
    workType: WorkType.REMOTE,
    workLocation: 'Remote - Europe (CET ±2)',
    salaryRange: '€70k – €90k',
    languages: [
      { id: 1, name: 'English', level: LanguageLevel.FLUENT },
      { id: 2, name: 'French', level: LanguageLevel.INTERMEDIATE },
    ],
    contractType: ContractType.FULLTIME,
    requirements: [
      'Own the frontend roadmap for employer dashboards',
      'Guide adoption of our component library across teams',
      'Partner with DX engineers to keep build times low',
    ],
    benefits:
      'Equity plan, personal learning budget, remote stipend, and 30 days of paid vacation.',
    company: {
      id: 'company-northwind',
      name: 'Northwind Talent',
      description:
        'Boutique recruitment team building hiring tools for remote-first companies.',
      location: 'Berlin, Germany',
      contactEmail: 'hello@northwind.com',
      logo: 'https://dummyimage.com/80x80/1e2a78/ffffff&text=NT',
      siteUrl: 'https://northwind.example.com',
    },
    user: '00000000-0000-0000-0000-000000000001',
    createdAt: '2024-02-15T10:00:00.000Z',
    updatedAt: '2024-03-10T08:45:00.000Z',
  },
  {
    id: 'job-product-designer',
    title: 'Product Designer – Hiring Journeys',
    description:
      'Design adaptive interview experiences, craft service blueprints, and partner with research to improve conversion across the hiring funnel.',
    work:
      'You will iterate on white-glove employer experiences, pair with UX writers, and deliver storyboards that engineering can ship every week.',
    requiredSkills: ['Figma', 'Design systems', 'User Research', 'Prototyping'],
    experience: '4+ years',
    workType: WorkType.HYBRID,
    workLocation: 'Paris, France',
    salaryRange: '€60k – €75k',
    languages: [
      { id: 3, name: 'English', level: LanguageLevel.FLUENT },
      { id: 4, name: 'French', level: LanguageLevel.NATIVE },
    ],
    contractType: ContractType.FULLTIME,
    requirements: [
      'Own discovery and delivery rituals with PM/EM partners',
      'Translate complex service flows into calm employer tools',
      'Ship polished motion that elevates the brand',
    ],
    benefits: 'Hybrid office, mobility budget, and quarterly offsites.',
    company: {
      id: 'company-atlas',
      name: 'Atlas Careers',
      description:
        'Multi-country job marketplace helping teams recruit multilingual talent.',
      location: 'Paris, France',
      contactEmail: 'design@atlas-careers.com',
      logo: 'https://dummyimage.com/80x80/0f766e/ffffff&text=AC',
      siteUrl: 'https://atlas-careers.example.com',
    },
    user: '00000000-0000-0000-0000-000000000002',
    createdAt: '2024-03-01T09:00:00.000Z',
    updatedAt: '2024-03-12T12:20:00.000Z',
  },
  {
    id: 'job-talent-ops',
    title: 'Talent Operations Lead',
    description:
      'Build repeatable workflows for our candidate success team, automate reporting, and make sure every application receives a thoughtful response.',
    work:
      'Coordinate across operations, finance, and sales. You will pilot AI copilots, instrumentation, and guide compliance updates.',
    requiredSkills: ['Process Design', 'Notion', 'Zapier', 'People Ops'],
    experience: '3+ years',
    workType: WorkType.ONSITE,
    workLocation: 'Lisbon, Portugal',
    salaryRange: '€45k – €55k',
    languages: [
      { id: 5, name: 'English', level: LanguageLevel.FLUENT },
      { id: 6, name: 'Portuguese', level: LanguageLevel.NATIVE },
    ],
    contractType: ContractType.FULLTIME,
    requirements: [
      'Design playbooks that scale across multiple hubs',
      'Implement QA loops for candidate communication',
      'Partner with finance on headcount forecasting',
    ],
    benefits: 'Health insurance, paid lunches, and local transit pass.',
    company: {
      id: 'company-tide',
      name: 'Tidewave',
      description: 'Climate-tech startup growing its international talent collective.',
      location: 'Lisbon, Portugal',
      contactEmail: 'people@tidewave.io',
      logo: 'https://dummyimage.com/80x80/4338ca/ffffff&text=TW',
      siteUrl: 'https://tidewave.example.com',
    },
    user: '00000000-0000-0000-0000-000000000003',
    createdAt: '2024-02-25T14:30:00.000Z',
    updatedAt: '2024-03-09T15:30:00.000Z',
  },
  {
    id: 'job-customer-success',
    title: 'Customer Success Strategist',
    description:
      'Coach employer teams on onboarding, interpret analytics, and translate feedback into crisp product experiments.',
    work:
      'Meet executive sponsors weekly, maintain playbooks for success teams, and produce action plans aligned to hiring OKRs.',
    requiredSkills: ['Account Management', 'Data Storytelling', 'HubSpot', 'Hiring Analytics'],
    experience: '5+ years',
    workType: WorkType.REMOTE,
    workLocation: 'Remote – Americas',
    salaryRange: '$95k – $115k',
    languages: [
      { id: 7, name: 'English', level: LanguageLevel.NATIVE },
      { id: 8, name: 'Spanish', level: LanguageLevel.INTERMEDIATE },
    ],
    contractType: ContractType.FULLTIME,
    requirements: [
      'Design ROI reviews with revenue leadership',
      'Coach recruiters on the analytics workspace',
      'Coordinate with marketing on co-branded case studies',
    ],
    benefits: 'Remote office budget, annual company retreat, flexible PTO.',
    company: {
      id: 'company-pulse',
      name: 'Pulseboard',
      description: 'Hiring intelligence layer for recruiting platforms.',
      location: 'Austin, USA',
      contactEmail: 'talent@pulseboard.com',
      logo: 'https://dummyimage.com/80x80/ea580c/ffffff&text=PB',
      siteUrl: 'https://pulseboard.example.com',
    },
    user: '00000000-0000-0000-0000-000000000004',
    createdAt: '2024-03-05T11:15:00.000Z',
    updatedAt: '2024-03-15T09:10:00.000Z',
  },
]
const jobStore = useJobStore()
const { jobs, isLoading, error: jobError, hasJobs, lastUpdatedAt } =
  storeToRefs(jobStore)

await jobStore.fetchJobs()

const resolvedJobs = computed(() =>
  jobs.value.length ? jobs.value : sampleJobs,
)

const filters = reactive({
  search: '',
  location: '',
  workType: null as WorkType | null,
  contractType: null as ContractType | null,
})

const workTypeOptions = Object.values(WorkType).map((value) => ({
  title: value,
  value,
}))

const contractTypeOptions = Object.values(ContractType).map((value) => ({
  title: value,
  value,
}))

const clearFilters = () => {
  filters.search = ''
  filters.location = ''
  filters.workType = null
  filters.contractType = null
}

const filteredJobs = computed(() => {
  const search = filters.search.trim().toLowerCase()
  const location = filters.location.trim().toLowerCase()

  return resolvedJobs.value.filter((job) => {
    const matchesSearch = search
      ? [
          job.title,
          job.description,
          job.company?.name ?? '',
          job.requiredSkills?.join(' ') ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(search)
      : true

    const matchesLocation = location
      ? (job.workLocation || job.company?.location || '')
          .toLowerCase()
          .includes(location)
      : true

    const matchesWorkType = filters.workType
      ? job.workType === filters.workType
      : true

    const matchesContract = filters.contractType
      ? job.contractType === filters.contractType
      : true

    return (
      matchesSearch &&
      matchesLocation &&
      matchesWorkType &&
      matchesContract
    )
  })
})

const totalJobs = computed(() => resolvedJobs.value.length)
const remoteFriendlyJobs = computed(
  () =>
    resolvedJobs.value.filter((job) => job.workType === WorkType.REMOTE).length,
)
const hiringCompanies = computed(() => {
  const set = new Set(
    resolvedJobs.value.map((job) => job.company?.name).filter(Boolean),
  )
  return set.size
})

const heroMetrics = computed(() => [
  { label: 'Open roles', value: totalJobs.value },
  { label: 'Remote friendly', value: remoteFriendlyJobs.value },
  { label: 'Hiring companies', value: hiringCompanies.value },
])

const skillCloud = computed(() => {
  const counter = new Map<string, number>()
  resolvedJobs.value.forEach((job) => {
    job.requiredSkills?.forEach((skill) => {
      const key = skill.trim()
      if (!key) return
      counter.set(key, (counter.get(key) ?? 0) + 1)
    })
  })

  return Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skill, count]) => ({ skill, count }))
})

const formattedLastUpdatedAt = computed(() => {
  if (!lastUpdatedAt.value) {
    return null
  }

  const value = new Date(lastUpdatedAt.value)
  return Number.isNaN(value.valueOf()) ? null : value.toLocaleDateString()
})

const detailsDialog = ref(false)
const selectedJob = ref<Job | null>(null)
const applicationDialog = reactive({
  open: false,
  job: null as Job | null,
  applicants: [] as Applicant[],
  loadingApplicants: false,
  selectedApplicantId: '',
  mode: 'select' as ApplicationDialogMode,
  submitting: false,
  error: '',
})
const applicantForm = reactive({
  firstName: '',
  lastName: '',
  contactEmail: '',
  phone: '',
  file: null as File | null,
})

const showJobDetails = (job: Job) => {
  selectedJob.value = job
  detailsDialog.value = true
}

const closeJobDetails = () => {
  detailsDialog.value = false
}

watch(detailsDialog, (isOpen) => {
  if (!isOpen) {
    selectedJob.value = null
  }
})

const hasApplicantProfiles = computed(
  () => applicationDialog.applicants.length > 0,
)

const canSubmitApplication = computed(() => {
  if (!applicationDialog.job) {
    return false
  }

  if (applicationDialog.mode === 'select') {
    return applicationDialog.selectedApplicantId.trim().length > 0
  }

  return (
    applicantForm.firstName.trim().length > 0 &&
    applicantForm.lastName.trim().length > 0 &&
    applicantForm.contactEmail.trim().length > 0
  )
})

const applicationActionLabel = computed(() => {
  if (applicationDialog.mode === 'create') {
    return 'Create profile & apply'
  }

  return 'Submit application'
})

const isAuthenticated = computed(() => loggedIn.value)

const applicationDisabledReason = computed(() => {
  if (isAuthenticated.value) {
    return ''
  }

  return 'Sign in to start your application'
})

const applicantOptions = computed(() =>
  applicationDialog.applicants.map((applicant) => {
    const fullName = [applicant.firstName, applicant.lastName]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(' ')

    return {
      title: fullName || applicant.contactEmail,
      subtitle: applicant.contactEmail,
      value: applicant.id,
    }
  }),
)

const resetApplicantForm = () => {
  applicantForm.firstName = ''
  applicantForm.lastName = ''
  applicantForm.contactEmail = ''
  applicantForm.phone = ''
  applicantForm.file = null
}

const resetApplicationDialog = () => {
  applicationDialog.job = null
  applicationDialog.applicants = []
  applicationDialog.selectedApplicantId = ''
  applicationDialog.mode = 'select'
  applicationDialog.error = ''
  applicationDialog.loadingApplicants = false
  applicationDialog.submitting = false
  resetApplicantForm()
}

watch(
  () => applicationDialog.open,
  (isOpen) => {
    if (!isOpen) {
      resetApplicationDialog()
    }
  },
)

watch(
  () => applicationDialog.mode,
  (mode) => {
    if (mode === 'select' && !hasApplicantProfiles.value) {
      applicationDialog.mode = 'create'
    }
    applicationDialog.error = ''
  },
)

const resolveJobApiError = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object'
  ) {
    const data = error.data as Record<string, unknown>
    if (typeof data.message === 'string' && data.message.trim().length > 0) {
      return data.message
    }
    if (typeof data.error === 'string' && data.error.trim().length > 0) {
      return data.error
    }
  }

  return fallback
}

const loadApplicantProfiles = async () => {
  applicationDialog.loadingApplicants = true
  applicationDialog.error = ''

  try {
    const response = await jobApi.currentApplicant.list<Applicant[]>()
    const applicants = Array.isArray(response) ? response : []
    applicationDialog.applicants = applicants

    if (applicants.length > 0) {
      applicationDialog.selectedApplicantId = applicants[0]?.id ?? ''
      applicationDialog.mode = 'select'
    } else {
      applicationDialog.mode = 'create'
    }
  } catch (error) {
    applicationDialog.error = resolveJobApiError(
      error,
      'Unable to load your applicant profiles.',
    )
  } finally {
    applicationDialog.loadingApplicants = false
  }
}

const openApplicationDialog = async (job?: Job | null) => {
  if (!job) {
    return
  }
  if (!isAuthenticated.value) {
    Notify.error('Please sign in to submit your application.')
    return
  }

  applicationDialog.job = job
  applicationDialog.open = true
  await loadApplicantProfiles()
}

const closeApplicationDialog = () => {
  applicationDialog.open = false
}

const setApplicantFile = (value: File[] | File | null) => {
  if (Array.isArray(value)) {
    applicantForm.file = value[0] ?? null
    return
  }

  applicantForm.file = value ?? null
}

const submitApplication = async () => {
  if (!applicationDialog.job || !canSubmitApplication.value) {
    applicationDialog.error = 'Please complete the required fields.'
    return
  }

  applicationDialog.submitting = true
  applicationDialog.error = ''

  try {
    let applicantId = applicationDialog.selectedApplicantId

    if (applicationDialog.mode === 'create') {
      const formData = new FormData()
      formData.set('firstName', applicantForm.firstName.trim())
      formData.set('lastName', applicantForm.lastName.trim())
      formData.set('contactEmail', applicantForm.contactEmail.trim())
      formData.set('phone', applicantForm.phone.trim())
      if (applicantForm.file) {
        formData.set('file', applicantForm.file)
      }

      const createdApplicant = await jobApi.currentApplicant.create<Applicant>(
        formData,
      )
      applicantId = createdApplicant?.id ?? ''
    }

    if (!applicantId) {
      throw new Error('Missing applicant information.')
    }

    await jobApi.applications.create(
      applicationDialog.job.id,
      applicantId,
    )

    Notify.success('Application submitted successfully.')
    applicationDialog.open = false
  } catch (error) {
    const message = resolveJobApiError(
      error,
      'Unable to submit your application.',
    )
    applicationDialog.error = message
    Notify.error(message)
  } finally {
    applicationDialog.submitting = false
  }
}
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer">
        <div class="job-platform__hero-text">
          <p class="overline">Bro World · Job platform</p>
          <h4>Find the next job that matches your craft</h4>
        </div>
      </teleport>
    </client-only>

    <section class="job-platform__hero">
      <v-container>
        <v-card flat class="job-platform__hero-card" color="surface">
          <div>
            <p class="overline">Curated roles</p>
            <h1>Opportunities for builders and operators</h1>
            <p>
              Discover remote, hybrid, and on-site roles sourced from the Bro World
              community. Filter opportunities by craft, location, and contract to
              focus on the work that matches your energy.
            </p>
          </div>
          <div class="job-platform__hero-metrics">
            <div
              v-for="metric in heroMetrics"
              :key="metric.label"
              class="job-platform__metric d-flex inline-flex-column align-center"
            >
              <p class="job-platform__metric-label">{{ metric.label }}</p>
              <p class="job-platform__metric-value px-4">{{ metric.value }}</p>
            </div>
          </div>
        </v-card>
      </v-container>
    </section>

    <section class="job-platform__companies">
      <v-container>
        <div class="job-platform__companies-header">
          <div>
            <p class="overline">Hiring companies</p>
            <h2>Meet the teams behind the roles</h2>
            <p>
              Profiles are pulled directly from the Bro World job platform so
              you always see fresh company snapshots.
            </p>
          </div>
          <v-chip
            v-if="totalCompanyProfiles"
            size="small"
            color="primary"
            variant="tonal"
          >
            {{ totalCompanyProfiles }} profiles
          </v-chip>
        </div>

        <v-progress-linear
          v-if="companiesPending"
          indeterminate
          color="primary"
          class="mb-6"
        />
        <v-alert
          v-else-if="companiesError"
          type="warning"
          variant="tonal"
          class="mb-6"
        >
          Unable to load company profiles right now.
        </v-alert>
        <template v-else>
          <v-row v-if="visibleCompanies.length" dense>
            <v-col
              v-for="company in visibleCompanies"
              :key="company.id"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card class="company-card" variant="outlined">
                <div class="company-card__header">
                  <div v-if="company.logo" class="company-card__logo">
                    <img :src="company.logo" :alt="company.name" loading="lazy" />
                  </div>
                  <div>
                    <p class="company-card__name">{{ company.name }}</p>
                    <p class="company-card__location">{{ company.location }}</p>
                  </div>
                </div>
                <p v-if="company.description" class="company-card__description">
                  {{ company.description }}
                </p>
                <div class="company-card__meta">
                  <v-chip size="x-small" variant="tonal" color="primary">
                    {{ company.medias?.length ?? 0 }} media
                  </v-chip>
                  <v-chip
                    v-if="company.contactEmail"
                    size="x-small"
                    variant="text"
                    class="company-card__contact"
                  >
                    {{ company.contactEmail }}
                  </v-chip>
                </div>
                <div class="company-card__actions">
                  <v-btn
                    v-if="company.siteUrl"
                    :href="company.siteUrl"
                    target="_blank"
                    rel="noopener"
                    variant="text"
                    class="text-none"
                  >
                    Visit site
                  </v-btn>
                  <v-btn
                    v-if="company.contactEmail"
                    :href="`mailto:${company.contactEmail}`"
                    variant="text"
                    class="text-none"
                  >
                    Contact
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-alert v-else type="info" variant="tonal">
            No company profiles are available yet. Check back soon.
          </v-alert>
        </template>
      </v-container>
    </section>

    <section class="job-platform__filters">
      <v-container>
        <v-card flat class="job-platform__filters-card" color="surface">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.search"
                label="Search roles or skills"
                prepend-inner-icon="mdi-magnify"
                hide-details
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="filters.location"
                label="Location"
                prepend-inner-icon="mdi-map-marker"
                hide-details
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="filters.workType"
                :items="workTypeOptions"
                label="Work type"
                hide-details
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.contractType"
                :items="contractTypeOptions"
                label="Contract"
                hide-details
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <div class="job-platform__filters-footer">
            <div class="job-platform__skill-cloud">
              <span class="job-platform__skill-cloud-label">Trending skills:</span>
              <v-chip
                v-for="item in skillCloud"
                :key="item.skill"
                size="small"
                class="ma-1"
                variant="tonal"
              >
                {{ item.skill }}
                <span class="job-platform__skill-count">×{{ item.count }}</span>
              </v-chip>
            </div>
            <v-btn color="secondary" variant="text" class="text-none" @click="clearFilters">
              Reset filters
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </section>

    <section class="job-platform__list">
      <v-container>
        <div class="job-platform__list-header">
          <div>
            <h2>Matching roles</h2>
            <p>
              {{ filteredJobs.length }} opportunities ·
              <span v-if="formattedLastUpdatedAt">
                Updated {{ formattedLastUpdatedAt }}
              </span>
              <span v-else>Freshly curated</span>
            </p>
          </div>
          <v-btn color="secondary" variant="text" class="text-none" @click="clearFilters">
            Reset filters
          </v-btn>
        </div>

        <v-progress-linear
          v-if="isLoading && !hasJobs"
          color="primary"
          indeterminate
          class="mb-4"
        />

        <v-alert
          v-if="jobError"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ jobError }}
        </v-alert>

        <v-row dense>
          <v-col
            v-for="job in filteredJobs"
            :key="job.id"
            cols="12"
            md="6"
          >
            <v-card class="job-card" variant="tonal" color="primary">
              <div class="job-card__header">
                <div class="job-card__company">
                  <div v-if="job.company?.logo" class="job-card__logo">
                    <img :src="job.company.logo" :alt="job.company.name" loading="lazy" />
                  </div>
                  <div>
                    <p class="job-card__company-name">
                      {{ job.company?.name ?? 'Independent team' }}
                    </p>
                    <p class="job-card__location">
                      {{ job.workLocation || job.company?.location || 'Flexible' }}
                    </p>
                  </div>
                </div>
                <v-chip size="small" color="primary" variant="elevated">
                  {{ job.workType ?? 'Flexible' }}
                </v-chip>
              </div>

              <h3 class="job-card__title">{{ job.title }}</h3>
              <p class="job-card__description">
                {{ job.description }}
              </p>

              <div class="job-card__meta">
                <v-chip size="small" variant="flat" color="primary">
                  Experience · {{ job.experience ?? 'Any level' }}
                </v-chip>
                <v-chip v-if="job.salaryRange" size="small" variant="flat" color="primary">
                  {{ job.salaryRange }}
                </v-chip>
                <v-chip v-if="job.contractType" size="small" variant="flat" color="primary">
                  {{ job.contractType }}
                </v-chip>
              </div>

              <div v-if="job.requiredSkills?.length" class="job-card__skills">
                <v-chip
                  v-for="skill in job.requiredSkills.slice(0, 4)"
                  :key="skill"
                  size="x-small"
                  variant="tonal"
                  color="primary"
                  class="mr-1 mb-1"
                >
                  {{ skill }}
                </v-chip>
                <span v-if="job.requiredSkills.length > 4" class="job-card__skills-more">
                  +{{ job.requiredSkills.length - 4 }} more
                </span>
              </div>

              <div class="job-card__actions">
                <v-btn variant="text" class="text-none" @click="showJobDetails(job)">
                  Role details
                </v-btn>
                <v-tooltip
                  :text="applicationDisabledReason"
                  :disabled="isAuthenticated"
                  location="bottom"
                >
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="primary"
                      variant="flat"
                      class="text-none"
                      :disabled="!isAuthenticated"
                      @click="openApplicationDialog(job)"
                    >
                      Apply now
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-alert
          v-if="!isLoading && !jobError && hasJobs && !filteredJobs.length"
          type="info"
          variant="tonal"
          class="mt-6"
        >
          No job matches yet. Try adjusting your filters.
        </v-alert>
        <v-alert
          v-else-if="!isLoading && !jobError && !hasJobs"
          type="info"
          variant="tonal"
          class="mt-6"
        >
          New opportunities will be published soon. Come back later.
        </v-alert>
      </v-container>
    </section>

    <v-dialog v-model="detailsDialog" max-width="720" scrollable>
      <v-card v-if="selectedJob" class="job-details">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <p class="text-caption text-medium-emphasis mb-1">
              {{ selectedJob.company?.name }} · {{ selectedJob.workType || 'Flexible' }}
            </p>
            <h3 class="text-h5">{{ selectedJob.title }}</h3>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="closeJobDetails" />
        </v-card-title>
        <v-divider />
        <v-card-text>
          <p class="mb-4">{{ selectedJob.description }}</p>
          <div v-if="selectedJob.requirements?.length" class="job-details__section">
            <h4>What you will work on</h4>
            <ul>
              <li v-for="item in selectedJob.requirements" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
          <div v-if="selectedJob.languages?.length" class="job-details__section">
            <h4>Languages</h4>
            <v-chip
              v-for="language in selectedJob.languages"
              :key="language.id"
              class="ma-1"
              size="small"
              variant="tonal"
            >
              {{ language.name }} · {{ language.level }}
            </v-chip>
          </div>
          <div v-if="selectedJob.benefits" class="job-details__section">
            <h4>Benefits</h4>
            <p>{{ selectedJob.benefits }}</p>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="justify-end">
          <v-btn variant="text" class="text-none" @click="closeJobDetails">
            Close
          </v-btn>
          <v-tooltip
            :text="applicationDisabledReason"
            :disabled="isAuthenticated"
            location="bottom"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                variant="flat"
                class="text-none"
                :disabled="!isAuthenticated"
                @click="openApplicationDialog(selectedJob)"
              >
                Start application
              </v-btn>
            </template>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="applicationDialog.open" max-width="640" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <p class="text-caption text-medium-emphasis mb-1">
              {{ applicationDialog.job?.company?.name || 'Bro World' }}
            </p>
            <h3 class="text-h5 mb-0">Apply to {{ applicationDialog.job?.title }}</h3>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="closeApplicationDialog" />
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-alert
            v-if="applicationDialog.error"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ applicationDialog.error }}
          </v-alert>
          <v-progress-linear
            v-if="applicationDialog.loadingApplicants"
            indeterminate
            color="primary"
            class="mb-4"
          />
          <div v-else class="d-flex flex-column gap-4">
            <div class="d-flex gap-2 flex-wrap align-center">
              <v-chip-group
                v-model="applicationDialog.mode"
                selected-class="text-primary"
                mandatory
              >
                <v-chip
                  value="select"
                  :disabled="!hasApplicantProfiles"
                >
                  Use existing profile
                </v-chip>
                <v-chip value="create">Create new profile</v-chip>
              </v-chip-group>
            </div>

            <div v-if="applicationDialog.mode === 'select'">
              <v-alert
                v-if="!hasApplicantProfiles"
                type="info"
                variant="tonal"
                class="mb-0"
              >
                No applicant profile found. Switch to "Create new profile" to get
                started.
              </v-alert>
              <v-select
                v-else
                v-model="applicationDialog.selectedApplicantId"
                label="Select applicant profile"
                :items="applicantOptions"
                item-title="title"
                item-value="value"
                variant="outlined"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.raw.subtitle }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>
            </div>

            <div v-else class="d-flex flex-column gap-3">
              <v-text-field
                v-model="applicantForm.firstName"
                label="First name"
                variant="outlined"
                required
              />
              <v-text-field
                v-model="applicantForm.lastName"
                label="Last name"
                variant="outlined"
                required
              />
              <v-text-field
                v-model="applicantForm.contactEmail"
                label="Contact email"
                variant="outlined"
                required
                type="email"
              />
              <v-text-field
                v-model="applicantForm.phone"
                label="Phone"
                variant="outlined"
              />
              <v-file-input
                :model-value="applicantForm.file ? [applicantForm.file] : []"
                label="Attach resume (optional)"
                variant="outlined"
                accept=".pdf,.doc,.docx,.png,.jpg"
                prepend-icon="mdi-paperclip"
                @update:model-value="setApplicantFile"
              />
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="justify-end">
          <v-btn variant="text" class="text-none" @click="closeApplicationDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="text-none"
            :loading="applicationDialog.submitting"
            :disabled="!canSubmitApplication || applicationDialog.submitting"
            @click="submitApplication"
          >
            {{ applicationActionLabel }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped lang="scss">
.job-platform__hero {
  padding: 64px 0 32px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), transparent);
}

.job-platform__hero-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  padding: 32px;
  border-radius: 24px;
  background: rgba(var(--v-theme-surface), 1);
  box-shadow: 0 25px 50px -12px rgb(15 23 42 / 0.15);
}

.job-platform__companies {
  padding: 32px 0 16px;
}

.job-platform__companies-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 24px;
}

.job-platform__companies-header h2 {
  margin-top: 8px;
  margin-bottom: 8px;
}

.job-platform__companies-header p {
  color: rgba(var(--v-theme-on-surface), 0.8);
  margin-bottom: 0;
}

.job-platform__companies .overline {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(var(--v-theme-primary), 1);
}

.company-card {
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.company-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-card__logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 1);
}

.company-card__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-card__name {
  font-weight: 600;
  margin: 0;
}

.company-card__location {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.company-card__description {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.company-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.company-card__actions {
  margin-top: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.job-platform__hero-text h1 {
  font-size: clamp(2rem, 3vw, 2.75rem);
  margin-bottom: 12px;
}

.job-platform__hero-text p {
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.job-platform__hero-text .overline {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(var(--v-theme-primary), 1);
  margin-bottom: 8px;
}

.job-platform__hero-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.job-platform__metric {
  padding: 16px 20px;
  border-radius: 16px;
  background: rgba(var(--v-theme-primary), 0.08);
  min-width: 160px;
}

.job-platform__metric-value {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.job-platform__metric-label {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.job-platform__filters {
  margin-top: -40px;
}

.job-platform__filters-card {
  border-radius: 20px;
  padding: 24px;
}

.job-platform__filters-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.job-platform__skill-cloud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.job-platform__skill-cloud-label {
  font-weight: 500;
  margin-right: 8px;
}

.job-platform__skill-count {
  font-size: 0.75rem;
  margin-left: 4px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.job-platform__list {
  padding: 48px 0 80px;
}

.job-platform__list-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.job-card {
  border-radius: 20px;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.job-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.job-card__company {
  display: flex;
  align-items: center;
  gap: 12px;
}

.job-card__logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 1);
}

.job-card__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.job-card__company-name {
  font-weight: 600;
  margin: 0;
}

.job-card__location {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.job-card__title {
  margin: 0;
  font-size: 1.35rem;
}

.job-card__description {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.job-card__meta,
.job-card__skills,
.job-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.job-card__actions {
  justify-content: flex-end;
  margin-top: auto;
}

.job-details__section {
  margin-bottom: 16px;
}

.job-details__section h4 {
  margin-bottom: 8px;
}

.job-details__section ul {
  padding-left: 18px;
  margin: 0;
}

.job-details__section li {
  margin-bottom: 6px;
}

@media (max-width: 600px) {
  .job-card__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
