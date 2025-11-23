<template>
  <v-container class="py-8 py-sm-12" fluid>
    <v-breadcrumbs
      :items="breadcrumbs"
      class="px-0 mb-6"
    />

    <v-row>
      <v-col cols="12" lg="8">
        <v-card variant="outlined">
          <v-card-item>
            <v-chip
              class="mb-2"
              color="primary"
              label
              size="small"
              variant="tonal"
            >
              {{ module?.category }}
            </v-chip>
            <v-card-title class="text-h5 font-weight-bold">
              {{ module?.title }}
            </v-card-title>
            <v-card-subtitle class="text-body-2 text-medium-emphasis">
              {{ module?.summary }}
            </v-card-subtitle>
          </v-card-item>

          <v-divider />

          <v-card-text class="text-body-1">
            {{ module?.description }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4" class="d-flex flex-column gap-4">
        <EducationModuleHighlights :highlights="module?.highlights ?? []" />
        <EducationRelatedViews :views="module?.relatedViews ?? []" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import EducationModuleHighlights from '~/components/education/EducationModuleHighlights.vue'
import EducationRelatedViews from '~/components/education/EducationRelatedViews.vue'
import { educationSections, findEducationModule } from '~/utils/education/modules'

const route = useRoute()
const module = computed(() => findEducationModule(String(route.params.slug)))

if (!module.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Module education introuvable',
  })
}

const breadcrumbs = computed(() => {
  const section = educationSections.find((item) =>
    item.modules.some((entry) => entry.slug === module.value?.slug),
  )

  return [
    { title: 'Education', to: '/education' },
    section && { title: section.title, to: `/education#${section.key}` },
    { title: module.value?.title ?? '', disabled: true },
  ].filter(Boolean)
})

useHead({
  title: module.value?.title ?? 'Education',
  meta: [
    {
      name: 'description',
      content: module.value?.summary ?? '',
    },
  ],
})
</script>
