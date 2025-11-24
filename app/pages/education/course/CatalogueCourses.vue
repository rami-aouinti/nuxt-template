<template>
  <v-container class="py-8">
    <AppCard class="mb-6" elevation="2">
      <v-card-text>
        <div class="d-flex flex-wrap align-start justify-space-between gap-4 mb-4">
          <div>
            <div class="text-h5 font-weight-bold mb-1">{{ $t('Course catalogue') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ $t('Browse, filter, and subscribe to available courses.') }}
            </div>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-3 align-end">
            <v-chip color="primary" variant="tonal" prepend-icon="mdi-format-list-numbered">
              {{ $t('Total number of courses') }}: {{ courses.length }}
            </v-chip>
            <v-chip color="secondary" variant="tonal" prepend-icon="mdi-filter-check">
              {{ $t('Matching courses') }}: {{ totalVisibleCourses }}
            </v-chip>
          </div>
        </div>

        <v-row class="align-end" dense>
          <v-col cols="12" md="3">
            <v-btn
              color="primary"
              prepend-icon="mdi-tune"
              variant="elevated"
              block
              @click="showAdvancedSearch = !showAdvancedSearch"
            >
              {{ showAdvancedSearch ? $t('Hide advanced search') : $t('Advanced search') }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              color="secondary"
              prepend-icon="mdi-filter-remove-outline"
              variant="tonal"
              block
              @click="clearFilter"
            >
              {{ $t('Clear filter results') }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="sortField"
              :items="allSortOptions"
              :item-title="(item) => item.label"
              :item-value="(item) => item.value"
              :label="$t('Sort by')"
              clearable
              density="comfortable"
              prepend-inner-icon="mdi-sort"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.global.value"
              :label="$t('Search')"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-expand-transition>
          <AppCard
            v-if="showAdvancedSearch"
            class="mt-4"
            variant="tonal"
            color="primary"
            rounded="lg"
            shadow
          >
            <v-card-text>
              <AdvancedCourseFilters
                :key="advancedFormKey"
                :allow-title="courseCatalogueSettings.filters?.by_title ?? true"
                :fields="extraFields"
                @apply="onAdvancedApply"
                @clear="onAdvancedClear"
              />
            </v-card-text>
          </AppCard>
        </v-expand-transition>
      </v-card-text>
    </AppCard>

    <v-alert
      v-if="status"
      type="info"
      variant="tonal"
      class="mb-6"
      border="start"
      density="comfortable"
      :text="$t('Loading courses. Please wait.')"
    />

    <v-alert
      v-else-if="!filteredCourses.length"
      type="warning"
      variant="tonal"
      class="mb-6"
      border="start"
      density="comfortable"
      :text="$t('No course available')"
    />

    <v-row v-else class="g-4">
      <v-col
        v-for="course in visibleCourses"
        :key="course.id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <AppCard class="h-100" variant="outlined" rounded="lg" hover>
          <v-card-text class="pa-0">
            <CatalogueCourseCard
              :card-extra-fields="cardExtraFields"
              :course="course"
              :current-user-id="currentUserId"
              :show-title="showCourseTitle"
              @rate="onRatingChange"
              @subscribed="onUserSubscribed"
            />
          </v-card-text>
        </AppCard>
      </v-col>
    </v-row>

    <div v-if="loadingMore" class="text-center text-medium-emphasis py-4">
      {{ $t('Loading more courses...') }}
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AppCard from '~/components/App/AppCard.vue'
import { useNotification } from '~/composables/education/notification'
import { useLanguage } from '~/composables/education/language'
import { useSecurityStore } from '~/stores/securityStore'
import CatalogueCourseCard from '../../../components/education/course/CatalogueCourseCard.vue'
import * as userRelCourseVoteService from '../../../services/userRelCourseVoteService'

import { usePlatformConfig } from '~/stores/platformConfig'

import courseService from '../../../services/courseService'
import AdvancedCourseFilters from '../../../components/education/course/AdvancedCourseFilters.vue'

const { t } = useI18n()
const sortField = ref('title')

const natural = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})
const router = useRouter()
const securityStore = useSecurityStore()
const platformConfigStore = usePlatformConfig()
const courseCatalogueSettings = computed(() => {
  let raw = platformConfigStore.getSetting('catalog.course_catalog_settings')
  if (!raw || raw === false || raw === 'false') return {}
  try {
    if (typeof raw === 'string') raw = JSON.parse(raw)
    if (typeof raw.courses === 'object') return raw.courses
    return raw
  } catch (e) {
    console.error('Invalid catalogue settings format', e)
    return {}
  }
})

