<template>
  <TopbarNotLoggedIn v-if="!securityStore.isAuthenticated" />
  <TopbarLoggedIn v-else :current-user="securityStore.user" />
</template>

<script setup lang="ts">
import TopbarLoggedIn from './TopbarLoggedIn.vue'
import TopbarNotLoggedIn from './TopbarNotLoggedIn.vue'
import { useSecurityStore } from '~/stores/securityStore.js'

const securityStore = useSecurityStore()
</script>
