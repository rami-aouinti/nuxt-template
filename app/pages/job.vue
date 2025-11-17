<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import type { Job } from '~/types/job'
import { ContractType, WorkType } from '~/types/job'
import { useJobStore } from '~/stores/job'

definePageMeta({
  layout: 'default',
  title: 'Job platform',
})

const jobStore = useJobStore()
const { jobs, isLoading, error: jobError, hasJobs, lastUpdatedAt } =
  storeToRefs(jobStore)

await jobStore.fetchJobs()

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

const formattedLastUpdatedAt = computed(() => {
  if (!lastUpdatedAt.value) {
    return null
  }

  const value = new Date(lastUpdatedAt.value)
  return Number.isNaN(value.valueOf()) ? null : value.toLocaleDateString()
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