const isAnonymous = !securityStore.isAuthenticated
const isPrivilegedUser =
  securityStore.isAdmin ||
  securityStore.isTeacher ||
  securityStore.isHRM ||
  securityStore.isSessionAdmin

const allowCatalogueAccess = computed(() => {
  if (isAnonymous)
    return (
      platformConfigStore.getSetting('catalog.course_catalog_published') !==
      'false'
    )
  if (isPrivilegedUser) return true
  if (securityStore.isStudent)
    return (
      platformConfigStore.getSetting(
        'catalog.allow_students_to_browse_courses',
      ) !== 'false'
    )
  return false
})

if (!allowCatalogueAccess.value) {
  if (!securityStore.user?.id) {
    router.push({ name: 'Login' })
  } else if (securityStore.isStudent) {
    router.push({ name: 'Home' })
  } else {
    router.push({ name: 'Index' })
  }
  throw new Error('Catalogue access denied by settings')
}

const currentUserId = securityStore.user?.id ?? null
const status = ref(false)
const courses = ref([])
const filteredCourses = ref([])
const filters = ref({
  global: { value: null },
})

const rowsPerScroll = 9
const visibleCount = ref(rowsPerScroll)
const loadingMore = ref(false)

const extraFields = ref([])
const { showErrorNotification } = useNotification()
const { languageList } = useLanguage()
const languages = languageList

const loadExtraFields = async () => {
  try {
    const response = await fetch('/catalogue/course-extra-fields')
    if (!response.ok) throw new Error('Failed to load extra fields')
    extraFields.value = await response.json()
  } catch (error) {
    console.error('Error loading extra fields', error)
  }
}

const load = async () => {
  status.value = true
  try {
    courses.value = await courseService.loadCourseCatalogue()

    const ids = courses.value.map((c) => c.id).join(',')
    if (ids) {
      const res = await fetch(`/catalogue/course-extra-field-values?ids=${ids}`)
      const extraByCourse = await res.json()
      courses.value = courses.value.map((c) => ({
        ...c,
        extra_fields: extraByCourse[c.id] || {},
      }))
    }

    if (currentUserId) {
      const votes = await userRelCourseVoteService.getUserVotes({
        userId: currentUserId,
        urlId: window.access_url_id,
      })
      for (const vote of votes) {
        let courseId
        if (typeof vote.course === 'object' && vote.course !== null) {
          courseId = vote.course.id
        } else if (typeof vote.course === 'string') {
          courseId = parseInt(vote.course.split('/').pop())
        }
        const course = courses.value.find((c) => c.id === courseId)
        if (course) course.userVote = vote
      }
    }
  } catch (error) {
    showErrorNotification(error)
  } finally {
    status.value = false
  }
}

const standardSortOptions = computed(
  () => courseCatalogueSettings.value.standard_sort_options ?? {},
)
const extraSortOptions = computed(
  () => courseCatalogueSettings.value.extra_field_sort_options ?? {},
)

const allSortOptions = computed(() => {
  const standard = Object.entries(standardSortOptions.value).map(
    ([key, value]) => ({
      label: t(key.replace('point_info/', '')),
      value: key,
      order: value,
      type: 'standard',
    }),
  )
  const extra = Object.entries(extraSortOptions.value).map(([key, value]) => ({
    label: key,
    value: key,
    order: value,
    type: 'extra',
  }))
  return [...standard, ...extra]
})

const cardExtraFields = computed(() => {
  const allowed =
    courseCatalogueSettings.value.extra_fields_in_course_block ?? []
  return extraFields.value.filter((field) => allowed.includes(field.variable))
})

const showCourseTitle = computed(
  () => courseCatalogueSettings.value.hide_course_title !== true,
)

const showAdvancedSearch = ref(false)
const advancedPayload = ref({})
const advancedFormKey = ref(0)

function onAdvancedApply(payload) {
  advancedPayload.value = payload || {}
  applyAdvancedSearch()
}

function onAdvancedClear() {
  advancedPayload.value = {}
  applyAdvancedSearch()
}

function normalizeString(x) {
  return (x ?? '').toString().trim().toLowerCase()
}

