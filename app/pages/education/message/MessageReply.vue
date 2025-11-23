<template>
  <MessageForm
    v-if="replyMessage"
    :content="replyMessage.content"
    :receivers-cc="replyMessage.receiversCc"
    :receivers-to="replyMessage.receiversTo"
    :title="replyMessage.title"
    @submit="onReplyMessageForm"
  />
  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { ref } from 'vue'
import MessageForm from '../../../components/education/message/Form.vue'
import Loading from '../../../components/education/Loading.vue'
import isEmpty from 'lodash/isEmpty'
import { useRoute, useRouter } from 'vue-router'
import { MESSAGE_TYPE_INBOX } from '../../constants/entity/message'

import { useSecurityStore } from '~/stores/securityStore'
import { useNotification } from '~/composables/education/notification'
import { useFormatDate } from '~/composables/education/formatDate'
import userService from '../../../services/userService'

const store = useStore()
const securityStore = useSecurityStore()
const route = useRoute()
const router = useRouter()

const { t } = useI18n()
const notification = useNotification()

const { abbreviatedDatetime } = useFormatDate()

const id = isEmpty(route.params.id) ? route.query.id : route.params.id

const replyAll = '1' === route.query.all

const originalMessage = ref(null)
const originalSenderInfo = ref(null)

function filterReceiver(messageRelUser) {
  // Dont' add original sender.
  if (originalMessage.value.sender['@id'] === messageRelUser.receiver['@id']) {
    return false
  }

  // Don't add the current user.
  if (securityStore.user['@id'] === messageRelUser.receiver['@id']) {
    return false
  }

  return true
}

const replyMessage = ref({})

store.dispatch('message/load', id).then((messagePayload) => {
  originalMessage.value = messagePayload

  userService
    .find(messagePayload.sender['@id'])
    .then((senderPayload) => {
      originalSenderInfo.value = senderPayload

      setReplyMessage()
    })
    .finally(() => (isLoading.value = false))
})

function setReplyMessage() {
  const sendDate = abbreviatedDatetime(originalMessage.value.sendDate)
  const senderFullName = originalSenderInfo.value.fullName
  const sendeEmail = originalSenderInfo.value.email

  const replyHeader = t('Email reply header', [
    sendDate,
    senderFullName,
    `<a href="mailto:${sendeEmail}">${sendeEmail}</a>`,
  ])

  replyMessage.value = {
    receiversTo: [],
    receiversCc: [],
    msgType: MESSAGE_TYPE_INBOX,
    title: t('Re:') + ' ' + originalMessage.value.title,
    content: `<br /><br /><hr /><blockquote>${replyHeader}<hr />${originalMessage.value.content}</blockquote>`,
    attachments: [],
  }

  if (replyAll) {
    replyMessage.value.receiversTo = originalMessage.value.receiversTo
      .filter(filterReceiver)
      .map((messageRelUser) => messageRelUser.receiver)

    replyMessage.value.receiversCc = originalMessage.value.receiversCc
      .filter(filterReceiver)
      .map((messageRelUser) => messageRelUser.receiver)
  }

  replyMessage.value.receiversTo.push(originalMessage.value.sender)
}

const isLoading = ref(true)

async function onReplyMessageForm(messageToSend) {
  isLoading.value = true

  try {
    await store.dispatch('message/create', messageToSend)

    notification.showSuccessNotification('Message sent')

    await router.push({
      name: 'MessageList',
    })
  } catch (e) {
    notification.showErrorNotification(e)
  } finally {
    isLoading.value = false
  }
}
</script>
