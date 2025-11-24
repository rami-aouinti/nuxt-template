<template>
  <div>
    <Button :label="$t('Back')" icon="pi pi-chevron-left" @click="goBack" />
    <Toolbar
      v-if="item && isCurrentTeacher"
      :handle-delete="del"
      :handle-edit="editHandler"
    />

    <p v-if="item" class="text-lg">
      {{ item['title'] }}
    </p>

    <div v-if="item" class="flex flex-row">
      <div class="w-1/2">
        <div
          v-if="item.resourceNode.firstResourceFile"
          class="flex justify-center"
        >
          <div class="w-64">
            <v-img
              v-if="item.resourceNode.firstResourceFile.image"
              :src="item['contentUrl'] + '&w=300'"
              spinner-color="primary"
            />
            <span v-else-if="item.resourceNode.firstResourceFile.video">
              <video controls>
                <source :src="item['contentUrl']" />
              </video>
            </span>
            <span v-else>
              <v-btn :to="item['downloadUrl']" class="btn btn--primary">
                <v-icon icon="mdi-file-download" />
                {{ $t('Download file') }}
              </v-btn>
            </span>
          </div>
        </div>
        <div v-else class="flex justify-center">
          <v-icon icon="mdi-folder" />
        </div>
      </div>

      <span class="w-1/2">
        <v-markup-table>
          <tbody>
            <tr>
              <td>
                <strong>{{ $t('Author') }}</strong>
              </td>
              <td>
                {{ item['resourceNode'].creator.username }}
              </td>
              <td />
              <td />
            </tr>
            <tr>
              <td>
                <strong>{{ $t('Comment') }}</strong>
              </td>
              <td>
                {{ item['comment'] }}
              </td>
            </tr>
            <tr>
              <td>
                <strong>{{ $t('Created at') }}</strong>
              </td>
              <td>
                {{
                  item['resourceNode']
                    ? relativeDatetime(item['resourceNode'].createdAt)
                    : ''
                }}
              </td>
              <td />
            </tr>
            <tr>
              <td>
                <strong>{{ $t('Updated at') }}</strong>
              </td>
              <td>
                {{
                  item['resourceNode']
                    ? relativeDatetime(item['resourceNode'].updatedAt)
                    : ''
                }}
              </td>
              <td />
            </tr>
            <tr v-if="item.resourceNode.firstResourceFile">
              <td>
                <strong>{{ $t('File') }}</strong>
              </td>
              <td>
                <div>
                  <a :href="item['downloadUrl']" class="btn btn--primary">
                    <v-icon icon="mdi-file-download" />
                    {{ $t('Download file') }}
                  </a>
                </div>
              </td>
              <td />
            </tr>
          </tbody>
        </v-markup-table>

        <hr />
        <ShowLinks :item="item" />
      </span>
    </div>

    <Loading :visible="isLoading" />
  </div>
</template>

<script setup lang="ts">
import Loading from '../../../components/education/Loading.vue'
import Toolbar from '../../../components/education/Toolbar.vue'

import ShowLinks from '../../../components/education/resource_links/ShowLinks.vue'
import { useFormatDate } from '~/composables/education/formatDate'
import { useSecurityStore } from '~/stores/securityStore'
import { storeToRefs } from 'pinia'
import { useShowResource } from '~/composables/education/useShowResource'

definePageMeta({
  title: 'Personalfile Show',
})

const securityStore = useSecurityStore()
const { isAuthenticated, isAdmin, isCurrentTeacher } =
  storeToRefs(securityStore)
const { relativeDatetime } = useFormatDate()

const { item, isLoading, del, editHandler, goBack } = useShowResource({
  namespace: 'personalfile',
  servicePrefix: 'PersonalFile',
})
</script>
