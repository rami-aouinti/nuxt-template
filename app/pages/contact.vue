<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import AppCard from "~/components/ui/AppCard.vue";
import AppButton from "~/components/ui/AppButton.vue";

definePageMeta({
  title: 'navigation.contact',
})

const { t } = useI18n()

const formRef = ref<VForm | null>(null)
const isSubmitting = ref(false)
const submissionState = ref<'idle' | 'success' | 'error'>('idle')

const form = reactive({
  email: '',
  subject: '',
  message: '',
})

const rules = {
  required: (value: string) =>
    Boolean(value?.toString().trim()) ||
    t('pages.contact.form.validation.required'),
  email: (value: string) =>
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/.test(value) ||
    t('pages.contact.form.validation.email'),
}

const resetForm = () => {
  form.email = ''
  form.subject = ''
  form.message = ''
  submissionState.value = 'success'
  formRef.value?.resetValidation()
}

const submit = async () => {
  const result = await formRef.value?.validate()

  if (!result?.valid) {
    return
  }

  submissionState.value = 'idle'
  isSubmitting.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 600))
    resetForm()
  } catch {
    submissionState.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-drawer">
        <div class="text-center mb-2">
          <h3 class="text-h6 text-md-h5 font-weight-bold mb-2">
            {{ t('pages.contact.title') }}
          </h3>
          <p class="text-body-1 text-medium-emphasis">
            {{ t('pages.contact.subtitle') }}
          </p>
        </div>
      </teleport>
    </client-only>
    <client-only>
      <teleport to="#app-drawer-right">
        <v-card-text class="pb-0">
          <h2 class="text-h5 font-weight-medium mb-2">
            {{ t('pages.contact.location.title') }}
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('pages.contact.location.description') }}
          </p>
        </v-card-text>
        <div class="contact-map">
          <iframe
            title="Cologne office map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10073.69128472222!2d6.953101424907183!3d50.937531092939875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bf25a18c0fb5f7%3A0x427282c9b1a80a0!2sCologne%2C%20Germany!5e0!3m2!1sen!2sde!4v1700000000000!5m2!1sen!2sde"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </teleport>
    </client-only>
    <v-row justify="center">
      <v-col cols="12">
        <AppCard class="pa-3 flex-grow-1" elevation="2">
          <v-alert
            v-if="submissionState === 'success'"
            type="success"
            variant="tonal"
            class="mb-4"
            density="comfortable"
          >
            {{ t('pages.contact.form.status.success') }}
          </v-alert>
          <v-alert
            v-else-if="submissionState === 'error'"
            type="error"
            variant="tonal"
            class="mb-4"
            density="comfortable"
          >
            {{ t('pages.contact.form.status.error') }}
          </v-alert>

          <v-form ref="formRef" @submit.prevent="submit">
            <v-text-field
              v-model="form.subject"
              :label="t('pages.contact.form.fields.subject')"
              :rules="[rules.required]"
              autocomplete="off"
              class="mb-2"
              variant="outlined"
              rounded
            />
            <v-text-field
              v-model="form.email"
              :label="t('pages.contact.form.fields.email')"
              :rules="[rules.required, rules.email]"
              type="email"
              autocomplete="email"
              class="mb-2"
              variant="outlined"
              rounded
            />
            <v-textarea
              v-model="form.message"
              :label="t('pages.contact.form.fields.message')"
              :rules="[rules.required]"
              rows="5"
              auto-grow
              variant="outlined"
              rounded
            />
            <div class="d-flex justify-end mt-3">
              <AppButton
                color="primary"
                size="large"
                type="submit"
                :loading="isSubmitting"
              >
                {{ t('pages.contact.form.actions.submit') }}
              </AppButton>
            </div>
          </v-form>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.contact-map {
  position: relative;
  padding-bottom: 65%;
  height: 0;
}

.contact-map iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
