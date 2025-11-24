<template>
  <v-container class="py-8">
    <Toolbar :handle-delete="del" :handle-list="list">
      <template #left>
        <v-toolbar-title v-if="item">
          {{ `${servicePrefix} ${item['@id']}` }}
        </v-toolbar-title>
      </template>
    </Toolbar>

    <v-row class="mt-4" align="stretch" dense>
      <v-col cols="12" md="8">
        <AppCard class="pa-6" elevation="3" hover>
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <div class="text-caption text-uppercase text-primary mb-1">
                {{ t('Course overview') }}
              </div>
              <div class="text-h5 font-weight-bold">{{ item?.title || '-' }}</div>
              <div class="text-body-2 text-medium-emphasis">
                {{ t('Key identifiers and visibility information for this course.') }}
              </div>
            </div>
            <v-avatar color="primary" size="64" variant="tonal">
              <v-icon icon="mdi-school-outline" size="32" />
            </v-avatar>
          </div>

          <v-row>
            <v-col cols="12" md="6">
              <v-sheet border rounded="lg" class="pa-4" color="surface">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  {{ t('Code') }}
                </div>
                <div class="text-body-1 font-weight-medium">{{ item?.code || '-' }}</div>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <v-sheet border rounded="lg" class="pa-4" color="surface">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  {{ t('Language') }}
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ item?.courseLanguage || t('Not specified') }}
                </div>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <v-sheet border rounded="lg" class="pa-4" color="surface">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  {{ t('Category') }}
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ item?.category?.title || t('No category') }}
                </div>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <v-sheet border rounded="lg" class="pa-4" color="surface">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  {{ t('Visibility') }}
                </div>
                <v-chip color="primary" size="small" variant="tonal">
                  {{ item ? $n(item['visibility']) : '-' }}
                </v-chip>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <v-sheet border rounded="lg" class="pa-4" color="surface">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  {{ t('Department') }}
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ item?.departmentName || '-' }}
                </div>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <v-sheet border rounded="lg" class="pa-4" color="surface">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  {{ t('Department URL') }}
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ item?.departmentUrl || '-' }}
                </div>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <v-sheet border rounded="lg" class="pa-4" color="surface">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">
                  {{ t('Expiration date') }}
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ formattedExpiration }}
                </div>
              </v-sheet>
            </v-col>
          </v-row>
        </AppCard>
      </v-col>

      <v-col cols="12" md="4">
        <AppCard class="pa-5" elevation="2" hover>
          <div class="text-subtitle-1 font-weight-semibold mb-3">
            {{ t('Quick actions') }}
          </div>
          <div class="d-flex flex-column gap-3">
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              variant="tonal"
              block
              @click="editHandler"
            >
              {{ t('Edit course') }}
            </v-btn>
            <v-btn
              color="error"
              prepend-icon="mdi-delete"
              variant="tonal"
              block
              @click="del"
            >
              {{ t('Delete course') }}
            </v-btn>
            <v-btn
              color="secondary"
              prepend-icon="mdi-format-list-bulleted"
              variant="text"
              block
              @click="list"
            >
              {{ t('Back to list') }}
            </v-btn>
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <v-overlay :model-value="isLoading" class="align-center justify-center" persistent>
      <v-progress-circular color="primary" indeterminate size="64" />
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '~/components/App/AppCard.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import { useShowResource } from '~/composables/education/useShowResource'

const servicePrefix = 'Course'
const { t } = useI18n()

const { item, isLoading, del, editHandler, list, formatDateTime } =
  useShowResource({
    namespace: 'course',
    servicePrefix,
  })

const formattedExpiration = computed(() => {
  if (!item.value || !item.value['expirationDate']) return '-'
  return formatDateTime(item.value['expirationDate'], 'long')
})
</script>
