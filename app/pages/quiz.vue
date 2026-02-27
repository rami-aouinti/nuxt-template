<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

definePageMeta({
  title: 'navigation.quiz',
  middleware: 'auth',
  icon: 'mdi-help-circle-outline',
  drawerIndex: 3,
})

const { t } = useI18n()

const questions = [
  {
    id: 'q1',
    label: 'Nuxt est basé sur quel framework frontend ?',
    options: ['Svelte', 'Vue', 'React'],
    answer: 'Vue',
  },
  {
    id: 'q2',
    label: 'Quelle commande permet de lancer le mode développement ?',
    options: ['pnpm dev', 'pnpm build', 'pnpm lint'],
    answer: 'pnpm dev',
  },
]

const responses = reactive<Record<string, string>>({})
const submitted = ref(false)

const score = computed(() =>
  questions.reduce(
    (total, question) =>
      total + (responses[question.id] === question.answer ? 1 : 0),
    0,
  ),
)

const onSubmit = () => {
  submitted.value = true
}
</script>

<template>
  <v-container class="py-6" fluid>
    <v-row>
      <v-col cols="12" md="8" lg="7">
        <v-card class="pa-6">
          <h1 class="text-h5 mb-2">{{ t('navigation.quiz') }}</h1>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Quiz rapide pour tester votre connaissance de la plateforme.
          </p>

          <div v-for="question in questions" :key="question.id" class="mb-6">
            <p class="font-weight-medium mb-2">{{ question.label }}</p>
            <v-radio-group v-model="responses[question.id]" hide-details>
              <v-radio
                v-for="option in question.options"
                :key="option"
                :label="option"
                :value="option"
              />
            </v-radio-group>
          </div>

          <v-btn color="primary" @click="onSubmit">Valider</v-btn>

          <v-alert v-if="submitted" class="mt-4" type="info" variant="tonal">
            Score: {{ score }} / {{ questions.length }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
