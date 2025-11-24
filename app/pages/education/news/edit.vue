<script setup lang="ts">
definePageMeta({
  title: 'Edit news',
  appCardLayout: false,
})

const router = useRouter()
const { t } = useI18n()

type NewsItem = {
  id: number
  title: string
  content: string
  readMore: string | null
}

const { data, pending, error } = await useFetch<NewsItem[]>(
  'https://education.bro-world.org/news/list',
)

const form = reactive({
  title: '',
  language: 'All',
  content: '',
  start: '',
  roles: [] as string[],
  group: 'All',
  sendMail: false,
  sendTestMail: false,
})

watchEffect(() => {
  if (!data.value || !data.value.length) return
  const item = data.value[0]

  form.title = item.title
  form.content = item.content // HTML
  // à toi de mapper start, roles, group si l’API les retourne plus tard
})

const saving = ref(false)

const onSubmit = async () => {
  saving.value = true
  try {
    // TODO: ici tu mets ton vrai endpoint d’update
    // await $fetch('/api/news/edit', {
    //   method: 'POST',
    //   body: form,
    // })

    // pour l’instant on revient sur la liste
    router.push('/news')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer-right">
        <div class="animated-badge mb-4">
          <span class="animated-badge__pulse" />
          {{ t('pages.education.navigation.title') }}
        </div>
        <v-select
          v-model="form.language"
          density="compact"
          label="Language"
          :items="['All', 'English', 'French', 'German']"
        />
        <v-text-field
          v-model="form.start"
          density="compact"
          label="* Start"
          type="datetime-local"
        />
        <v-select
          v-model="form.roles"
          density="compact"
          label="* Roles"
          multiple
          :items="[
            'Anonymous',
            'Admin',
            'Global admin',
            'Human Resources Manager',
            'Invitee',
            'Question manager',
            'Session administrator',
            'Learner',
          ]"
        />
        <v-select
          v-model="form.group"
          density="compact"
          label="Announcement for a group"
          :items="['All', 'Group 1', 'Group 2']"
        />
        <v-checkbox
          v-model="form.sendMail"
          density="compact"
          label="Send mail"
        />
        <v-checkbox
          v-model="form.sendTestMail"
          density="compact"
          label="Send an email to myself"
        />
      </teleport>
    </client-only>
    <AppCard variant="text">
      <v-card-title class="text-h5"> Edit News </v-card-title>

      <v-divider />

      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model="form.title"
            label="* Title"
            required
            class="mb-2"
          />

          <v-textarea
            v-model="form.content"
            label="* Content"
            auto-grow
            rows="8"
            class="mb-4"
          />

          <div class="mt-6">
            <v-btn type="submit" color="primary" :loading="saving">
              Edit News
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </AppCard>
  </v-container>
</template>
