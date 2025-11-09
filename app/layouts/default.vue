<script setup lang="ts">
const routeLoading = useRouteLoading()
</script>

<template>
  <div class="default-layout">
    <AppDrawer />
    <AppBar />
    <v-main class="default-layout__main">
      <div class="route-container">
        <div v-show="!routeLoading" class="route-container__page">
          <div class="page-surface">
            <span class="floating-shape floating-shape--one" />
            <span class="floating-shape floating-shape--two" />
            <div class="page-surface__inner">
              <v-container fluid class="default-layout__container">
                <v-row justify="center">
                  <v-col cols="12" lg="10">
                    <v-card class="default-layout__card" elevation="2">
                      <div class="default-layout__card-content">
                        <slot />
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </div>
        </div>
        <AppRouteLoader v-if="routeLoading" class="route-container__loader" />
      </div>
    </v-main>
    <AppFooter />
  </div>
</template>

<style scoped>
.default-layout {
  display: contents;
}

.default-layout__main {
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 64px;
  margin-bottom: 32px;
  height: calc(100vh - 64px - 32px);
  overflow-y: auto;
  transition-property: padding;
}

.default-layout__container {
  padding-top: 32px;
  padding-bottom: 32px;
}

.default-layout__card {
  border-radius: 20px;
  overflow: hidden;
}

.default-layout__card-content {
  padding: 32px;
}

@media (max-width: 959px) {
  .default-layout__card-content {
    padding: 20px;
  }
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

.page-surface {
  position: relative;
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.page-surface__inner {
  position: relative;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  filter: blur(80px);
}

.floating-shape--one {
  width: 340px;
  height: 340px;
  background: linear-gradient(135deg, var(--v-theme-primary), transparent);
  top: 10%;
  left: 5%;
}

.floating-shape--two {
  width: 280px;
  height: 280px;
  background: linear-gradient(135deg, var(--v-theme-secondary), transparent);
  bottom: 8%;
  right: 8%;
}
</style>
