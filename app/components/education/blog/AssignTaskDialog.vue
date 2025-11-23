<template>
  <BaseDialog
    v-model:is-visible="visible"
    :title="t('Assign task')"
    header-icon="account-plus"
    :width="'560px'"
  >
    <div class="space-y-3">
      <BaseSelect
        v-model="taskId"
        :options="tasks"
        option-label="title"
        option-value="id"
        :placeholder="t('Select a task')"
        label=""
      />
      <BaseSelect
        v-model="userId"
        :options="members"
        option-label="name"
        option-value="id"
        :placeholder="t('Select a user')"
        label=""
      />
      <div>
        <label class="text-sm block mb-1">{{ t('Target date') }}</label>
        <input v-model="date" type="date" class="border rounded px-2 py-1" />
      </div>
      <div class="flex justify-end gap-2">
        <BaseButton
          type="black"
          icon="close"
          :label="t('Cancel')"
          @click="close"
        />
        <BaseButton
          type="primary"
          icon="check"
          :label="t('Assign')"
          :disabled="!canSubmit"
          :is-loading="saving"
          @click="submit"
        />
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import service from '~/services/blogs.js'
import BaseButton from '../basecomponents/BaseButton.vue'
import BaseSelect from '../basecomponents/BaseSelect.vue'
import BaseDialog from '../basecomponents/BaseDialog.vue'

const { t } = useI18n()
const props = defineProps({
  blogId: { type: Number, required: true },
  tasks: { type: Array, default: () => [] },
  members: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'assigned'])
const visible = ref(true)
const taskId = ref(null)
const userId = ref(null)
const date = ref(new Date().toISOString().slice(0, 10))
const saving = ref(false)
const canSubmit = computed(
  () => !!taskId.value && !!userId.value && !!date.value,
)

function close() {
  visible.value = false
  emit('close')
}
async function submit() {
  if (!canSubmit.value) return
  saving.value = true
  try {
    await service.assignTask({
      blogId: props.blogId,
      taskId: taskId.value,
      userId: userId.value,
      targetDate: date.value,
    })
    emit('assigned')
    close()
  } finally {
    saving.value = false
  }
}
</script>
