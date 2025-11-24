<template>
  <div class="max-w-lg">
    <BaseToolbar
      ><template #start
        ><h3 class="font-semibold">New folder</h3></template
      ></BaseToolbar
    >

    <BaseInputText
      id="catTitle"
      v-model="name"
      label="Category name"
      :form-submitted="submitted"
      :is-invalid="!name"
    />

    <div class="mt-2 text-sm text-gray-600">
      Area: <b>{{ area }}</b>
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <RouterLink :to="backTo"
        ><BaseButton type="black" icon="xmark" label="Cancel"
      /></RouterLink>
      <BaseButton
        type="primary"
        icon="check"
        label="Create category"
        @click="save"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import service from '../../../services/dropbox'
import BaseToolbar from '../../../components/education/basecomponents/BaseToolbar.vue'
import BaseInputText from '../../../components/education/basecomponents/BaseInputText.vue'
import BaseButton from '../../../components/education/basecomponents/BaseButton.vue'

definePageMeta({
  title: 'Dropbox Dropbox Category Create',
})

const route = useRoute()
const router = useRouter()
const area = route.query.area === 'received' ? 'received' : 'sent'
const name = ref('')
const submitted = ref(false)

const backTo = computed(() => ({
  name: area === 'sent' ? 'DropboxListSent' : 'DropboxListReceived',
  params: route.params,
}))

async function save() {
  submitted.value = true
  if (!name.value.trim()) return
  await service.createCategory({ title: name.value.trim(), area })
  router.push(backTo.value)
}
</script>
