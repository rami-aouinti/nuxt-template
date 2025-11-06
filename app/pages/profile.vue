<script setup lang="ts">
import { computed } from 'vue'
import type { AuthProfile } from '~/types/auth'

definePageMeta({
  title: 'Profile',
  middleware: 'auth',
})

const { session, user } = useUserSession()
const profileCache = useAuthProfileCache()

const profile = computed<AuthProfile | null>(() => {
  const sessionProfile = session.value?.profile
  if (sessionProfile && typeof sessionProfile === 'object') {
    return sessionProfile as AuthProfile
  }

  return profileCache.value
})

const displayName = computed(() => {
  if (!profile.value) return ''
  const firstName =
    typeof profile.value.firstName === 'string' ? profile.value.firstName.trim() : ''
  const lastName =
    typeof profile.value.lastName === 'string' ? profile.value.lastName.trim() : ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  return fullName || profile.value.username
})

const avatarUrl = computed(() => {
  const photo = profile.value?.photo
  if (typeof photo === 'string' && photo.trim().length > 0) {
    return photo
  }

  return user.value?.avatar_url ?? null
})

const initials = computed(() => {
  if (!profile.value) return ''

  const initialsFromNames = [profile.value.firstName, profile.value.lastName]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.trim()[0]?.toUpperCase())
    .filter(Boolean)
    .join('')

  if (initialsFromNames) {
    return initialsFromNames
  }

  return profile.value.username.slice(0, 2).toUpperCase()
})

const roles = computed(() => {
  const rawRoles = profile.value?.roles
  if (!Array.isArray(rawRoles)) {
    return [] as string[]
  }

  return rawRoles
    .filter((role): role is string => typeof role === 'string' && role.trim().length > 0)
    .map((role) => role.trim())
})
</script>

<template>
  <v-container fluid class="py-8">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-alert
          v-if="!profile"
          type="info"
          variant="tonal"
          class="ma-auto"
        >
          Aucune donnée de profil disponible. Connectez-vous pour consulter vos informations.
        </v-alert>

        <v-row v-else align="stretch">
          <v-col cols="12" md="4">
            <v-card class="pa-6" elevation="2">
              <v-row no-gutters class="align-center mb-4">
                <v-col cols="auto">
                  <v-avatar size="96" color="primary" class="elevation-2">
                    <v-img v-if="avatarUrl" :src="avatarUrl" alt="Photo de profil" />
                    <span v-else class="text-h4 font-weight-medium text-white">{{ initials }}</span>
                  </v-avatar>
                </v-col>
                <v-col>
                  <div class="text-h5 font-weight-medium">{{ displayName }}</div>
                  <div class="text-body-2 text-medium-emphasis">@{{ profile.username }}</div>
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="d-flex flex-column" style="row-gap: 12px;">
                <div>
                  <div class="text-caption text-medium-emphasis">Identifiant utilisateur</div>
                  <div class="text-subtitle-2 font-weight-medium">{{ profile.id }}</div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">Adresse e-mail</div>
                  <div class="text-subtitle-2 font-weight-medium">{{ profile.email }}</div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12">
                <v-card elevation="2">
                  <v-card-title>Informations personnelles</v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">Prénom</div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.firstName || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">Nom</div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.lastName || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">Nom d'utilisateur</div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.username }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">Adresse e-mail</div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.email }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card elevation="2">
                  <v-card-title>Rôles</v-card-title>
                  <v-divider />
                  <v-card-text>
                    <div v-if="roles.length" class="d-flex flex-wrap" style="gap: 8px;">
                      <v-chip
                        v-for="role in roles"
                        :key="role"
                        color="primary"
                        variant="tonal"
                        class="text-capitalize"
                      >
                        {{ role }}
                      </v-chip>
                    </div>
                    <p v-else class="text-body-2 text-medium-emphasis mb-0">
                      Aucun rôle attribué pour le moment.
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
