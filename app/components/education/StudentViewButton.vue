<template>
  <BaseToggleButton
    v-if="showButton"
    v-model="isStudentView"
    :off-label="t('Switch to student view')"
    :on-label="t('Switch to teacher view')"
    off-icon="eye-off"
    on-icon="eye-on"
    :onlyIcon="isOnlyIcon"
  />
</template>

<script setup>
import BaseToggleButton from "./basecomponents/BaseToggleButton.vue"
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { useI18n } from "vue-i18n"
import { usePlatformConfig } from "./legacy/store/platformConfig.js"
import { useCidReqStore } from "./legacy/store/cidReq.js"
import { useSecurityStore } from "./legacy/store/securityStore.js"
import permissionService from "./legacy/services/permissionService.js"
import { useUserSessionSubscription } from "./legacy/composables/userPermissions.js"

const emit = defineEmits(["change"])

const { t } = useI18n()
const platformConfigStore = usePlatformConfig()
const cidReqStore = useCidReqStore()
const securityStore = useSecurityStore()
const { isCoach } = useUserSessionSubscription()

const isStudentView = computed({
  async set(v) {
    try {
      const resp = await permissionService.toogleStudentView()
      const mode = (typeof resp === "string" ? resp : resp?.data || "").toString().toLowerCase()
      const desired = mode === "studentview"

      platformConfigStore.setStudentViewEnabled(desired)
      emit("change", desired)
    } catch (e) {
      console.warn("[SVB] toggle failed", e)
      platformConfigStore.setStudentViewEnabled(!platformConfigStore.isStudentViewActive)
      emit("change", platformConfigStore.isStudentViewActive)
    }
  },
  get() {
    return !!platformConfigStore.isStudentViewActive
  },
})

const showButton = computed(
  () =>
    securityStore.isAuthenticated &&
    cidReqStore.course &&
    (securityStore.isCourseAdmin || securityStore.isAdmin || isCoach.value) &&
    platformConfigStore.getSetting("course.student_view_enabled") === "true",
)

const windowSize = ref(window.innerWidth)

function updateSize() {
  windowSize.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener("resize", updateSize)
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateSize)
})

const isOnlyIcon = computed(() => windowSize.value <= 768)
</script>
