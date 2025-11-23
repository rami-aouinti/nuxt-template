<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useCidReq } from '~/composables/cidReq.js'
import { useSecurityStore } from '~/stores/securityStore.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const { cid, sid, gid } = useCidReq()
const securityStore = useSecurityStore()

const isCurrentTeacher = securityStore.isCurrentTeacher

const menu = ref(null)

const menuItems = ref([])

const toggleCourseTMenu = (event) => {
  menu.value.toggle(event)
}
</script>
