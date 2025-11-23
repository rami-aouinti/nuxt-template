<template>
  <v-sheet class="pa-6 pa-sm-10 rounded-lg" color="primary" variant="tonal">
    <v-row class="align-center" no-gutters>
      <v-col cols="12" sm="8">
        <div class="d-flex flex-column gap-2">
          <div
            class="text-caption text-uppercase font-weight-semibold opacity-80"
          >
            {{ eyebrow }}
          </div>
          <div class="text-h4 text-sm-h3 font-weight-bold">
            {{ title }}
          </div>
          <div class="text-body-1 text-medium-emphasis">
            {{ subtitle }}
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="4" class="d-flex justify-sm-end mt-4 mt-sm-0">
        <v-btn
          color="primary"
          size="large"
          variant="elevated"
          @click="$emit('cta-click')"
        >
          {{ ctaLabel }}
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle: string
    ctaLabel?: string
  }>(),
  {
    eyebrow: 'Education',
    ctaLabel: 'Parcourir les modules',
  },
)

defineEmits<{ (event: 'cta-click'): void }>()
</script>
