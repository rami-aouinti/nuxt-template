<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { Notify } from '~/stores/notification'

type NavigationAction = {
  label: string
  to: string
}

type NavigationLink = {
  kind: 'link'
  icon: string
  label: string
  to: string
  action?: NavigationAction
}

type NavigationGroup = {
  kind: 'group'
  icon: string
  label: string
  value: string
  children: NavigationLink[]
}

type EcommerceEntityDefinition = {
  value: string
  label: string
  basePath: string
  identifierLabel?: string
  identifierHint?: string
  payloadTemplate?: Record<string, unknown>
}

type CrudAction = 'load' | 'create' | 'update' | 'delete'

const { t } = useI18n()
const localePath = useLocalePath()
const translate = useTranslateWithFallback()

const createLink = (
  label: string,
  icon: string,
  path: string,
  action?: { label: string; path: string },
): NavigationLink => ({
  kind: 'link',
  icon,
  label,
  to: localePath(path),
  action: action
    ? {
        label: action.label,
        to: localePath(action.path),
      }
    : undefined,
})

const createGroup = (
  label: string,
  icon: string,
  children: Array<{ label: string; icon: string; path: string }>,
): NavigationGroup => ({
  kind: 'group',
  icon,
  label,
  value: icon,
  children: children.map((child) =>
    createLink(child.label, child.icon, child.path),
  ),
})

const primaryLinks = computed<NavigationLink[]>(() => [
  createLink(
    t('admin.ecommerce.navigation.dashboard'),
    'mdi-monitor-dashboard',
    '/admin/ecommerce-management/dashboard',
  ),
  createLink(
    t('admin.ecommerce.configuration.navigation.channels'),
    'mdi-store-cog-outline',
    '/admin/ecommerce-management/configuration/channels',
  ),
  createLink(
    t('admin.ecommerce.navigation.taxons'),
    'mdi-family-tree',
    '/admin/ecommerce-management/taxons',
    {
      label: t('admin.ecommerce.taxons.create'),
      path: '/admin/ecommerce-management/taxons/new',
    },
  ),
])

