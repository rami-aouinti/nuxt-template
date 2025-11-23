<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { useSocialInfo } from '~/composables/useSocialInfo.js'

const { user, isCurrentUser, groupInfo, isGroup, loadUser } = useSocialInfo()

provide('social-user', user)
provide('is-current-user', isCurrentUser)
provide('group-info', groupInfo)
provide('is-group', isGroup)

onMounted(loadUser)
</script>
