<template>
  <v-card class="facebook-post-card-skeleton" elevation="0" aria-hidden="true">
    <div class="facebook-post-card-skeleton__header">
      <v-skeleton-loader type="avatar" />
      <div class="facebook-post-card-skeleton__header-info">
        <v-skeleton-loader type="text" class="facebook-post-card-skeleton__line" />
        <v-skeleton-loader type="text" class="facebook-post-card-skeleton__line facebook-post-card-skeleton__line--short" />
      </div>
      <v-skeleton-loader type="button" class="facebook-post-card-skeleton__action" />
    </div>
    <div class="facebook-post-card-skeleton__body">
      <v-skeleton-loader type="heading" class="facebook-post-card-skeleton__line" />
      <v-skeleton-loader type="paragraph" class="facebook-post-card-skeleton__paragraph" />
    </div>
    <div class="facebook-post-card-skeleton__stats">
      <v-skeleton-loader type="chip" class="facebook-post-card-skeleton__chip" />
      <v-skeleton-loader type="actions" class="facebook-post-card-skeleton__actions" />
    </div>
  </v-card>
</template>

<style scoped>
.facebook-post-card-skeleton {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  border-radius: var(
    --blog-post-card-radius,
    var(--app-rounded, 18px)
  );
  box-shadow: var(
    --blog-post-card-shadow,
    var(--app-shadow, 0 10px 26px rgba(15, 23, 42, 0.14))
  );
  background: var(
    --blog-post-card-background,
    rgba(var(--blog-post-card-background-rgb, 255, 255, 255), 0.95)
  );
  padding-bottom: 12px;
}

.facebook-post-card-skeleton__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 0;
}

.facebook-post-card-skeleton__header-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.facebook-post-card-skeleton__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 20px;
  flex: 1;
}

.facebook-post-card-skeleton__stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
}

.facebook-post-card-skeleton__line :deep(.v-skeleton-loader__bone) {
  border-radius: 999px;
}

.facebook-post-card-skeleton__line--short :deep(.v-skeleton-loader__bone) {
  width: 60%;
}

.facebook-post-card-skeleton__paragraph :deep(.v-skeleton-loader__bone) {
  border-radius: 16px;
}

.facebook-post-card-skeleton__actions,
.facebook-post-card-skeleton__chip,
.facebook-post-card-skeleton__action {
  max-width: 140px;
}

.facebook-post-card-skeleton__actions :deep(.v-skeleton-loader__bone),
.facebook-post-card-skeleton__chip :deep(.v-skeleton-loader__bone),
.facebook-post-card-skeleton__action :deep(.v-skeleton-loader__bone) {
  border-radius: 999px;
}
</style>
