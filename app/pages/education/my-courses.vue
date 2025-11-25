<script setup lang="ts">
import { computed, reactive } from 'vue'
import { GET_COURSE_REL_USER } from '~/graphql/queries/CourseRelUser'
definePageMeta({
  title: 'My Courses',
  appCardLayout: false,
})
const { t } = useI18n()

const variables = reactive({
  user: '/api/users/1',
  first: 10,
  after: null as string | null,
})

const {
  data,
  pending: loadingCourses,
  error,
  refresh,
} = await useAsyncQuery(GET_COURSE_REL_USER, variables)

const courses = computed(() => data.value?.courseRelUsers?.edges ?? [])

const loadMore = async () => {
  const pageInfo = data.value?.courseRelUsers?.pageInfo
  if (!pageInfo?.hasNextPage) return

  variables.after = pageInfo.endCursor
  await refresh()
}
</script>

<template>
  <v-container fluid>
    <div class="d-flex justify-center my-6" v-if="loadingCourses">
      <v-progress-circular indeterminate />
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="my-4"
    >
      {{ error.message }}
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="edge in courses"
        :key="edge.cursor"
        cols="12"
        md="6"
      >
        <AppCard variant="text">
          <NuxtLink :to="`/education/courses/${edge.node.course._id}`">
          <v-img
            :src="edge.node.course.illustrationUrl"
            height="160"
            cover
          />
          </NuxtLink>
          <v-card-title>{{ edge.node.course.title }}</v-card-title>

          <v-card-text>
            <div>Time : {{ edge.node.course.duration ?? '—' }}</div>

            <div class="mt-3">
              <strong>Teacher :</strong>
              <div v-for="uEdge in edge.node.course.users.edges"
                   :key="uEdge.node.id">
                <div class="d-flex align-center">
                  <v-avatar size="32" class="mr-2">
                    <v-img :src="uEdge.node.user.illustrationUrl" />
                  </v-avatar>
                  <div>
                    {{ uEdge.node.user.fullName }}
                    ({{ uEdge.node.user.username }})
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </AppCard>
      </v-col>
    </v-row>

    <div class="d-flex justify-center my-4">
      <v-btn
        v-if="data?.courseRelUsers?.pageInfo?.hasNextPage"
        @click="loadMore"
      >
        Charger plus
      </v-btn>
    </div>
  </v-container>
</template>

<style scoped>

</style>

