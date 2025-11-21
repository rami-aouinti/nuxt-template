<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppCard from '~/components/App/AppCard.vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'
import { useCrmApi } from '~/composables/useCrmApi'
import type { CrmClient, CrmLabel } from '~/types/crm'

definePageMeta({
  title: 'navigation.crmClientCreate',
  middleware: 'auth',
})

const router = useRouter()
const localePath = useLocalePath()
const translate = useTranslateWithFallback()
const { jsonLdHeaders, withBase } = useCrmApi()

const crmStore = useCrmStore()
const clientCollection = crmStore.clients
const labelCollection = crmStore.labels

await Promise.all([clientCollection.fetch(), labelCollection.fetch()])

const form = reactive({
  name: '',
  description: '',
  labelIds: [] as number[],
})

const submitting = ref(false)

const labels = computed(() => labelCollection.data?.member ?? [])

const iriForLabel = (label: CrmLabel | number) => {
  const id = typeof label === 'number' ? label : label.id
  return `/labels/${id}`
}

async function submit() {
  if (!form.name.trim()) {
    Notify.error(
      translate('crm.client.create.missing', 'Veuillez renseigner un nom de client.'),
    )
    return
  }

  submitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      description: form.description || undefined,
      labels: form.labelIds.map(iriForLabel),
    }

    const created = await $fetch<CrmClient>(withBase('/clients'), {
      method: 'POST',
      headers: jsonLdHeaders.value,
      body: payload,
    })

    await crmStore.clients.refresh()
    Notify.success(
      translate('crm.client.create.success', 'Client créé avec succès.'),
    )

    router.push(localePath({ name: 'crm-client-id', params: { id: created.id } }))
  } catch (error) {
    console.error(error)
    Notify.error(
      translate('crm.client.create.error', 'Impossible de créer le client.'),
    )
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <v-container fluid class="py-8">
    <v-row class="mb-6">
      <v-col cols="12">
        <AppCard class="pa-6" elevation="3" hover>
          <div class="d-flex align-center justify-space-between flex-wrap gap-4">
            <div>
              <div class="text-h5 font-weight-bold mb-2">
                {{ translate('crm.client.create.title', 'Nouveau client') }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  translate(
                    'crm.client.create.subtitle',
                    'Enregistrez un client et reliez-lui vos projets et documents.',
                  )
                }}
              </div>
            </div>
            <v-btn :to="localePath({ name: 'crm-client' })" variant="text">
              <v-icon icon="mdi-chevron-left" start />
              {{ translate('crm.clients.back', 'Retour à la liste') }}
            </v-btn>
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" lg="6">
        <AppCard class="pa-6" elevation="2">
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="form.name"
              :label="translate('crm.client.name', 'Nom du client')"
              :placeholder="translate('crm.client.namePlaceholder', 'Entreprise ABC')"
              prepend-inner-icon="mdi-domain"
              class="mb-4"
              required
            />

            <v-textarea
              v-model="form.description"
              :label="translate('crm.client.description', 'Description')"
              :placeholder="translate('crm.client.descriptionPlaceholder', 'Notes internes, périmètre, contacts clés...')"
              auto-grow
              prepend-inner-icon="mdi-text-long"
              class="mb-4"
            />

            <v-select
              v-model="form.labelIds"
              :items="labels"
              item-title="name"
              item-value="id"
              multiple
              chips
              clearable
              :label="translate('crm.client.labels', 'Labels associés')"
              prepend-inner-icon="mdi-label-outline"
              :hint="translate('crm.client.labelsHint', 'Sélectionnez les labels et équipes liés à ce client.')"
              persistent-hint
              class="mb-6"
            />

            <div class="d-flex justify-end gap-3">
              <v-btn
                variant="outlined"
                color="secondary"
                :to="localePath({ name: 'crm-client' })"
              >
                {{ translate('common.cancel', 'Annuler') }}
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="submitting"
                :disabled="submitting"
              >
                <v-icon icon="mdi-content-save-outline" start />
                {{ translate('crm.client.create.submit', 'Créer le client') }}
              </v-btn>
            </div>
          </v-form>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
