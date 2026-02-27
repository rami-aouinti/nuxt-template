<script setup lang="ts">
import { ref } from 'vue'
import BaseCalendar from '~/components/education/basecomponents/BaseCalendar.vue'

definePageMeta({
  title: 'navigation.calendar',
  middleware: 'auth',
  icon: 'mdi-calendar-month-outline',
  drawerIndex: 2,
})

const { t } = useI18n()
const selectedDate = ref<Date | null>(new Date())
const selectedRange = ref<Date[] | null>(null)
</script>

<template>
  <v-container class="py-6" fluid>
    <v-row>
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6">
          <h1 class="text-h5 mb-2">{{ t('navigation.calendar') }}</h1>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Sélectionnez une date ou une période avec le composant Calendar.
          </p>

          <BaseCalendar
            id="calendar-single"
            v-model="selectedDate"
            :label="t('navigation.calendar')"
            class="mb-4"
          />

          <BaseCalendar
            id="calendar-range"
            v-model="selectedRange"
            :label="`${t('navigation.calendar')} (range)`"
            type="range"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
