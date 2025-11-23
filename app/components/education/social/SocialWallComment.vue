<template>
  <v-item>
    <v-item-section avatar top>
      <v-avatar>
        <img
          :src="comment.sender.illustrationUrl"
          class="h-12 w-12 border border-gray-25"
        />
      </v-avatar>
    </v-item-section>

    <v-item-section top>
      <v-item-label lines="1">
        <p class="text-weight-medium">{{ comment.sender.fullName }}</p>
      </v-item-label>
      <v-item-label v-html="comment.content" />
      <v-item-label :title="abbreviatedDatetime(comment.sendDate)" caption>
        <p class="small">{{ relativeDatetime(comment.sendDate) }}</p>
      </v-item-label>
    </v-item-section>

    <v-item-section side top>
      <WallActions
        :is-owner="isOwner"
        :social-post="comment"
        @post-deleted="onCommentDeleted(comment)"
      />
    </v-item-section>
  </v-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WallActions from './Actions.vue'
import { useFormatDate } from '~/composables/formatDate.js'
import { useSecurityStore } from '~/stores/securityStore.js'

const { abbreviatedDatetime, relativeDatetime } = useFormatDate()

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['comment-deleted'])

const securityStore = useSecurityStore()
const isOwner = computed(
  () => securityStore.user['@id'] === props.comment.sender['@id'],
)

function onCommentDeleted(eventComment) {
  emit('comment-deleted', eventComment)
}
</script>
