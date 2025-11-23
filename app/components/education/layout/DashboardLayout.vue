<template>
  <Topbar />
  <Sidebar v-if="securityStore.isAuthenticated" />
  <div
    :class="{ 'app-main--no-sidebar': !securityStore.isAuthenticated }"
    class="app-main"
  >
    <Breadcrumb v-if="showBreadcrumb" />
    <slot />
    <router-view />
  </div>
</template>

<script setup>
import Breadcrumb from "../Breadcrumb.vue"
import Topbar from "./Topbar.vue"
import Sidebar from "./Sidebar.vue"
import { useSecurityStore } from "../legacy/store/securityStore.js"

defineProps({
  showBreadcrumb: {
    type: Boolean,
    default: true,
  },
})

const securityStore = useSecurityStore()
</script>
