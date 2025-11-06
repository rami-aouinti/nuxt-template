<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'
import type { AuthProfile } from '~/types/auth'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'Profile',
  middleware: 'auth',
})

const { session, user, fetch: refreshSession } = useUserSession()
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
    typeof profile.value.firstName === 'string'
      ? profile.value.firstName.trim()
      : ''
  const lastName =
    typeof profile.value.lastName === 'string'
      ? profile.value.lastName.trim()
      : ''
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
    .filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0,
    )
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
    .filter(
      (role): role is string =>
        typeof role === 'string' && role.trim().length > 0,
    )
    .map((role) => role.trim())
})

type ProfileForm = {
  firstName: string
  lastName: string
  title: string
  description: string
  gender: string
  phone: string
  address: string
  birthday: string
}

const editDialog = ref(false)
const isSaving = ref(false)
const formError = ref('')
const photoFiles = ref<File[] | File | null>(null)
const selectedFile = ref<File | null>(null)

const form = reactive<ProfileForm>({
  firstName: '',
  lastName: '',
  title: '',
  description: '',
  gender: '',
  phone: '',
  address: '',
  birthday: '',
})

function getProfileStringValue(current: AuthProfile | null, key: string) {
  if (!current) return ''
  const value = current[key as keyof AuthProfile]
  return typeof value === 'string' ? value : ''
}

function formatDateForInput(value: unknown) {
  if (!value) return ''
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed
    }
    const date = new Date(trimmed)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10)
    }
  }

  return ''
}

function formatDateForDisplay(value: unknown) {
  if (!value) return ''
  const dateValue =
    value instanceof Date ? value : new Date(String(value).trim())
  if (!Number.isNaN(dateValue.getTime())) {
    return dateValue.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }
  return typeof value === 'string' ? value : ''
}

function resetFormFromProfile(current: AuthProfile | null) {
  form.firstName = getProfileStringValue(current, 'firstName')
  form.lastName = getProfileStringValue(current, 'lastName')
  form.title = getProfileStringValue(current, 'title')
  form.description = getProfileStringValue(current, 'description')
  form.gender = getProfileStringValue(current, 'gender')
  form.phone = getProfileStringValue(current, 'phone')
  form.address = getProfileStringValue(current, 'address')
  form.birthday = formatDateForInput(getProfileStringValue(current, 'birthday'))
}

watch(
  profile,
  (value) => {
    resetFormFromProfile(value)
  },
  { immediate: true },
)

watch(photoFiles, (files) => {
  if (Array.isArray(files)) {
    selectedFile.value = files[0] ?? null
  } else if (typeof File !== 'undefined' && files instanceof File) {
    selectedFile.value = files
  } else {
    selectedFile.value = null
  }
})

watch(editDialog, (value) => {
  if (!value) {
    formError.value = ''
    photoFiles.value = null
    selectedFile.value = null
    resetFormFromProfile(profile.value)
  }
})

const hasChanges = computed(() => {
  if (!profile.value) return false
  const current = profile.value

  const fields: (keyof ProfileForm)[] = [
    'firstName',
    'lastName',
    'title',
    'description',
    'gender',
    'phone',
    'address',
  ]

  for (const field of fields) {
    const profileValue = getProfileStringValue(current, field)
    if (form[field] !== profileValue) {
      return true
    }
  }

  const originalBirthday = formatDateForInput(
    getProfileStringValue(current, 'birthday'),
  )
  if ((form.birthday || '') !== originalBirthday) {
    return true
  }

  if (selectedFile.value) {
    return true
  }

  return false
})

const formattedBirthday = computed(() =>
  formatDateForDisplay(getProfileStringValue(profile.value, 'birthday')),
)

