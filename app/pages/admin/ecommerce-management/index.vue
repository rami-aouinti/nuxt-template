<script setup lang="ts">
import { computed } from 'vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'

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
</style>
