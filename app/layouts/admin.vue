<script setup lang="ts">
const routeLoading = useRouteLoading()
</script>

<template>
  <v-app>
    <AppDrawer />
    <AppBar />
    <v-main>
      <AppRouteLoader v-if="routeLoading" class="admin-layout__loader" />
      <div v-else class="admin-layout__wrapper">
        <aside class="admin-layout__sidebar">
          <slot name="sidebar">
            <h2 class="admin-layout__sidebar-title">Administration</h2>
            <nav class="admin-layout__nav">
              <NuxtLink to="/admin" class="admin-layout__nav-link">Tableau de bord</NuxtLink>
              <NuxtLink to="/admin/users" class="admin-layout__nav-link">Utilisateurs</NuxtLink>
              <NuxtLink to="/admin/reports" class="admin-layout__nav-link">Rapports</NuxtLink>
            </nav>
          </slot>
        </aside>

        <section class="admin-layout__content">
          <header class="admin-layout__header">
            <slot name="header">
              <h1 class="admin-layout__title">Espace d'administration</h1>
            </slot>
          </header>

          <div class="admin-layout__body">
            <slot />
          </div>
        </section>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.admin-layout {
  position: relative;
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.08),
      rgba(var(--v-theme-secondary), 0.04)
    ),
    rgb(var(--v-theme-background));
}

.admin-layout__loader {
  position: absolute;
  inset: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-layout__wrapper {
  display: grid;
  grid-template-columns: minmax(220px, 280px) 1fr;
  gap: 24px;
  height: 100%;
}

.admin-layout__sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px 24px;
  border-radius: 28px;
  background: rgba(var(--v-theme-surface), 0.98);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.12);
}

.admin-layout__sidebar-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.admin-layout__nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-layout__nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 16px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.admin-layout__nav-link:hover,
.admin-layout__nav-link:focus-visible {
  background-color: rgba(var(--v-theme-primary), 0.12);
  transform: translateX(4px);
}

.admin-layout__nav-link.router-link-active {
  background-color: rgba(var(--v-theme-primary), 0.18);
  color: rgb(var(--v-theme-primary));
}

.admin-layout__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  border-radius: 32px;
  background: rgba(var(--v-theme-surface), 0.98);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.1);
}

.admin-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-layout__title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.admin-layout__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1280px) {
  .admin-layout {
    padding: 24px;
  }

  .admin-layout__wrapper {
    grid-template-columns: 1fr;
  }

  .admin-layout__sidebar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (max-width: 960px) {
  .admin-layout {
    padding: 16px;
  }

  .admin-layout__content {
    padding: 20px;
  }
}
</style>
