<template>
  <router-view></router-view>
</template>

<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useCidReq } from "../legacy/composables/cidReq.js"
import { useSecurityStore } from "../legacy/store/securityStore.js"

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
