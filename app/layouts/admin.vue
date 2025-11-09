<script setup lang="ts">
const routeLoading = useRouteLoading()
</script>

<template>
  <div class="admin-layout">
    <AppBar />
    <div class="admin-layout__body">
      <AppSidebar />
      <v-main class="admin-layout__main">
        <div class="admin-layout__content">
          <div v-show="!routeLoading" class="admin-layout__page">
            <v-container fluid class="admin-layout__container">
              <v-row>
                <v-col cols="12">
                  <slot />
                </v-col>
              </v-row>
            </v-container>
          </div>
          <AppRouteLoader v-if="routeLoading" class="admin-layout__loader" />
        </div>
      </v-main>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.admin-layout {
  display: contents;
}

.admin-layout__body {
  display: flex;
  height: 100%;
}

.admin-layout__main {
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 64px;
  margin-bottom: 32px;
  height: calc(100vh - 64px - 32px);
  overflow-y: auto;
  flex: 1;
}

.admin-layout__content {
  position: relative;
  height: 100%;
}

.admin-layout__page {
  min-height: 100%;
}

.admin-layout__loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-layout__container {
  padding-top: 32px;
  padding-bottom: 32px;
}
</style>
