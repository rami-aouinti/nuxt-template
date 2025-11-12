<script setup lang="ts">
import { ref } from 'vue'
import AppCard from "~/components/ui/AppCard.vue";
import AppList from "~/components/ui/AppList.vue";
import AppButton from "~/components/ui/AppButton.vue";
import AppMenu from "~/components/ui/AppMenu.vue";

const isModalOpen = ref(false)
const isMenuOpen = ref(false)

const shortcuts = [
  {
    title: 'Dashboard',
    subtitle: 'See high level metrics',
    prependIcon: 'mdi-view-dashboard-outline',
    value: 'dashboard',
  },
  {
    title: 'Projects',
    subtitle: 'Jump into active work',
    prependIcon: 'mdi-briefcase-outline',
    value: 'projects',
  },
  {
    title: 'Team',
    subtitle: 'Collaborate with teammates',
    prependIcon: 'mdi-account-multiple-outline',
    value: 'team',
  },
]

const menuItems = [
  {
    title: 'Profile',
    prependIcon: 'mdi-account-circle-outline',
    value: 'profile',
  },
  {
    title: 'Settings',
    prependIcon: 'mdi-cog-outline',
    value: 'settings',
  },
  {
    title: 'Sign out',
    prependIcon: 'mdi-logout',
    value: 'logout',
  },
]
</script>

<template>
  <section class="app-ui-showcase">
    <AppCard
      class="app-ui-showcase__card"
      title="Outils rapides"
      subtitle="Accédez immédiatement aux actions importantes"
      :shadow="true"
      hover
    >
      <template #default>
        <div class="app-ui-showcase__card-content">
          <p class="app-ui-showcase__description">
            Utilisez ces composants sur toutes vos pages pour assurer une expérience utilisateur cohérente et moderne.
          </p>
          <AppList :items="shortcuts" lines="two" density="comfortable" shadow />
        </div>
      </template>
      <template #actions>
        <div class="app-ui-showcase__actions">
          <AppButton color="primary" @click="isModalOpen = true">
            Ouvrir la modale
          </AppButton>
          <AppButton color="secondary" variant="tonal" prepend-icon="mdi-lightning-bolt">
            Action rapide
          </AppButton>
        </div>
      </template>
    </AppCard>

    <div class="app-ui-showcase__interactions">
      <AppMenu v-model="isMenuOpen" shadow>
        <template #activator="{ props }">
          <AppButton v-bind="props" color="primary" variant="outlined" append-icon="mdi-menu-down">
            Menu principal
          </AppButton>
        </template>
        <AppList :items="menuItems" nav density="compact" />
      </AppMenu>

      <AppModal v-model="isModalOpen" :shadow="true">
        <template #header>
          <div class="app-ui-showcase__modal-header">
            <h3>Modale d'exemple</h3>
            <AppButton variant="text" prepend-icon="mdi-close" @click="isModalOpen = false">
              Fermer
            </AppButton>
          </div>
        </template>
        <div class="app-ui-showcase__modal-body">
          <p>
            Cette modale démontre comment vous pouvez réutiliser le composant AppModal dans toutes vos pages avec un contenu
            personnalisé.
          </p>
          <AppButton block color="primary" prepend-icon="mdi-check" @click="isModalOpen = false">
            Compris
          </AppButton>
        </div>
      </AppModal>
    </div>
  </section>
</template>

<style scoped>
.app-ui-showcase {
  display: grid;
  gap: 24px;
  margin-top: 32px;
}

.app-ui-showcase__card {
  width: 100%;
}

.app-ui-showcase__card-content {
  display: grid;
  gap: 16px;
}

.app-ui-showcase__description {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.72);
}

.app-ui-showcase__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
}

.app-ui-showcase__interactions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.app-ui-showcase__modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 12px;
}

.app-ui-showcase__modal-header h3 {
  margin: 0;
}

.app-ui-showcase__modal-body {
  display: grid;
  gap: 16px;
  padding: 0 24px 24px;
}

@media (min-width: 960px) {
  .app-ui-showcase {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }

  .app-ui-showcase__interactions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