function splitCandidates(str) {
  return normalizeString(str)
    .split(/[:;,\|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function optionLabelBy({ field, idOrValue }) {
  if (!field?.options?.length) return null
  const found = field.options.find(
    (o) =>
      String(o.id) === String(idOrValue) ||
      String(o.value) === String(idOrValue),
  )
  return found?.label ?? null
}

function optionLabelsForArray({ field, arr }) {
  const out = []
  for (const v of arr || []) {
    const lbl = optionLabelBy({ field, idOrValue: v })
    out.push(normalizeString(lbl ?? v))
  }
  return out
}

function matchesExtraField(course, field, payload) {
  const courseVal = course?.extra_fields?.[field.variable]
  if (courseVal == null) return false

  let courseTokens = []
  if (Array.isArray(courseVal)) {
    courseTokens = courseVal.map(normalizeString)
  } else if (typeof courseVal === 'object') {
    courseTokens = Object.values(courseVal).map(normalizeString)
  } else {
    courseTokens = splitCandidates(courseVal)
  }

  const tokensContain = (needle) =>
    courseTokens.some((token) => token.includes(normalizeString(needle)))

  const vt = field.value_type

  // SELECT or AUTOCOMPLETE SINGLE
  if (vt === 3 || vt === 6) {
    const val = payload[`extra_${field.variable}`]
    if (!val) return true
    const lbl = optionLabelBy({ field, idOrValue: val }) ?? val
    return tokensContain(lbl)
  }

  // SELECT MULTIPLE
  if (vt === 4 || vt === 7) {
    const val = payload[`extra_${field.variable}`]
    if (!val?.length) return true
    const labels = optionLabelsForArray({ field, arr: val })
    return labels.every((lbl) => tokensContain(lbl))
  }

  // DATE RANGE
  if (vt === 11 || vt === 19) {
    const from = payload[`extra_${field.variable}_from`]
    const to = payload[`extra_${field.variable}_to`]
    const valueStr = courseVal?.toString() ?? ''
    return (
      (!from || new Date(valueStr) >= new Date(from)) &&
      (!to || new Date(valueStr) <= new Date(to))
    )
  }

  // TAGS
  if (vt === 12) {
    const val = payload[`extra_${field.variable}`]
    if (!val?.length) return true
    const tags = splitCandidates(val)
    return tags.every((tag) => tokensContain(tag))
  }

  // DOUBLE SELECT
  if (vt === 21) {
    const l1 = payload[`extra_${field.variable}`]
    const l2 = payload[`extra_${field.variable}_second`]
    if (!l1 && !l2) return true
    const labels = [l1, l2]
      .filter(Boolean)
      .map((x) => optionLabelBy({ field, idOrValue: x }) ?? x)
    return labels.every((lbl) => tokensContain(lbl))
  }

  // TRIPLE SELECT
  if (vt === 27) {
    const l1 = payload[`extra_${field.variable}`]
    const l2 = payload[`extra_${field.variable}_second`]
    const l3 = payload[`extra_${field.variable}_third`]
    if (!l1 && !l2 && !l3) return true
    const labels = [l1, l2, l3]
      .filter(Boolean)
      .map((x) => optionLabelBy({ field, idOrValue: x }) ?? x)
    return labels.every((lbl) => tokensContain(lbl))
  }

  // DURATION
  if (vt === 28) {
    const sel = payload[`extra_${field.variable}`]
    if (!sel) return true
    return tokensContain(sel)
  }

  // Fallback (TEXT/INT/FLOAT/etc.)
  const val = payload[`extra_${field.variable}`]
  if (!val) return true
  return tokensContain(val)
}

function applyAdvancedSearch() {
  const keyword = normalizeString(filters.value.global.value)
  const adv = advancedPayload.value || {}

  filteredCourses.value = courses.value.filter((course) => {
    const matchesGlobal =
      !keyword ||
      normalizeString(course.title).includes(keyword) ||
      normalizeString(course.description).includes(keyword)

    const matchesTitle =
      !adv.title ||
      normalizeString(course.title).includes(normalizeString(adv.title))

    const advHasExtra = Object.keys(adv).some((k) => k.startsWith('extra_'))
    const matchesExtras = !advHasExtra
      ? true
      : extraFields.value.every((field) => {
          const present =
            adv.hasOwnProperty(`extra_${field.variable}`) ||
            adv.hasOwnProperty(`extra_${field.variable}_second`) ||
            adv.hasOwnProperty(`extra_${field.variable}_third`)
          return present ? matchesExtraField(course, field, adv) : true
        })

    return matchesGlobal && matchesTitle && matchesExtras
  })

  visibleCount.value = rowsPerScroll
}

const visibleCoursesBase = computed(() => {
  const hidePrivate =
    platformConfigStore.getSetting('catalog.course_catalog_hide_private') ===
    'true'
  const sortOpt = allSortOptions.value.find(
    (opt) => opt.value === sortField.value,
  )

  let list = filteredCourses.value.filter((course) => {
    const visibility = Number(course.visibility)
    if (visibility === 0 || visibility === 4) return false
    if (visibility === 1 && hidePrivate) return false
    return true
  })

  if (sortOpt) {
    const field = sortOpt.value
    const order = sortOpt.order

    list = list.slice().sort((a, b) => {
      let valA = null,
        valB = null

      if (sortOpt.type === 'standard') {
        if (field.startsWith('point_info/')) {
          const key = field.split('/')[1]
          valA = a.point_info?.[key] ?? 0
          valB = b.point_info?.[key] ?? 0
        } else if (field === 'count_users') {
          valA = a.users?.length ?? 0
          valB = b.users?.length ?? 0
        } else {
          valA = a[field] ?? ''
          valB = b[field] ?? ''
        }
      } else {
        valA = a.extra_fields?.[field] ?? ''
        valB = b.extra_fields?.[field] ?? ''
      }

      const cmp =
        typeof valA === 'string' || typeof valB === 'string'
          ? natural.compare(String(valA), String(valB))
          : valA < valB
            ? -1
            : valA > valB
              ? 1
              : 0

      return (
        cmp *
        (typeof order === 'number'
          ? order >= 0
            ? 1
            : -1
          : String(order).toLowerCase().startsWith('desc')
            ? -1
            : 1)
      )
    })
  } else {
    list = list
      .slice()
      .sort((a, b) =>
        natural.compare(String(a.title ?? ''), String(b.title ?? '')),
      )
  }

  return list
})

const visibleCourses = computed(() =>
  visibleCoursesBase.value.slice(0, visibleCount.value),
)
const totalVisibleCourses = computed(() => visibleCoursesBase.value.length)

function handleScroll() {
  if (loadingMore.value) return

  const threshold = 150
  const scrollTop = window.scrollY
  const viewportHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight

  if (scrollTop + viewportHeight + threshold >= fullHeight) {
    if (visibleCount.value < visibleCoursesBase.value.length) {
      loadingMore.value = true
      setTimeout(() => {
        visibleCount.value += rowsPerScroll
        loadingMore.value = false
      }, 400)
    }
  }
}

watch(
  () => filters.value.global.value,
  () => {
    visibleCount.value = rowsPerScroll
    applyAdvancedSearch()
  },
)

watch(sortField, () => {
  visibleCount.value = rowsPerScroll
})

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await loadExtraFields()
  await load()
  applyAdvancedSearch()
})

function clearFilter() {
  filters.value.global.value = null
  advancedPayload.value = {}
  advancedFormKey.value++
  visibleCount.value = rowsPerScroll
  applyAdvancedSearch()
}

const saveOrUpdateVote = async (course, value) => {
  try {
    const sessionId = 0
    const urlId = window.access_url_id
    const courseId = course.id
    const courseIri = `/api/courses/${courseId}`

    const existingVote = await userRelCourseVoteService.getUserVote({
      userId: currentUserId,
      courseId,
      sessionId,
      urlId,
    })

    if (existingVote?.['@id']) {
      const updated = await userRelCourseVoteService.updateVote({
        iri: existingVote['@id'],
        vote: value,
        sessionId,
        urlId,
      })

      course.userVote = { ...existingVote, vote: updated.vote }
    } else {
      course.userVote = await userRelCourseVoteService.saveVote({
        courseIri,
        userId: currentUserId,
        vote: value,
        sessionId,
        urlId,
      })
    }
  } catch (e) {
    showErrorNotification(e)
  }
}

function onRatingChange({ value, course }) {
  if (value > 0 && currentUserId) {
    saveOrUpdateVote(course, value)
  }
}

function onUserSubscribed({ courseId, newUser }) {
  const index = courses.value.findIndex((c) => c.id === courseId)
  if (index !== -1) {
    const oldCourse = courses.value[index]
    const updatedCourse = {
      ...oldCourse,
      subscribed: true,
      users: [...(oldCourse.users || []), newUser],
    }
    courses.value[index] = updatedCourse
    const filteredIndex = filteredCourses.value.findIndex(
      (c) => c.id === courseId,
    )
    if (filteredIndex !== -1) {
      filteredCourses.value[filteredIndex] = updatedCourse
    }
    applyAdvancedSearch()
    const redirectAfterSubscription =
      courseCatalogueSettings.value.redirect_after_subscription ??
      'course_catalog'
    if (redirectAfterSubscription === 'course_home') {
      router.push({ name: 'CourseHome', params: { id: courseId } })
    }
  }
}
</script>

<style scoped>
.catalogue-courses {
  width: 100%;
}
</style>
