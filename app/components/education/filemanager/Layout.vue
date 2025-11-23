<template>
  <router-view></router-view>
</template>
<script setup>
import { onMounted, provide } from "vue"
import { useSocialInfo } from "../legacy/composables/useSocialInfo.js"

const { user, isCurrentUser, groupInfo, isGroup, loadUser } = useSocialInfo()

provide("social-user", user)
provide("is-current-user", isCurrentUser)
provide("group-info", groupInfo)
provide("is-group", isGroup)

onMounted(loadUser)
</script>
