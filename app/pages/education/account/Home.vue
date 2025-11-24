<template>
  <div class="flex flex-col md:flex-row gap-4">
    <div class="md:basis-1/3 lg:basis-1/4 2xl:basis-1/6 flex flex-col">
      <UserProfileCard />
    </div>

    <div v-if="allowSocialTool" class="md:basis-2/3 lg:basis-3/4 2xl:basis-5/6">
      <SocialWall :hide-post-form="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, computed } from 'vue'
import UserProfileCard from '../../../components/education/social/UserProfileCard.vue'
import { useSocialInfo } from '~/composables/education/useSocialInfo.js'
import SocialWall from '../social/SocialWall.vue'
import { usePlatformConfig } from '~/stores/platformConfig'

definePageMeta({
  title: 'Account Home',
})

const platformConfigStore = usePlatformConfig()
const allowSocialTool = computed(
  () => platformConfigStore.getSetting('social.allow_social_tool') !== 'false',
)

const { user, isCurrentUser, groupInfo, isGroup, loadUser } = useSocialInfo()
provide('social-user', user)
provide('is-current-user', isCurrentUser)
provide('group-info', groupInfo)
provide('is-group', isGroup)

onMounted(loadUser)
</script>
