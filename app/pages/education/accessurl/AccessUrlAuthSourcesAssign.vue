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

  <BaseToolbar>
    <template #start>
      <BaseButton
        :title="t('Back to user assignment page')"
        icon="back"
        only-icon
        type="black"
        @click="router.back()"
      />
    </template>
  </BaseToolbar>

  <div class="grid grid-flow-row-dense md:grid-cols-5 gap-4">
    <div class="md:col-span-3">
      <BaseUserFinder ref="userFinder" />
    </div>

    <div class="md:col-span-2">
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

      <div class="field">
        <BaseAvatarList
          :count-several="userFinder.selectedUsers.length || 0"
          :users="userFinder.selectedUsers || []"
        />
      </div>

      <BaseButton
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
    </div>
  </div>
</template>
