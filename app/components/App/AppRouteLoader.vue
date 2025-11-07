<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const routeLoading = useRouteLoading()
</script>

<template>
  <transition name="fade-loader" mode="out-in">
    <div v-if="routeLoading" class="app-route-loader" v-bind="attrs">
      <AppLoader
        :model-value="routeLoading"
        title="Navigation en cours"
        subtitle="Nous préparons la prochaine page pour vous."
      >
        <div class="d-flex flex-column align-center ga-2">
          <v-chip variant="elevated" color="white" class="text-primary text-subtitle-2">
            <v-icon icon="mdi-compass" start />
            Votre tableau de bord arrive…
          </v-chip>
        </div>
      </AppLoader>
    </div>
  </transition>
</template>

<style scoped>
.fade-loader-enter-active,
.fade-loader-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.fade-loader-enter-from,
.fade-loader-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