const groupedSections = computed<NavigationGroup[]>(() => [
  createGroup(
    t('admin.ecommerce.navigationGroups.productsManagement'),
    'mdi-package-variant-closed',
    [
      {
        label: t('admin.ecommerce.navigation.products'),
        icon: 'mdi-cube-outline',
        path: '/admin/ecommerce-management/products',
      },
      {
        label: t('admin.ecommerce.navigation.inventory'),
        icon: 'mdi-warehouse',
        path: '/admin/ecommerce-management/inventory',
      },
      {
        label: t('admin.ecommerce.navigation.productOptions'),
        icon: 'mdi-tune-variant',
        path: '/admin/ecommerce-management/product-options',
      },
      {
        label: t('admin.ecommerce.navigation.productAssociationTypes'),
        icon: 'mdi-sitemap-outline',
        path: '/admin/ecommerce-management/product-association-types',
      },
      {
        label: t('admin.ecommerce.navigation.productReviews'),
        icon: 'mdi-star-circle-outline',
        path: '/admin/ecommerce-management/product-reviews',
      },
    ],
  ),
  createGroup(
    t('admin.ecommerce.navigationGroups.orderManagement'),
    'mdi-clipboard-text-clock-outline',
    [
      {
        label: t('admin.ecommerce.navigation.orders'),
        icon: 'mdi-clipboard-text-multiple-outline',
        path: '/admin/ecommerce-management/orders',
      },
      {
        label: t('admin.ecommerce.navigation.shipments'),
        icon: 'mdi-truck-outline',
        path: '/admin/ecommerce-management/shipments',
      },
    ],
  ),
  createGroup(
    t('admin.ecommerce.navigationGroups.paymentManagement'),
    'mdi-credit-card-outline',
    [
      {
        label: t('admin.ecommerce.navigation.payments'),
        icon: 'mdi-cash-register',
        path: '/admin/ecommerce-management/payments',
      },
      {
        label: t('admin.ecommerce.configuration.navigation.paymentMethods'),
        icon: 'mdi-credit-card-settings-outline',
        path: '/admin/ecommerce-management/configuration/payment-methods',
      },
    ],
  ),
  createGroup(
    t('admin.ecommerce.navigationGroups.customerManagement'),
    'mdi-account-group-outline',
    [
      {
        label: t('admin.ecommerce.navigation.customers'),
        icon: 'mdi-account-circle-outline',
        path: '/admin/ecommerce-management/customers',
      },
      {
        label: t('admin.ecommerce.navigation.customerGroups'),
        icon: 'mdi-account-multiple-outline',
        path: '/admin/ecommerce-management/customer-groups',
      },
    ],
  ),
  createGroup(
    t('admin.ecommerce.navigationGroups.configuration'),
    'mdi-cog-outline',
    [
      {
        label: t('admin.ecommerce.configuration.navigation.countries'),
        icon: 'mdi-earth',
        path: '/admin/ecommerce-management/configuration/countries',
      },
      {
        label: t('admin.ecommerce.configuration.navigation.locales'),
        icon: 'mdi-translate',
        path: '/admin/ecommerce-management/configuration/locales',
      },
      {
        label: t('admin.ecommerce.configuration.navigation.administrators'),
        icon: 'mdi-account-key-outline',
        path: '/admin/ecommerce-management/configuration/administrators',
      },
      {
        label: t('admin.ecommerce.configuration.navigation.currencies'),
        icon: 'mdi-currency-usd',
        path: '/admin/ecommerce-management/configuration/currencies',
      },
      {
        label: t('admin.ecommerce.configuration.navigation.zones'),
        icon: 'mdi-map-marker-radius-outline',
        path: '/admin/ecommerce-management/configuration/zones',
      },
    ],
  ),
  createGroup(
    t('admin.ecommerce.navigationGroups.taxManagement'),
    'mdi-scale-balance',
    [
      {
        label: t('admin.ecommerce.configuration.navigation.taxRates'),
        icon: 'mdi-percent-outline',
        path: '/admin/ecommerce-management/configuration/tax-rates',
      },
      {
        label: t('admin.ecommerce.configuration.navigation.taxCategories'),
        icon: 'mdi-format-list-bulleted',
        path: '/admin/ecommerce-management/configuration/tax-categories',
      },
    ],
  ),
  createGroup(
    t('admin.ecommerce.navigationGroups.marketing'),
    'mdi-bullhorn-outline',
    [
      {
        label: t('admin.ecommerce.navigation.cartPromotions'),
        icon: 'mdi-tag-outline',
        path: '/admin/ecommerce-management/cart-promotions',
      },
      {
        label: t('admin.ecommerce.navigation.catalogPromotions'),
        icon: 'mdi-tag-multiple-outline',
        path: '/admin/ecommerce-management/catalog-promotions',
      },
    ],
  ),
])

const DEFAULT_PAYLOAD = '{\n  \n}'

