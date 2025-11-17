<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Job } from '~/types/job'
import {
  ContractType,
  LanguageLevel,
  WorkType,
} from '~/types/job'

definePageMeta({
  layout: 'default',
  title: 'Job platform',
})

const jobs = ref<Job[]>([
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
] satisfies Job[])

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

  return jobs.value.filter((job) => {
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

const totalJobs = computed(() => jobs.value.length)
const remoteFriendlyJobs = computed(
  () => jobs.value.filter((job) => job.workType === WorkType.REMOTE).length,
)
const hiringCompanies = computed(() => {
  const set = new Set(jobs.value.map((job) => job.company?.name).filter(Boolean))
  return set.size
})

const heroMetrics = computed(() => [
  { label: 'Open roles', value: totalJobs.value },
  { label: 'Remote friendly', value: remoteFriendlyJobs.value },
  { label: 'Hiring companies', value: hiringCompanies.value },
])

const skillCloud = computed(() => {
  const counter = new Map<string, number>()
  jobs.value.forEach((job) => {
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

const lastUpdatedAt = computed(() => {
  const timestamps = jobs.value
    .map((job) => job.updatedAt || job.createdAt)
    .filter(Boolean)
  if (!timestamps.length) return null
  const latest = timestamps.sort().at(-1)
  return latest ? new Date(latest).toLocaleDateString() : null
})

const detailsDialog = ref(false)
const selectedJob = ref<Job | null>(null)

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
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer">
        <div class="job-platform__hero-text">
          <p class="overline">Bro World · Job platform</p>
          <h4>Find the next job that matches your craft</h4>
        </div>
        <v-divider class="my-2" />
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
      </teleport>
    </client-only>
    <client-only>
      <teleport to="#app-drawer-right">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="filters.search"
              label="Search roles or skills"
              prepend-inner-icon="mdi-magnify"
              hide-details
              variant="outlined"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="filters.location"
              label="Location"
              prepend-inner-icon="mdi-map-marker"
              hide-details
              variant="outlined"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="filters.workType"
              :items="workTypeOptions"
              label="Work type"
              hide-details
              variant="outlined"
              clearable
            />
          </v-col>
          <v-col cols="12">
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
      </teleport>
    </client-only>
    <div class="job-platform__list-header">
      <div>
        <h2>Matching roles</h2>
        <p>
          {{ filteredJobs.length }} opportunities ·
          <span v-if="lastUpdatedAt">Updated {{ lastUpdatedAt }}</span>
          <span v-else>Freshly curated</span>
        </p>
      </div>
      <v-btn color="primary" variant="flat" class="text-none">
        Create alert
      </v-btn>
    </div>

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
            <v-btn color="primary" variant="flat" class="text-none">
              Apply now
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      v-if="!filteredJobs.length"
      type="info"
      variant="tonal"
      class="mt-6"
    >
      No job matches yet. Try adjusting your filters.
    </v-alert>

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
          <v-btn color="primary" variant="flat" class="text-none">
            Start application
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
