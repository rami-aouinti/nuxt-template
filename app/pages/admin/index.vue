<script setup lang="ts">
definePageMeta({
  title: 'Administration',
  icon: 'mdi-shield-account',
  drawerIndex: 6,
  middleware: 'admin',
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
</script>

<template>
  <v-container fluid class="py-8">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h5 font-weight-medium">
            Espace d'administration
          </v-card-title>
          <v-divider class="my-4" />
          <v-card-text class="text-body-1">
            <p>
              Bienvenue dans l'interface d'administration. Ici, vous pourrez
              gérer les paramètres sensibles de l'application et accéder aux
              fonctionnalités réservées aux administrateurs.
            </p>
            <p class="mb-0">
              Utilisez le menu latéral pour naviguer vers les sections qui vous
              sont dédiées.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
