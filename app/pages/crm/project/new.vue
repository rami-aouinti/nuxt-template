<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppCard from '~/components/App/AppCard.vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useCrmStore } from '~/stores/crm'
import { Notify } from '~/stores/notification'
import { useCrmApi } from '~/composables/useCrmApi'
import type { CrmProject, CrmProjectPayload } from '~/types/crm'

definePageMeta({
  title: 'navigation.crmProjectCreate',
  middleware: 'auth',
})

const router = useRouter()
const localePath = useLocalePath()
const translate = useTranslateWithFallback()
const { jsonLdHeaders, withBase } = useCrmApi()

const crmStore = useCrmStore()
const clientCollection = crmStore.clients
const statusCollection = crmStore.projectStatuses
const typeCollection = crmStore.projectTypes

await Promise.all([
  clientCollection.fetch(),
  statusCollection.fetch(),
  typeCollection.fetch(),
])

const form = reactive({
  name: '',
  clientId: null as number | null,
  statusId: null as number | null,
  typeId: null as number | null,
})

const submitting = ref(false)

const clients = computed(() => clientCollection.data?.member ?? [])
const statuses = computed(() => statusCollection.data?.member ?? [])
const types = computed(() => typeCollection.data?.member ?? [])

const iriFor = (resource: string, id: number | string | null | undefined) => {
  if (id == null) return undefined
  return `/${resource}/${id}`
}

async function submit() {
  if (!form.name.trim() || !form.clientId) {
    Notify.error(
      translate('crm.project.create.missing', 'Veuillez renseigner un nom et un client.'),
    )
    return
  }

  submitting.value = true
  try {
    const payload: CrmProjectPayload = {
      name: form.name.trim(),
      client: iriFor('clients', form.clientId),
      status: iriFor('project_statuses', form.statusId),
      type: iriFor('project_types', form.typeId),
    }

    const created = await $fetch<CrmProject>(withBase('/projects'), {
      method: 'POST',
      headers: jsonLdHeaders.value,
      body: payload,
    })

    await Promise.all([crmStore.projects.refresh(), crmStore.clients.refresh()])

    Notify.success(
      translate('crm.project.create.success', 'Projet créé avec succès.'),
    )

    router.push(
      localePath({ name: 'crm-project-id', params: { id: created.id } }),
    )
  } catch (error) {
    console.error(error)
    Notify.error(
      translate('crm.project.create.error', 'Impossible de créer le projet.'),
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
                {{ translate('crm.project.create.title', 'Nouveau projet') }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  translate(
                    'crm.project.create.subtitle',
                    'Créez un projet et reliez-le immédiatement à un client et un statut.',
                  )
                }}
              </div>
            </div>
            <v-btn :to="localePath({ name: 'crm-project' })" variant="text">
              <v-icon icon="mdi-chevron-left" start />
              {{ translate('crm.projects.back', 'Retour à la liste') }}
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
              :label="translate('crm.project.name', 'Nom du projet')"
              :placeholder="translate('crm.project.namePlaceholder', 'Refonte du site')"
              prepend-inner-icon="mdi-briefcase-outline"
              class="mb-4"
              required
            />

            <v-select
              v-model="form.clientId"
              :items="clients"
              item-title="name"
              item-value="id"
              :label="translate('crm.project.client', 'Client lié')"
              prepend-inner-icon="mdi-account-tie-outline"
              :hint="translate('crm.project.clientHint', 'Associez le projet à son client principal.')"
              persistent-hint
              class="mb-4"
              required
            />

            <v-select
              v-model="form.statusId"
              :items="statuses"
              item-title="name"
              item-value="id"
              :label="translate('crm.project.status', 'Statut du projet')"
              prepend-inner-icon="mdi-flag-outline"
              clearable
              class="mb-4"
            />

            <v-select
              v-model="form.typeId"
              :items="types"
              item-title="name"
              item-value="id"
              :label="translate('crm.project.type', 'Type de projet')"
              prepend-inner-icon="mdi-shape-outline"
              clearable
              class="mb-6"
            />

            <div class="d-flex justify-end gap-3">
              <v-btn
                variant="outlined"
                color="secondary"
                :to="localePath({ name: 'crm-project' })"
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
                {{ translate('crm.project.create.submit', 'Créer le projet') }}
              </v-btn>
            </div>
          </v-form>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>
