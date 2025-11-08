<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  title: 'navigation.help',
})

const { t } = useI18n()

const explanation = computed(() => ({
  title: t('pages.help.explanation.title'),
  description: t('pages.help.explanation.description'),
  highlights: [
    t('pages.help.explanation.highlights.workspace'),
    t('pages.help.explanation.highlights.collaboration'),
    t('pages.help.explanation.highlights.support'),
  ],
}))

const sections = computed(() => [
  {
    icon: 'mdi-book-open-page-variant',
    title: t('pages.help.sections.guides.title'),
    description: t('pages.help.sections.guides.description'),
  },
  {
    icon: 'mdi-comment-question-outline',
    title: t('pages.help.sections.faq.title'),
    description: t('pages.help.sections.faq.description'),
  },
  {
    icon: 'mdi-account-group-outline',
    title: t('pages.help.sections.community.title'),
    description: t('pages.help.sections.community.description'),
  },
])

const questions = computed(() => ({
  title: t('pages.help.questions.title'),
  items: [
    {
      question: t('pages.help.questions.items.accountAccess.question'),
      answer: t('pages.help.questions.items.accountAccess.answer'),
    },
    {
      question: t('pages.help.questions.items.inviteTeam.question'),
      answer: t('pages.help.questions.items.inviteTeam.answer'),
    },
    {
      question: t('pages.help.questions.items.getSupport.question'),
      answer: t('pages.help.questions.items.getSupport.answer'),
    },
  ],
}))

const contact = computed(() => ({
  title: t('pages.help.contact.title'),
  description: t('pages.help.contact.description'),
}))
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h4 font-weight-bold pb-2">
            {{ t('pages.help.title') }}
          </v-card-title>
          <v-card-subtitle class="text-body-1 pb-6">
            {{ t('pages.help.subtitle') }}
          </v-card-subtitle>
          <v-divider class="mb-6" />
          <section class="mb-8">
            <h2 class="text-h5 font-weight-semibold mb-3">
              {{ explanation.title }}
            </h2>
            <p class="text-body-1 mb-4">
              {{ explanation.description }}
            </p>
            <ul class="text-body-1 pl-6 mb-0">
              <li v-for="point in explanation.highlights" :key="point" class="mb-2">
                {{ point }}
              </li>
            </ul>
          </section>
          <v-divider class="mb-6" />
          <v-row dense class="mb-4">
            <v-col
              v-for="section in sections"
              :key="section.title"
              cols="12"
              sm="4"
              class="d-flex"
            >
              <v-sheet elevation="1" rounded="lg" class="pa-4 flex-grow-1">
                <div class="d-flex align-center mb-3">
                  <v-icon :icon="section.icon" size="32" class="mr-3 text-primary" />
                  <h2 class="text-h6 font-weight-medium mb-0">
                    {{ section.title }}
                  </h2>
                </div>
                <p class="text-body-1 mb-0">
                  {{ section.description }}
                </p>
              </v-sheet>
            </v-col>
          </v-row>
          <v-divider class="mb-6" />
          <section class="mb-6">
            <h2 class="text-h5 font-weight-semibold mb-3">
              {{ questions.title }}
            </h2>
            <v-expansion-panels variant="accordion">
              <v-expansion-panel
                v-for="item in questions.items"
                :key="item.question"
              >
                <v-expansion-panel-title>
                  {{ item.question }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  {{ item.answer }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </section>
          <v-alert
            class="mt-6"
            type="success"
            variant="tonal"
            rounded="lg"
          >
            <strong class="d-block mb-1">{{ contact.title }}</strong>
            <span>{{ contact.description }}</span>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
