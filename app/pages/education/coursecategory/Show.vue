<template>
  <div>
    <Toolbar :handle-delete="del" :handle-edit="editHandler">
      <template #left>
        <v-toolbar-title v-if="item">{{ `${servicePrefix} ${item['@id']}` }}</v-toolbar-title>
      </template>
    </Toolbar>

    <br />

    <div v-if="item" class="table-coursecategory-show">
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>

              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>{{ $t('Name') }}</strong>
              </td>
              <td>
                {{ item['title'] }}
              </td>

              <td>
                <strong>{{ $t('Code') }}</strong>
              </td>
              <td>
                {{ item['code'] }}
              </td>
            </tr>

            <tr>
              <td>
                <strong>{{ $t('Description') }}</strong>
              </td>
              <td>
                {{ item['description'] }}
              </td>

              <td />
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <Loading :visible="isLoading" />
  </div>
</template>

<script setup lang="ts">
import Loading from '../../../components/education/Loading.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import { useShowResource } from '~/composables/education/useShowResource'

definePageMeta({
  title: 'Coursecategory Show',
  middleware: 'auth',
})

const servicePrefix = 'CourseCategory'

const { item, isLoading, del, editHandler } = useShowResource({
  namespace: 'coursecategory',
  servicePrefix,
})
</script>
