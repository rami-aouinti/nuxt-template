<template>
  <MessageForm
    :content="message.content"
    :receivers-to="message.receiversTo"
    :title="message.title"
    @submit="onSubmit"
  />
  <Loading :visible="isLoading || isLoadingUser" />
</template>

<script setup lang="ts">
import MessageForm from '../../../components/education/message/Form.vue'
import Loading from '../../../components/education/Loading.vue'
import { onMounted, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import userService from '../../../services/userService'
import { useNotification } from '~/composables/education/notification'
import { capitalize } from 'lodash'
import { useSecurityStore } from '~/stores/securityStore'
import { messageService } from '../../../services/message'

definePageMeta({
  title: 'Message Message Create',
  middleware: 'auth',
})

const securityStore = useSecurityStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const notification = useNotification()

const message = ref({
  title: '',
  content: '',
  receiversTo: [],
})

const isLoading = ref(false)

const onSubmit = async (messageToSend) => {
  if (!messageToSend.receivers || messageToSend.receivers.length === 0) {
    notification.showErrorNotification('You must add at least one recipient.')
    return
  }

  isLoading.value = true

  try {
    await messageService.create(messageToSend)
    notification.showSuccessNotification('Message sent successfully.')
  } catch (error) {
    notification.showErrorNotification(
      error.message || 'Error sending message.',
    )
  } finally {
    isLoading.value = false
  }

  await router.push({
    name: 'MessageList',
    query: route.query,
  })
}

const isLoadingUser = ref(false)

onMounted(async () => {
  if (route.query.send_to_user) {
    isLoadingUser.value = true

    try {
      const user = await userService.findById(route.query.send_to_user)
      message.value.receiversTo = [user]

      if (route.query.prefill) {
        const prefill = capitalize(route.query.prefill)

        message.value.title = t(prefill + 'Title')
        message.value.content = t(prefill + 'Content', [
          user.firstname,
          securityStore.user.firstname,
          securityStore.user.firstname,
        ])
      }
    } catch (error) {
      notification.showErrorNotification(error)
    } finally {
      isLoadingUser.value = false
    }
  }
})
</script>