const entityDefinitions = computed<EcommerceEntityDefinition[]>(() => {
  const codeLabel = t('admin.ecommerce.entityManager.fields.code')
  const idLabel = t('admin.ecommerce.entityManager.fields.id')
  const identifierHint = t('admin.ecommerce.entityManager.fields.identifierHint')

  return [
    {
      value: 'channels',
      label: t('admin.ecommerce.configuration.navigation.channels'),
      basePath: '/api/ecommerce/v2/admin/channels',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'NEW_CHANNEL',
        name: 'New channel',
        enabled: true,
      },
    },
    {
      value: 'catalog-promotions',
      label: t('admin.ecommerce.navigation.catalogPromotions'),
      basePath: '/api/ecommerce/v2/admin/catalog-promotions',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'NEW_CATALOG_PROMO',
        name: 'Catalog promotion',
        enabled: true,
      },
    },
    {
      value: 'promotions',
      label: t('admin.ecommerce.navigation.cartPromotions'),
      basePath: '/api/ecommerce/v2/admin/promotions',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'NEW_CART_PROMO',
        name: 'Cart promotion',
        enabled: true,
      },
    },
    {
      value: 'customer-groups',
      label: t('admin.ecommerce.navigation.customerGroups'),
      basePath: '/api/ecommerce/v2/admin/customer-groups',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'VIP',
        name: 'VIP customers',
      },
    },
    {
      value: 'product-options',
      label: t('admin.ecommerce.navigation.productOptions'),
      basePath: '/api/ecommerce/v2/admin/product-options',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'FABRIC',
        name: 'Fabric',
        values: [],
      },
    },
    {
      value: 'product-association-types',
      label: t('admin.ecommerce.navigation.productAssociationTypes'),
      basePath: '/api/ecommerce/v2/admin/product-association-types',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'UPSELL',
        name: 'Upsell',
      },
    },
    {
      value: 'product-attributes',
      label: t('admin.ecommerce.entityManager.entities.productAttributes'),
      basePath: '/api/ecommerce/v2/admin/product-attributes',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'MATERIAL',
        name: 'Material',
        type: 'text',
      },
    },
    {
      value: 'products',
      label: t('admin.ecommerce.navigation.products'),
      basePath: '/api/ecommerce/v2/admin/products',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'NEW_PRODUCT',
        name: 'New product',
        enabled: true,
        channels: [],
      },
    },
    {
      value: 'shipping-methods',
      label: t('admin.ecommerce.configuration.navigation.shippingMethods'),
      basePath: '/api/ecommerce/v2/admin/shipping-methods',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'EXPRESS',
        name: 'Express shipping',
        enabled: true,
      },
    },
    {
      value: 'shipping-categories',
      label: t('admin.ecommerce.entityManager.entities.shippingCategories'),
      basePath: '/api/ecommerce/v2/admin/shipping-categories',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'STANDARD_BOX',
        name: 'Standard box',
      },
    },
    {
      value: 'tax-categories',
      label: t('admin.ecommerce.configuration.navigation.taxCategories'),
      basePath: '/api/ecommerce/v2/admin/tax-categories',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'DEFAULT_TAX',
        name: 'Default tax',
      },
    },
    {
      value: 'tax-rates',
      label: t('admin.ecommerce.configuration.navigation.taxRates'),
      basePath: '/api/ecommerce/v2/admin/tax-rates',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'STANDARD_VAT',
        name: 'Standard VAT',
        amount: 0.2,
      },
    },
    {
      value: 'taxons',
      label: t('admin.ecommerce.navigation.taxons'),
      basePath: '/api/ecommerce/v2/admin/taxons',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'NEW_TAXON',
        name: 'New taxon',
        enabled: true,
      },
    },
    {
      value: 'zones',
      label: t('admin.ecommerce.configuration.navigation.zones'),
      basePath: '/api/ecommerce/v2/admin/zones',
      identifierLabel: codeLabel,
      identifierHint,
      payloadTemplate: {
        code: 'EU_ZONE',
        name: 'European zone',
        members: [],
      },
    },
    {
      value: 'administrators',
      label: t('admin.ecommerce.configuration.navigation.administrators'),
      basePath: '/api/ecommerce/v2/admin/administrators',
      identifierLabel: idLabel,
      identifierHint,
      payloadTemplate: {
        firstName: 'Alex',
        lastName: 'Doe',
        email: 'alex@example.com',
        enabled: true,
      },
    },
    {
      value: 'exchange-rates',
      label: t('admin.ecommerce.entityManager.entities.exchangeRates'),
      basePath: '/api/ecommerce/v2/admin/exchange-rates',
      identifierLabel: idLabel,
      identifierHint,
      payloadTemplate: {
        ratio: 1,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
      },
    },
  ]
})

