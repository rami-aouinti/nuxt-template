<script setup lang="ts">
import { ref } from 'vue'

import SectionHeader from '../../../components/education/layout/SectionHeader.vue'
import BaseButton from '../../../components/education/basecomponents/BaseButton.vue'
import BaseToolbar from '../../../components/education/basecomponents/BaseToolbar.vue'
import BaseSelect from '../../../components/education/basecomponents/BaseSelect.vue'
import baseService from '../../../services/baseService'
import { findAll as listAccessUrl } from '../../../services/accessurlService'
import { useNotification } from '~/composables/education/notification.js'
import BaseAvatarList from '../../../components/education/basecomponents/BaseAvatarList.vue'
import BaseUserFinder from '../../../components/education/basecomponents/BaseUserFinder.vue'
import AppCard from '~/components/App/AppCard.vue'

definePageMeta({
  title: 'Accessurl Access Url Auth Sources Assign',
})

const { t } = useI18n()
const router = useRouter()

const { showErrorNotification, showSuccessNotification } = useNotification()

const accessUrlList = ref([])
const authSourceList = ref([])

const accessUrl = ref(null)
const authSource = ref(null)
const isLoadingAssign = ref(false)

const userFinder = ref({ selectedUsers: [] })

async function listAuthSourcesByAccessUrl({ value: accessUrlIri }) {
  authSourceList.value = []
  authSource.value = null

  try {
    const data = await baseService.get('/access-url/auth-sources/list', {
      access_url: accessUrlIri,
    })

    authSourceList.value = data.map((methodName) => ({
      label: methodName,
      value: methodName,
    }))
  } catch (error) {
    showErrorNotification(error)
  }
}

async function assignAuthSources() {
  isLoadingAssign.value = true

  try {
    await baseService.post(
      '/access-url/auth-sources/assign',
      {
        users: userFinder.value.selectedUsers.map(
          (userInfo) => userInfo['@id'],
        ),
        auth_source: authSource.value,
        access_url: accessUrl.value,
      },
      true,
    )

    showSuccessNotification(t('Auth sources assigned successfully'))

    userFinder.value.selectedUsers = []
  } catch (e) {
    showErrorNotification(e)
  } finally {
    isLoadingAssign.value = false
  }
}

listAccessUrl().then((items) => (accessUrlList.value = items))
</script>

<template>
  <SectionHeader :title="t('Assign auth sources to users')" />

  <div class="space-y-6">
    <BaseToolbar>
      <template #start>
        <BaseButton
          :title="t('Back to user assignment page')"
          icon="back"
          only-icon
          type="black"
          @click="router.back()"
        />
        <div class="text-sm text-gray-500">
          {{ t('Assign auth sources to users') }}
        </div>
      </template>
    </BaseToolbar>

    <div class="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <AppCard class="h-full" variant="elevated" elevation="2">
        <v-card-text class="space-y-4">
          <div class="text-body-2 text-medium-emphasis">
            {{ t('Assign auth sources to users') }}
          </div>
          <BaseUserFinder ref="userFinder" />
        </v-card-text>
      </AppCard>

      <AppCard class="h-full" variant="elevated" elevation="2">
        <v-card-text class="space-y-4">
          <BaseSelect
            id="access_url"
            v-model="accessUrl"
            :disabled="0 === accessUrlList.length"
            :label="t('Access URL')"
            :options="accessUrlList"
            option-label="url"
            option-value="@id"
            @change="listAuthSourcesByAccessUrl"
          />

          <BaseSelect
            id="auth_source"
            v-model="authSource"
            :disabled="0 === authSourceList.length"
            :label="t('Auth source')"
            :options="authSourceList"
          />

          <div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div class="text-sm font-medium mb-2">
              {{ t('Users') }}
            </div>
            <BaseAvatarList
              :count-several="userFinder.selectedUsers.length || 0"
              :users="userFinder.selectedUsers || []"
            />
          </div>

          <BaseButton
            class="w-full justify-center"
            :disabled="
              !accessUrl ||
              !authSource ||
              0 === userFinder.selectedUsers.length ||
              isLoadingAssign
            "
            :is-loading="isLoadingAssign"
            :label="t('Assign')"
            icon="save"
            type="primary"
            @click="assignAuthSources"
          />
        </v-card-text>
      </AppCard>
    </div>
  </div>
</template>
