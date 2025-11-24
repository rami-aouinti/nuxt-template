<template>
  <v-container class="py-8">
    <AppCard class="mb-6" elevation="2">
      <v-card-text>
        <div class="d-flex flex-wrap justify-space-between align-start gap-4 mb-4">
          <div>
            <div class="text-h5 font-weight-bold mb-1">{{ $t('Session catalogue') }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ $t('Discover and join upcoming sessions.') }}
            </div>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-3 align-end">
            <v-chip color="primary" variant="tonal" prepend-icon="mdi-format-list-numbered">
              {{ $t('Total number of sessions') }}: {{ sessions?.length || 0 }}
            </v-chip>
            <v-chip color="secondary" variant="tonal" prepend-icon="mdi-filter-check">
              {{ $t('Matching sessions') }}: {{ filteredSessions.length }}
            </v-chip>
          </div>
        </div>

        <v-row class="align-end" dense>
          <v-col cols="12" md="3">
            <v-btn
              color="secondary"
              prepend-icon="mdi-filter-remove-outline"
              variant="tonal"
              block
              @click="clearFilter()"
            >
              {{ $t('Clear filter results') }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-if="activeSearchFields.length"
              v-model="filters.global.value"
              :label="$t('Search')"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3" class="text-sm-end">
            <div class="text-caption text-medium-emphasis" v-if="filters.global.value">
              {{ $t('Searching by') }}: {{ activeSearchFields.join(', ') }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </AppCard>

    <v-alert
      v-if="status"
      type="info"
      variant="tonal"
      class="mb-6"
      border="start"
      density="comfortable"
      :text="$t('Loading sessions. Please wait.')"
    />

    <v-alert
      v-else-if="!filteredSessions.length"
      type="warning"
      variant="tonal"
      class="mb-6"
      border="start"
      density="comfortable"
      :text="$t('No session available')"
    />

    <v-row v-else class="g-4">
      <v-col
        v-for="session in visibleSessions"
        :key="session.id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <AppCard class="h-100" variant="outlined" rounded="lg" hover>
          <v-card-text class="pa-0">
            <CatalogueSessionCard
              :session="session"
              @rate="onRatingChange"
              @subscribed="onSessionSubscribed"
            />
          </v-card-text>
        </AppCard>
      </v-col>
    </v-row>

    <div v-if="loadingMore" class="text-center text-medium-emphasis py-4">
      {{ $t('Loading more sessions...') }}
    </div>
  </v-container>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import axios from 'axios'
import AppCard from '~/components/App/AppCard.vue'
import CatalogueSessionCard from '../../../components/education/session/CatalogueSessionCard.vue'
import { useSecurityStore } from '~/stores/securityStore'
import * as userRelCourseVoteService from '../../../services/userRelCourseVoteService'

import { usePlatformConfig } from '~/stores/platformConfig'

definePageMeta({
  title: 'Course Catalogue Sessions',
  middleware: 'auth',
})

const router = useRouter()
const securityStore = useSecurityStore()

if (!securityStore.user?.id) {
  router.push({ name: 'Login' })
  throw new Error('No active session. Redirecting to login.')
}

const currentUserId = securityStore.user.id
const urlId = window.access_url_id
const status = ref(false)
const sessions = ref([])
const filters = ref({
  global: { value: null },
})
const rowsPerScroll = 9
const visibleCount = ref(rowsPerScroll)
const loadingMore = ref(false)
const platformConfigStore = usePlatformConfig()

const sessionCatalogSettings = computed(() => {
  const settings =
    platformConfigStore.getSetting('catalog.session_catalog_settings') || {}
  return settings.sessions || {}
})

function isEnabled(field) {
  return sessionCatalogSettings.value?.[field] === true
}

const activeSearchFields = computed(() => {
  const list = []
  if (isEnabled('by_title')) list.push('title')
  if (isEnabled('by_tag')) list.push('tag')
  if (isEnabled('by_date')) list.push('start date')
  return list
})

const saveOrUpdateVote = async (session, value) => {
  try {
    const sessionId = session.id
    const allVotes = await userRelCourseVoteService.getUserVotes({
      userId: currentUserId,
      urlId,
    })

    const existingVote = allVotes.find(
      (v) =>
        v.session &&
        parseInt(v.session.split('/').pop()) === sessionId &&
        (v.course === null || v.course === undefined),
    )

    if (existingVote?.['@id']) {
      const updated = await userRelCourseVoteService.updateVote({
        iri: existingVote['@id'],
        vote: value,
        sessionId,
        urlId,
      })
      session.userVote = { ...existingVote, vote: updated.vote }
    } else {
      session.userVote = await userRelCourseVoteService.saveVote({
        courseIri: null,
        userId: currentUserId,
        vote: value,
        sessionId,
        urlId,
      })
    }
  } catch (e) {
    console.error('Error saving/updating vote:', e)
  }
}

const onRatingChange = ({ value, session }) => {
  if (value > 0) {
    saveOrUpdateVote(session, value)
  }
}

const onSessionSubscribed = (sessionId) => {
  const session = sessions.value.find((s) => s.id === sessionId)
  if (session) {
    session.isSubscribed = true
  }
}

const fetchSessions = async () => {
  status.value = true
  try {
    const response = await axios.get('/sessions')
    sessions.value = response.data
    applySearch()
  } catch (e) {
    console.error('Error fetching sessions:', e)
  } finally {
    status.value = false
  }
}

const filteredSessions = ref([])

const matchesSearch = (session) => {
  const keyword = (filters.value.global.value || '').toString().toLowerCase()
  if (!keyword) return true

  const haystack = []
  if (isEnabled('by_title')) haystack.push(session.title)
  if (isEnabled('by_tag')) haystack.push(session.tags)
  if (isEnabled('by_date')) haystack.push(session.startDate)

  return haystack
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(keyword))
}

const applySearch = () => {
  filteredSessions.value = sessions.value.filter((s) => matchesSearch(s))
  visibleCount.value = rowsPerScroll
}

const visibleSessionsBase = computed(() => filteredSessions.value)

const visibleSessions = computed(() =>
  visibleSessionsBase.value.slice(0, visibleCount.value),
)

function handleScroll() {
  if (loadingMore.value) return

  const threshold = 150
  const scrollTop = window.scrollY
  const viewportHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight

  if (scrollTop + viewportHeight + threshold >= fullHeight) {
    if (visibleCount.value < visibleSessionsBase.value.length) {
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
    applySearch()
  },
)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await fetchSessions()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function clearFilter() {
  filters.value.global.value = null
  applySearch()
}
</script>
