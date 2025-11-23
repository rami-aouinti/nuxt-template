<template>
  <section
    :id="section.key"
    class="d-flex flex-column gap-6"
  >
    <div>
      <div class="text-subtitle-1 text-uppercase text-medium-emphasis">
        {{ section.title }}
      </div>
      <div class="text-body-1 text-medium-emphasis mt-1">
        {{ section.description }}
      </div>
    </div>

    <v-row dense>
      <v-col
        v-for="module in section.modules"
        :key="module.slug"
        cols="12"
        md="6"
        lg="4"
      >
        <EducationModuleCard :module="module" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import type { EducationSection } from '~/utils/education/modules'
import EducationModuleCard from './EducationModuleCard.vue'

defineProps<{
  section: EducationSection
}>()
</script>