async function submit() {
  if (!profile.value || !hasChanges.value || isSaving.value) {
    return
  }

  isSaving.value = true
  formError.value = ''

  try {
    const formData = new FormData()
    const fields: (keyof ProfileForm)[] = [
      'firstName',
      'lastName',
      'title',
      'description',
      'gender',
      'phone',
      'address',
    ]

    for (const field of fields) {
      formData.append(field, form[field])
    }

    if (form.birthday && form.birthday.trim().length > 0) {
      formData.append('birthday', form.birthday)
    }

    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }

    const updatedProfile = await $fetch<AuthProfile>('/api/profile/update', {
      method: 'POST',
      body: formData,
    })

    profileCache.value = updatedProfile
    await refreshSession()
    Notify.success('Profil mis à jour avec succès')
    editDialog.value = false
  } catch (error) {
    let message = 'La mise à jour du profil a échoué.'

    if (error instanceof FetchError) {
      const data = error.data as Record<string, unknown> | undefined
      if (data?.message && typeof data.message === 'string') {
        message = data.message
      } else if (typeof error.message === 'string' && error.message) {
        message = error.message
      }
    } else if (error instanceof Error && error.message) {
      message = error.message
    }

    formError.value = message
    Notify.error(message)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <v-container fluid class="py-8">
    <v-dialog v-model="editDialog" max-width="640">
      <v-card>
        <v-card-title class="text-wrap">Modifier le profil</v-card-title>
        <v-divider />
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Mettez à jour vos informations personnelles afin de conserver un
            profil à jour sur la plateforme.
          </p>
          <v-alert
            v-if="formError"
            type="error"
            variant="tonal"
            class="mb-4"
            density="compact"
          >
            {{ formError }}
          </v-alert>
          <v-form @submit.prevent="submit">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.firstName"
                  label="Prénom"
                  autocomplete="given-name"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.lastName"
                  label="Nom"
                  autocomplete="family-name"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.title"
                  label="Intitulé de poste"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.gender"
                  label="Genre"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.phone"
                  label="Téléphone"
                  type="tel"
                  autocomplete="tel"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.address"
                  label="Adresse"
                  autocomplete="street-address"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.birthday"
                  label="Date de naissance"
                  type="date"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="Description"
                  auto-grow
                  rows="3"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="photoFiles"
                  label="Photo de profil"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  clearable
                  show-size
                  :disabled="isSaving"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="isSaving" @click="editDialog = false">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!hasChanges || isSaving"
            :loading="isSaving"
            @click="submit"
          >
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-alert v-if="!profile" type="info" variant="tonal" class="ma-auto">
          Aucune donnée de profil disponible. Connectez-vous pour consulter vos
          informations.
        </v-alert>

        <v-row v-else align="stretch">
          <v-col cols="12" md="4">
            <v-card class="pa-6" elevation="2">
              <v-row no-gutters class="align-center mb-4">
                <v-col cols="auto">
                  <v-avatar size="96" color="primary" class="elevation-2">
                    <v-img
                      v-if="avatarUrl"
                      :src="avatarUrl"
                      alt="Photo de profil"
                    />
                    <span
                      v-else
                      class="text-h4 font-weight-medium text-white"
                      >{{ initials }}</span
                    >
                  </v-avatar>
                </v-col>
                <v-col>
                  <div class="text-h5 font-weight-medium">
                    {{ displayName }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    @{{ profile.username }}
                  </div>
                  <div
                    v-if="profile.title"
                    class="text-body-2 text-medium-emphasis mt-1"
                  >
                    {{ profile.title }}
                  </div>
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="d-flex flex-column" style="row-gap: 12px">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    Identifiant utilisateur
                  </div>
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ profile.id }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">
                    Adresse e-mail
                  </div>
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ profile.email }}
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12">
                <v-card elevation="2">
                  <v-card-title class="d-flex align-center gap-4">
                    <span>Informations personnelles</span>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      variant="text"
                      prepend-icon="mdi-pencil"
                      :disabled="isSaving"
                      @click="editDialog = true"
                    >
                      Modifier
                    </v-btn>
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          Prénom
                        </div>
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
                        <div class="text-caption text-medium-emphasis">
                          Nom d'utilisateur
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.username }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          Adresse e-mail
                        </div>
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
                  <v-card-title>Détails du profil</v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          Intitulé de poste
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.title || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          Genre
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.gender || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          Téléphone
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.phone || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          Adresse
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.address || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          Date de naissance
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ formattedBirthday || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <div class="text-caption text-medium-emphasis">
                          Description
                        </div>
                        <div class="text-body-2">
                          {{ profile.description || '—' }}
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
                    <div
                      v-if="roles.length"
                      class="d-flex flex-wrap"
                      style="gap: 8px"
                    >
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