const selectedEntity = ref('')
const entityIdentifier = ref('')
const entityPayload = ref(DEFAULT_PAYLOAD)
const busyAction = ref<CrudAction | null>(null)
const formError = ref<string | null>(null)

const currentEntity = computed(() =>
  entityDefinitions.value.find((entity) => entity.value === selectedEntity.value) ??
  null,
)

watch(
  entityDefinitions,
  (definitions) => {
    if (!definitions.length) {
      selectedEntity.value = ''
      return
    }

    const hasSelection = definitions.some(
      (definition) => definition.value === selectedEntity.value,
    )

    if (!hasSelection) {
      selectedEntity.value = definitions[0].value
    }
  },
  { immediate: true },
)

watch(
  selectedEntity,
  () => {
    entityPayload.value = formatPayloadTemplate(currentEntity.value?.payloadTemplate)
    entityIdentifier.value = ''
    formError.value = null
  },
  { immediate: true },
)

const hasIdentifier = computed(() => entityIdentifier.value.trim().length > 0)
const identifierLabel = computed(
  () =>
    currentEntity.value?.identifierLabel ??
    t('admin.ecommerce.entityManager.fields.identifier'),
)
const identifierHint = computed(
  () =>
    currentEntity.value?.identifierHint ??
    t('admin.ecommerce.entityManager.fields.identifierHint'),
)
const helperText = computed(() =>
  currentEntity.value
    ? t('admin.ecommerce.entityManager.helper', {
        path: currentEntity.value.basePath,
      })
    : '',
)
const payloadPlaceholder = computed(() =>
  t('admin.ecommerce.entityManager.fields.payloadPlaceholder'),
)

function formatPayloadTemplate(template?: Record<string, unknown> | unknown) {
  if (!template) {
    return DEFAULT_PAYLOAD
  }

  if (typeof template === 'object' && template !== null) {
    const keys = Object.keys(template as Record<string, unknown>)
    if (keys.length === 0) {
      return DEFAULT_PAYLOAD
    }
  }

  try {
    return JSON.stringify(template, null, 2)
  } catch (error) {
    console.warn('Unable to format entity payload template', error)
    return DEFAULT_PAYLOAD
  }
}

function resolveErrorMessage(error: unknown) {
  const err = error as { data?: { message?: string }; message?: string }
  return err?.data?.message || err?.message || t('common.unexpectedError')
}

function requireIdentifier() {
  const value = entityIdentifier.value.trim()
  if (!value) {
    const message = t('admin.ecommerce.entityManager.errors.identifierRequired')
    formError.value = message
    Notify.error(message)
    return null
  }
  return value
}

function parsePayloadBody() {
  const raw = entityPayload.value.trim()
  const normalized = raw.length === 0 ? '{}' : raw

  try {
    return JSON.parse(normalized) as Record<string, unknown>
  } catch (error) {
    console.warn('Invalid JSON payload', error)
    const message = t('admin.ecommerce.entityManager.errors.payloadInvalid')
    formError.value = message
    Notify.error(message)
    return null
  }
}

async function loadEntity() {
  if (!currentEntity.value) {
    return
  }

  const identifier = requireIdentifier()
  if (!identifier) {
    return
  }

  busyAction.value = 'load'
  formError.value = null

  try {
    const response = await $fetch(
      `${currentEntity.value.basePath}/${encodeURIComponent(identifier)}`,
      {
        credentials: 'include',
      },
    )
    entityPayload.value = formatPayloadTemplate(response)
    Notify.success(t('admin.ecommerce.entityManager.notifications.loadSuccess'))
  } catch (error) {
    const message = resolveErrorMessage(error)
    formError.value = message
    Notify.error(message)
  } finally {
    busyAction.value = null
  }
}

