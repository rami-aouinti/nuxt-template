<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { normalizeHydraCollection, toRecord } from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.taxons.createTitle',
  icon: 'mdi-shape-plus-outline',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

const form = reactive({
  code: '',
  parent: '',
  enabled: true,
})

const translations = ref([
  {
    locale: locale.value,
    name: '',
    slug: '',
    description: '',
  },
])

const { data: rawLocales } = await useFetch<unknown>(
  '/api/ecommerce/v2/admin/locales',
  {
    key: 'admin-ecommerce-locales',
    credentials: 'include',
  },
)

const availableLocales = computed(() => {
  const entries = normalizeHydraCollection(rawLocales.value)
  if (!entries.length) {
    return [locale.value]
  }

  const names = entries
    .map((entry) => {
      const record = toRecord(entry)
      const code = record?.code
      if (typeof code === 'string' && code.trim().length > 0) {
        return code
      }
      return null
    })
    .filter((code): code is string => Boolean(code))

  if (!names.includes(locale.value)) {
    names.unshift(locale.value)
  }

  return names
})

const busy = ref(false)
const errorMessage = ref<string | null>(null)
const success = ref(false)

const addTranslation = () => {
  const defaultLocale = availableLocales.value.find(
    (code) => !translations.value.some((entry) => entry.locale === code),
  )

  translations.value.push({
    locale: defaultLocale ?? locale.value,
    name: '',
    slug: '',
    description: '',
  })
}

const removeTranslation = (index: number) => {
  if (translations.value.length === 1) {
    return
  }
  translations.value.splice(index, 1)
}

const resolveParentValue = () => {
  const value = form.parent.trim()
  if (!value) {
    return undefined
  }
  if (value.startsWith('/')) {
    return value
  }
  return `/api/v2/admin/taxons/${encodeURIComponent(value)}`
}

const submit = async () => {
  if (!form.code.trim()) {
    errorMessage.value = t('admin.ecommerce.taxons.validation.code')
    return
  }

  busy.value = true
  errorMessage.value = null
  success.value = false

  const payload = {
    code: form.code.trim(),
    parent: resolveParentValue(),
    enabled: form.enabled,
    translations: translations.value.reduce<Record<string, unknown>>(
      (acc, entry) => {
        if (!entry.locale || !entry.name?.trim()) {
          return acc
        }

        acc[entry.locale] = {
          locale: entry.locale,
          name: entry.name.trim(),
          slug: entry.slug?.trim() || null,
          description: entry.description?.trim() || null,
        }

        return acc
      },
      {},
    ),
  }

  try {
    await $fetch('/api/ecommerce/v2/admin/taxons', {
      method: 'POST',
      credentials: 'include',
      body: payload,
    })
    success.value = true
    setTimeout(() => {
      router.push(
        localePath({ name: 'admin-ecommerce-management-taxons-index' }),
      )
    }, 1200)
  } catch (error) {
    const err = error as { data?: { message?: string }; message?: string }
    errorMessage.value =
      err?.data?.message || err?.message || t('common.unexpectedError')
  } finally {
    busy.value = false
  }
}

const formValid = computed(
  () =>
    form.code.trim().length > 0 &&
    translations.value.some((entry) => entry.name.trim()),
)
</script>

<template>
  <v-container class="py-4" fluid>
    <v-row>
      <v-col cols="12" lg="8">
        <AppCard class="pa-6">
          <h1 class="text-h5 mb-4">
            {{ t('admin.ecommerce.taxons.createTitle') }}
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-6">
            {{ t('admin.ecommerce.taxons.createSubtitle') }}
          </p>

          <v-form @submit.prevent="submit">
            <v-row class="mb-4" dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.code"
                  :label="t('admin.ecommerce.taxons.form.code')"
                  required
                  prepend-inner-icon="mdi-identifier"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.parent"
                  :label="t('admin.ecommerce.taxons.form.parent')"
                  prepend-inner-icon="mdi-family-tree"
                  :hint="t('admin.ecommerce.taxons.form.parentHint')"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="form.enabled"
                  :label="t('admin.ecommerce.taxons.form.enabled')"
                  inset
                />
              </v-col>
            </v-row>

            <v-divider class="my-6" />

            <h2 class="text-subtitle-1 font-weight-medium mb-4">
              {{ t('admin.ecommerce.taxons.form.translations') }}
            </h2>

            <v-row
              v-for="(translation, index) in translations"
              :key="index"
              class="mb-4"
            >
              <v-col cols="12" md="4">
                <v-select
                  v-model="translation.locale"
                  :items="availableLocales"
                  :label="t('admin.ecommerce.taxons.form.locale')"
                  prepend-inner-icon="mdi-translate"
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="translation.name"
                  :label="t('admin.ecommerce.taxons.form.name')"
                  required
                  prepend-inner-icon="mdi-format-title"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="translation.slug"
                  :label="t('admin.ecommerce.taxons.form.slug')"
                  prepend-inner-icon="mdi-link-variant"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="translation.description"
                  :label="t('admin.ecommerce.taxons.form.description')"
                  auto-grow
                  rows="2"
                />
              </v-col>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  v-if="translations.length > 1"
                  color="error"
                  variant="text"
                  prepend-icon="mdi-delete"
                  @click="removeTranslation(index)"
                >
                  {{ t('common.actions.remove') }}
                </v-btn>
              </v-col>
              <v-divider v-if="index < translations.length - 1" class="my-4" />
            </v-row>

            <v-btn
              color="secondary"
              variant="tonal"
              prepend-icon="mdi-plus"
              class="mb-6"
              @click="addTranslation"
            >
              {{ t('admin.ecommerce.taxons.form.addTranslation') }}
            </v-btn>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ errorMessage }}
            </v-alert>
            <v-alert v-if="success" type="success" variant="tonal" class="mb-4">
              {{ t('admin.ecommerce.taxons.form.success') }}
            </v-alert>

            <div class="d-flex justify-end gap-4">
              <AppButton
                :to="
                  localePath({
                    name: 'admin-ecommerce-management-taxons-index',
                  })
                "
                variant="text"
                color="secondary"
              >
                {{ t('common.actions.cancel') }}
              </AppButton>
              <v-btn
                color="primary"
                type="submit"
                :loading="busy"
                :disabled="!formValid || busy"
                prepend-icon="mdi-content-save"
              >
                {{ t('admin.ecommerce.taxons.form.submit') }}
              </v-btn>
            </div>
          </v-form>
        </AppCard>
      </v-col>
      <v-col cols="12" lg="4">
        <AppCard class="pa-6">
          <h2 class="text-subtitle-1 font-weight-medium mb-3">
            {{ t('admin.ecommerce.taxons.help.title') }}
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('admin.ecommerce.taxons.help.description') }}
          </p>
          <v-divider class="my-4" />
          <v-list density="comfortable" lines="two">
            <v-list-item :title="t('admin.ecommerce.taxons.help.naming.title')">
              <v-list-item-subtitle>
                {{ t('admin.ecommerce.taxons.help.naming.subtitle') }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item
              :title="t('admin.ecommerce.taxons.help.translations.title')"
            >
              <v-list-item-subtitle>
                {{ t('admin.ecommerce.taxons.help.translations.subtitle') }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item
              :title="t('admin.ecommerce.taxons.help.visibility.title')"
            >
              <v-list-item-subtitle>
                {{ t('admin.ecommerce.taxons.help.visibility.subtitle') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-4 {
  gap: 16px;
}
</style>
