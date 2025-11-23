<script setup lang="ts">
import PlatformLogo from './PlatformLogo.vue'
import Avatar from 'primevue/avatar'
import AccessUrlChooser from '../accessurl/AccessUrlChooser.vue'

import { useSecurityStore } from '~/stores/securityStore.js'

const securityStore = useSecurityStore()
</script>

<template>
  <div v-if="securityStore.isAuthenticated" class="app-topbar">
    <div class="app-topbar__start">
      <PlatformLogo />
    </div>
    <div class="app-topbar__end">
      <Avatar
        :image="securityStore.user.illustrationUrl"
        class="user-avatar"
        shape="circle"
        unstyled
      />
    </div>
  </div>

  <AccessUrlChooser />
</template>
