<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()
const config = useRuntimeConfig()
const { session, loggedIn } = useUserSession()

definePageMeta({
  title: 'My Courses variant',
  appCardLayout: false,
})
const route = useRoute('/education/courses/[id]')
const courseId = computed(() => Number(route.params.id))

// base URL (tu as déjà ça dans ton runtimeConfig)
const educationBaseUrl =
  config.public.educationApiBaseUrl || 'https://education.bro-world.org'

// récupère le token éducation depuis la session
const getEducationToken = () => {
  const secure = (session.value as any) ?? {}
  return (
    secure.educationToken ??
    secure.education_token ??
    secure.tokens?.education ??
    null
  )
}

// helper pour les headers
const buildHeaders = () => {
  const token = getEducationToken()
  return {
    accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// fetch des données du cours + tools
const { data, pending, error } = await useAsyncData(
  () => `education-course-${courseId.value}`,
  async () => {
    if (!courseId.value) {
      throw new Error('Invalid course id')
    }

    const headers = buildHeaders()

    const [course, tools] = await Promise.all([
      // 1) détails du cours
      $fetch<any>(`${educationBaseUrl}/api/courses/${courseId.value}`, {
        method: 'GET',
        headers,
        query: { sid: 0 },
      }),

      // 2) tools du cours
      $fetch<any>(`${educationBaseUrl}/api/c_tools`, {
        method: 'GET',
        headers,
        query: {
          cid: courseId.value,
          sid: 0,
          'order[position]': 'asc',
        },
      }),

      // 3) ici tu pourras ajouter une autre API si besoin
    ])

    return { course, tools }
  },
  {
    watch: [courseId, () => session.value],
  },
)

const course = computed(() => data.value?.course )
const tools = computed(() => data.value?.tools ?? [])

// teachers / category / language
const mainTeacher = computed(() => {
  const teacherRel = course.value?.teachers?.[0]
  return teacherRel?.user?.fullName ?? '—'
})

const categoryTitle = computed(
  () => course.value?.categories?.[0]?.title ?? '',
)

const categoryImgUrl = computed(
  () => course.value?.illustrationUrl ?? '',
)
const courseTitle = computed(
  () => course.value?.title ?? '',
)

const languageLabel = computed(() => {
  const lang = course.value?.courseLanguage || ''
  if (!lang) return ''
  // petit mapping simple, à améliorer si tu veux
  if (lang.startsWith('en')) return 'English'
  if (lang.startsWith('fr')) return 'French'
  if (lang.startsWith('de')) return 'German'
  return lang
})

// tools visibles seulement
const visibleTools = computed(() =>
  tools.value.filter((tool: any) => tool.visibility),
)
</script>

<template>
  <v-container fluid>

    <client-only>
      <teleport to="#app-drawer-right">
        <div class="animated-badge mb-4">
          <span class="animated-badge__pulse" />
          Course tools
        </div>
        <v-list density="compact" nav>
          <v-list-item
            class="animated-badge"
            v-for="tool in visibleTools"
            :key="tool.iid"
            :href="`https://education.bro-world.org${tool.url}`"
          >
            <template #prepend>
              <v-avatar size="32">
                <v-icon :icon="tool.tool.icon" />
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ tool.tool.titleToShow }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </teleport>
    </client-only>
    <div
      v-if="pending"
      class="d-flex justify-center my-8"
    >
      <v-progress-circular indeterminate />
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ error.message }}
    </v-alert>

    <v-alert
      v-else-if="!course"
      type="info"
      variant="tonal"
    >
      Course not found.
    </v-alert>
    <AppCard v-else variant="text">
      <div class="course-card-header">
            <span
              v-if="categoryTitle"
              class="course-badge category"
            >
              {{ categoryTitle }}
            </span>
        <span
          v-if="languageLabel"
          class="course-badge language"
        >
              {{ languageLabel }}
            </span>

        <v-img
          :src="categoryImgUrl"
          alt="Chamilo"
          class="course-card-logo"
        />
      </div>

      <v-card-text class="course-card-body">
        <h2 class="course-title">
          {{ courseTitle }}
        </h2>

        <p class="course-teacher">
          <span class="label">Teachers:</span>
          <span class="value">{{ mainTeacher }}</span>
        </p>

        <div class="course-rating">
          <v-rating
            :model-value="course.popularity ?? 0"
            length="5"
            density="compact"
            readonly
            size="small"
          />
        </div>

        <p class="course-meta">
          {{ course.popularity }} Vote | 0 Visits | Your vote
          [{{ course.popularity ?? 0 }}]
        </p>

        <p class="course-description">
          {{ course.description || 'No description available.' }}
        </p>

        <p class="course-expiration" v-if="course.expirationDate">
          Expires on:
          {{ new Date(course.expirationDate).toLocaleDateString() }}
        </p>
      </v-card-text>

      <v-card-actions class="course-card-footer">
        <v-btn
          color="primary"
          variant="flat"
          class="course-btn"
          :href="`https://education.bro-world.org/courses/${course.id}`"
          target="_blank"
        >
          <v-icon
            icon="mdi-open-in-new"
            size="18"
            class="mr-2"
          />
          Go to the course
        </v-btn>
      </v-card-actions>
    </AppCard>
  </v-container>
</template>

<style scoped>
.course-card {
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #fff;
}

.course-card-header {
  position: relative;
  background: #f2f5f7;
  padding: 24px 16px 40px;
  text-align: center;
}

.course-card-logo {
  max-width: 140px;
  opacity: 0.7;
}

.course-card-subtitle {
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #8a8f99;
}

.course-badge {
  position: absolute;
  top: 12px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  color: #fff;
}

.course-badge.category {
  left: 12px;
  background-color: #f97316;
}

.course-badge.language {
  right: 12px;
  background-color: #1e40af;
}

.course-card-body {
  padding: 16px 20px 8px;
}

.course-title {
  margin: 0 0 8px;
  font-size: 1.4rem;
  font-weight: 700;
}

.course-teacher {
  margin: 0 0 12px;
  font-size: 0.9rem;
}

.course-teacher .label {
  font-weight: 700;
}

.course-teacher .value {
  margin-left: 4px;
}

.course-rating {
  margin-bottom: 4px;
}

.course-meta {
  margin: 0 0 8px;
  font-size: 0.8rem;
  color: #6b7280;
}

.course-description {
  margin-top: 12px;
  font-size: 0.9rem;
}

.course-expiration {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #6b7280;
}

.course-card-footer {
  padding: 0 20px 16px;
}

.course-btn {
  border-radius: 999px;
  font-weight: 600;
  text-transform: none;
}

.tools-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
