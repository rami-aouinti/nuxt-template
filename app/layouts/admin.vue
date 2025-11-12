<script setup lang="ts">

const routeLoading = useRouteLoading()
</script>

<template>
  <v-app>
    <AppDrawer />
    <AppBar />
    <v-main>
      <div class="route-container">
        <div v-show="!routeLoading" class="route-container__page">
          <div class="page-surface">
            <div class="page-surface__inner">
              <slot />
            </div>
          </div>
        </div>
        <AppRouteLoader v-if="routeLoading" class="route-container__loader" />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
/* replace padding with margin to limit scrollbar in v-main */
.v-main {
  padding-top: 0;
  padding-bottom: 0;
  /* https://github.com/vuetifyjs/vuetify/issues/15202 */
  margin-top: 64px;
  margin-bottom: 0;
  height: calc(100vh - 64px);
  /* margin-top: var(--v-layout-top);
  margin-bottom: var(--v-layout-bottom);
  height: calc(100vh - var(--v-layout-top) - var(--v-layout-bottom)); */
  overflow-y: auto;
}

.route-container {
  position: relative;
  display: flex;
  height: 100%;
}

.route-container__page {
  flex: 1;
}

.route-container__loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* reuse transition defined in AppRouteLoader */
</style>
