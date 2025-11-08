<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const translate = (key: string, fallback: string) => {
  const value = t(key)
  return value && value !== key ? value : fallback
}

const items = computed(() =>
  route.matched
    ?.filter((v) => v.path === route.path)[0]
    ?.children.filter((c) => c.path)
    .toSorted(
      (a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98),
    )
    .map((c) => ({
      title: c.meta?.title,
      to: localePath(c.name) ? c : `${route.path}/${c.path}`,
      prependIcon: c.meta?.icon,
      subtitle: c.meta?.subtitle,
    })),
)
</script>

<template>
  <v-container class="admin-index py-0">
    <section class="admin-index__hero glass-card pa-8 mb-10">
      <div class="admin-index__hero-content">
        <div class="animated-badge mb-4">
          <span class="animated-badge__pulse" />
          {{ translate('admin.dashboard.welcome', 'Centre de contrôle') }}
        </div>
        <h1 class="text-h4 text-md-h3 font-weight-bold mb-3">
          {{ translate('admin.dashboard.title', 'Gérez chaque espace en un clin d’œil') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis mb-6">
          {{
            translate(
              'admin.dashboard.subtitle',
              'Accédez rapidement aux sections clés de l’administration et suivez vos indicateurs.',
            )
          }}
        </p>
        <div class="admin-index__hero-stats">
          <div class="stat-card">
            <p class="text-caption text-medium-emphasis mb-1">{{ translate('admin.dashboard.sections', 'Sections') }}</p>
            <p class="text-h5 font-weight-semibold mb-0">{{ items?.length || 0 }}</p>
          </div>
          <div class="stat-card">
            <p class="text-caption text-medium-emphasis mb-1">{{ translate('admin.dashboard.activity', 'Activité') }}</p>
            <p class="text-h5 font-weight-semibold mb-0">{{ translate('admin.dashboard.updated', 'Mis à jour') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="page-section__header">
        <span class="section-eyebrow">{{ translate('admin.dashboard.sectionsTitle', 'Navigation rapide') }}</span>
        <h2 class="section-title">{{ translate('admin.dashboard.choose', 'Choisissez une section') }}</h2>
        <p class="section-subtitle">
          {{
            translate(
              'admin.dashboard.description',
              'Des cartes claires pour gérer vos utilisateurs, contenus et paramètres en toute simplicité.',
            )
          }}
        </p>
      </div>

      <v-row class="g-6">
        <v-col v-for="item in items" :key="item.title" cols="12" md="6" lg="4">
          <v-card class="admin-index__card h-100" elevation="0">
            <v-list-item
              v-bind="item"
              :ripple="false"
              class="py-6"
            />
          </v-card>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<style scoped>
.admin-index {
  position: relative;
  z-index: 1;
}

.admin-index__hero {
  display: grid;
  gap: 24px;
}

.admin-index__hero-content {
  max-width: 720px;
}

.admin-index__hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.admin-index__card {
  position: relative;
  border-radius: 24px;
  padding-inline: 8px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 36px rgba(25, 118, 210, 0.16);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.admin-index__card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(var(--v-theme-primary), 0.12);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.admin-index__card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 44px rgba(25, 118, 210, 0.22);
}

.admin-index__card:hover::after {
  opacity: 1;
}

.admin-index :deep(.v-list-item) {
  border-radius: 20px;
  background: transparent;
}

.admin-index :deep(.v-list-item__prepend .v-icon) {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(var(--v-theme-primary), 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (prefers-color-scheme: dark) {
  .admin-index__card {
    background: rgba(18, 18, 18, 0.85);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
  }

  .admin-index__hero {
    background: rgba(18, 18, 18, 0.8);
  }
}
</style>