async function submitEntity(action: 'create' | 'update') {
  if (!currentEntity.value) {
    return
  }

  const identifier = action === 'create' ? null : requireIdentifier()
  if (action !== 'create' && !identifier) {
    return
  }

  const body = parsePayloadBody()
  if (!body) {
    return
  }

  busyAction.value = action
  formError.value = null

  const url =
    action === 'create'
      ? currentEntity.value.basePath
      : `${currentEntity.value.basePath}/${encodeURIComponent(identifier!)}`

  try {
    const response = await $fetch(url, {
      method: action === 'create' ? 'POST' : 'PUT',
      credentials: 'include',
      body,
    })

    entityPayload.value = formatPayloadTemplate(response)

    Notify.success(
      t(
        action === 'create'
          ? 'admin.ecommerce.entityManager.notifications.createSuccess'
          : 'admin.ecommerce.entityManager.notifications.updateSuccess',
      ),
    )
  } catch (error) {
    const message = resolveErrorMessage(error)
    formError.value = message
    Notify.error(message)
  } finally {
    busyAction.value = null
  }
}

async function deleteEntity() {
  if (!currentEntity.value) {
    return
  }

  const identifier = requireIdentifier()
  if (!identifier) {
    return
  }

  if (import.meta.client) {
    const confirmed = window.confirm(
      t('admin.ecommerce.entityManager.dialogs.deleteConfirm'),
    )
    if (!confirmed) {
      return
    }
  }

  busyAction.value = 'delete'
  formError.value = null

  try {
    await $fetch(
      `${currentEntity.value.basePath}/${encodeURIComponent(identifier)}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    )

    Notify.success(
      t('admin.ecommerce.entityManager.notifications.deleteSuccess'),
    )
  } catch (error) {
    const message = resolveErrorMessage(error)
    formError.value = message
    Notify.error(message)
  } finally {
    busyAction.value = null
  }
}

const pageTitle = computed(() =>
  translate(
    'admin.ecommerce.navigationTree.title',
    'Pilotez votre boutique en quelques clics',
  ),
)
const pageSubtitle = computed(() =>
  translate(
    'admin.ecommerce.navigationTree.subtitle',
    'Naviguez par domaine fonctionnel pour retrouver rapidement chaque module e-commerce.',
  ),
)
</script>

<template>
  <v-container class="ecommerce-management-index py-0">
    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">{{ pageTitle }}</h2>
        <p class="section-subtitle">
          {{ pageSubtitle }}
        </p>
      </div>

      <v-row>
        <v-col cols="12">
          <v-card class="navigation-tree">
            <v-card-title class="d-flex align-center justify-space-between">
              <span class="text-h6">
                {{ t('navigation.ecommerceManagement') }}
              </span>
            </v-card-title>
            <v-divider />
            <v-list nav density="comfortable" class="py-2">
              <v-list-item
                v-for="link in primaryLinks"
                :key="link.to"
                :prepend-icon="link.icon"
                :title="link.label"
                :to="link.to"
                rounded="lg"
                class="navigation-tree__item"
              >
                <template v-if="link.action" #append>
                  <v-btn
                    :to="link.action.to"
                    color="primary"
                    variant="tonal"
                    size="small"
                  >
                    {{ link.action.label }}
                  </v-btn>
                </template>
              </v-list-item>

              <v-divider class="my-2" />

              <v-list-group
                v-for="section in groupedSections"
                :key="section.value"
                :value="section.value"
                :model-value="true"
                color="primary"
                class="navigation-tree__group"
              >
                <template #activator="{ props: activatorProps }">
                  <v-list-item
                    v-bind="activatorProps"
                    :prepend-icon="section.icon"
                    :title="section.label"
                    rounded="lg"
                  />
                </template>
                <v-list-item
                  v-for="child in section.children"
                  :key="`${section.value}-${child.to}`"
                  :prepend-icon="child.icon"
                  :title="child.label"
                  :to="child.to"
                  rounded="lg"
                  class="navigation-tree__child"
                />
              </v-list-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">
          {{ t('admin.ecommerce.entityManager.title') }}
        </h2>
        <p class="section-subtitle">
          {{ t('admin.ecommerce.entityManager.subtitle') }}
        </p>
      </div>

      <v-row>
        <v-col cols="12">
          <v-card class="entity-manager-card" rounded="xl" elevation="2">
            <v-card-text class="entity-manager-card__content">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedEntity"
                    :items="entityDefinitions"
                    item-title="label"
                    item-value="value"
                    :label="t('admin.ecommerce.entityManager.fields.entity')"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <div class="entity-manager__identifier">
                    <v-text-field
                      v-model="entityIdentifier"
                      class="flex-grow-1"
                      :label="identifierLabel"
                      :hint="identifierHint"
                      autocomplete="off"
                      density="comfortable"
                      persistent-hint
                    />
                    <v-btn
                      class="entity-manager__load"
                      color="primary"
                      variant="tonal"
                      :disabled="!currentEntity || !hasIdentifier || busyAction !== null"
                      :loading="busyAction === 'load'"
                      @click="loadEntity"
                    >
                      {{ t('admin.ecommerce.entityManager.actions.load') }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>

              <v-textarea
                v-model="entityPayload"
                class="entity-manager__payload"
                :label="t('admin.ecommerce.entityManager.fields.payload')"
                :placeholder="payloadPlaceholder"
                rows="10"
                auto-grow
                spellcheck="false"
              />

              <p v-if="helperText" class="entity-manager__helper text-caption">
                {{ helperText }}
              </p>

              <v-alert
                v-if="formError"
                class="mt-4"
                type="error"
                variant="tonal"
                border="start"
              >
                {{ formError }}
              </v-alert>

              <div class="entity-manager__actions">
                <v-btn
                  color="primary"
                  :disabled="!currentEntity || busyAction !== null"
                  :loading="busyAction === 'create'"
                  @click="submitEntity('create')"
                >
                  {{ t('admin.ecommerce.entityManager.actions.create') }}
                </v-btn>
                <v-btn
                  color="secondary"
                  variant="tonal"
                  :disabled="!currentEntity || !hasIdentifier || busyAction !== null"
                  :loading="busyAction === 'update'"
                  @click="submitEntity('update')"
                >
                  {{ t('admin.ecommerce.entityManager.actions.update') }}
                </v-btn>
                <v-btn
                  color="error"
                  variant="tonal"
                  :disabled="!currentEntity || !hasIdentifier || busyAction !== null"
                  :loading="busyAction === 'delete'"
                  @click="deleteEntity"
                >
                  {{ t('admin.ecommerce.entityManager.actions.delete') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<style scoped>
.ecommerce-management-index {
  position: relative;
  z-index: 1;
}

.navigation-tree {
  padding: 16px 12px;
  border-radius: 24px;
  background-color: rgba(var(--v-theme-surface), 0.94);
  background: color-mix(in srgb, rgba(var(--v-theme-surface), 1) 90%, transparent);
  box-shadow: 0 18px 40px rgba(var(--v-theme-primary), 0.08);
  border: 1px solid rgba(var(--v-theme-primary), 0.08);
}

.navigation-tree :deep(.v-list-item) {
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.navigation-tree__item,
.navigation-tree__group :deep(.v-list-item) {
  margin-block: 4px;
}

.navigation-tree :deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: translateX(4px);
}

:global(.v-theme--dark) .navigation-tree {
  background-color: rgba(var(--v-theme-surface), 0.82);
  background: color-mix(in srgb, rgba(var(--v-theme-surface), 1) 75%, transparent);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.entity-manager-card {
  border-radius: 24px;
  background: color-mix(
    in srgb,
    rgba(var(--v-theme-surface), 0.92),
    rgba(var(--v-theme-primary), 0.08)
  );
  border: 1px solid color-mix(in srgb, var(--v-theme-outline-variant) 40%, transparent);
}

.entity-manager-card__content {
  padding: 28px;
}

.entity-manager__identifier {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.entity-manager__load {
  white-space: nowrap;
}

.entity-manager__payload {
  margin-top: 12px;
}

.entity-manager__helper {
  margin-top: 8px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.entity-manager__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
</style>
