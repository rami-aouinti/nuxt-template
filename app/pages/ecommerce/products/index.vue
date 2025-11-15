<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import {
  buildProductImageUrl,
  extractCollectionItems,
  getString,
  resolveProductImagePath,
  resolveProductPricing,
  resolveProductTranslation,
  toRecord,
  type UnknownRecord,
} from '~/utils/ecommerce/product'
import type { ProductJsonldSyliusShopProductIndex } from '~/types/product'
import type { ChannelJsonLdSyliusShopChannelIndex } from '~/types/channel'

definePageMeta({
  title: 'navigation.ecommerceProducts',
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const ITEMS_PER_PAGE = 12

type HydraCollection<T> = {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  data?: T[]
  'hydra:totalItems'?: number | string
  totalItems?: number | string
}

const resolveProductName = (product: ProductJsonldSyliusShopProductIndex) => {
  const translation = resolveProductTranslation(product, locale.value)
  const translatedName =
    getString(translation, 'name') ||
    getString(translation, 'label') ||
    getString(translation, 'title')
  if (translatedName) {
    return translatedName
  }

  const productRecord = product as UnknownRecord
  const directName = getString(productRecord, 'name')
  if (directName) {
    return directName
  }

  const code = getString(productRecord, 'code')
  if (code) {
    return code
  }

  return t('pages.ecommerce.fallbacks.unknownProduct')
}

const resolveProductSlug = (product: ProductJsonldSyliusShopProductIndex) => {
  const translation = resolveProductTranslation(product, locale.value)
  const translatedSlug =
    getString(translation, 'slug') ||
    getString(translation, 'code') ||
    getString(translation, 'identifier')
  if (translatedSlug) {
    return translatedSlug
  }

  const record = product as UnknownRecord
  const directSlug =
    getString(record, 'slug') ||
    getString(record, 'code') ||
    getString(record, 'id')
  if (directSlug) {
    return directSlug
  }

  return null
}

const formatPriceWithCurrency = (
  amount: number | null | undefined,
  formatter: Intl.NumberFormat,
  currencyCode: string,
) => {
  if (amount == null) {
    return null
  }

  const normalizedAmount = amount / 100
  try {
    return formatter.format(normalizedAmount)
  } catch {
    return `${currencyCode} ${normalizedAmount.toFixed(2)}`
  }
}

const getProductDetailRoute = (product: ProductJsonldSyliusShopProductIndex) => {
  const slug = resolveProductSlug(product)
  if (!slug) {
    return null
  }

  return localePath({
    name: 'ecommerce-products-slug',
    params: { slug },
  })
}

const resolvePageFromRoute = (value: unknown) => {
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }

  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.floor(value)
  }

  return 1
}

const page = ref(resolvePageFromRoute(route.query.page))

const fetchProducts = () =>
  $fetch<HydraCollection<ProductJsonldSyliusShopProductIndex>>(
    '/api/ecommerce/v2/shop/products',
    {
      query: {
        itemsPerPage: ITEMS_PER_PAGE,
        page: page.value,
        'order[createdAt]': 'desc',
      },
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )

const fetchChannels = () =>
  $fetch<HydraCollection<ChannelJsonLdSyliusShopChannelIndex>>(
    '/api/ecommerce/v2/shop/channels',
    {
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )

const {
  data: productsResponse,
  pending: productsPending,
  error: productsError,
  refresh: refreshProducts,
} = await useAsyncData('ecommerce-product-list', fetchProducts, {
  watch: [() => page.value, () => locale.value],
})

const {
  data: channelsResponse,
  pending: channelsPending,
  error: channelsError,
  refresh: refreshChannels,
} = await useAsyncData('ecommerce-product-list-channels', fetchChannels, {
  watch: [() => locale.value],
})

const products = computed(() =>
  extractCollectionItems<ProductJsonldSyliusShopProductIndex>(
    productsResponse.value,
  ),
)

const channels = computed(() =>
  extractCollectionItems<ChannelJsonLdSyliusShopChannelIndex>(
    channelsResponse.value,
  ),
)

const defaultChannel = computed(() => channels.value[0] ?? null)

const currencyCode = computed(() => {
  const channelRecord = toRecord(defaultChannel.value)
  const code = getString(channelRecord, 'baseCurrency')
  if (code) {
    return code
  }

  return 'USD'
})

const priceFormatter = computed(() => {
  try {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: currencyCode.value,
    })
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }
})

const resolveProductPricingDisplay = (
  product: ProductJsonldSyliusShopProductIndex,
) => {
  const pricing = resolveProductPricing(product)
  if (!pricing) {
    return null
  }

  const priceText = formatPriceWithCurrency(
    pricing.price,
    priceFormatter.value,
    currencyCode.value,
  )
  const originalText =
    pricing.originalPrice != null &&
    pricing.price != null &&
    pricing.originalPrice > pricing.price
      ? formatPriceWithCurrency(
          pricing.originalPrice,
          priceFormatter.value,
          currencyCode.value,
        )
      : null

  if (!priceText) {
    return null
  }

  return {
    priceText,
    originalText,
  }
}

const totalItems = computed(() => {
  const record = toRecord(productsResponse.value)
  const total = record?.['hydra:totalItems'] ?? record?.totalItems
  if (typeof total === 'number' && Number.isFinite(total)) {
    return total
  }

  if (typeof total === 'string') {
    const parsed = Number.parseInt(total, 10)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return products.value.length
})

const pageCount = computed(() => {
  if (totalItems.value <= 0) {
    return 1
  }

  return Math.max(1, Math.ceil(totalItems.value / ITEMS_PER_PAGE))
})

watch(
  () => route.query.page,
  (value) => {
    const resolved = resolvePageFromRoute(value)
    if (resolved !== page.value) {
      page.value = resolved
    }
  },
)

watch(
  page,
  (value) => {
    if (value < 1) {
      page.value = 1
      return
    }

    if (value > pageCount.value) {
      page.value = pageCount.value
      return
    }

    if (import.meta.client) {
      const current = resolvePageFromRoute(route.query.page)
      if (current === value) {
        return
      }

      const query = { ...route.query }
      if (value > 1) {
        query.page = String(value)
      } else {
        delete query.page
      }

      router.replace({ query }).catch(() => {})
    }
  },
)

const anyPending = computed(
  () => productsPending.value || channelsPending.value,
)
const anyError = computed(
  () => Boolean(productsError.value || channelsError.value),
)

const catalogueItems = computed(() =>
  products.value.map((product) => {
    const pricing = resolveProductPricingDisplay(product)
    const route = getProductDetailRoute(product)
    return {
      product,
      name: resolveProductName(product),
      image: buildProductImageUrl(resolveProductImagePath(product)),
      price: pricing?.priceText ?? t('pages.ecommerce.fallbacks.priceUnavailable'),
      originalPrice: pricing?.originalText ?? null,
      route,
    }
  }),
)

const productsCountLabel = computed(() =>
  t('pages.ecommerce.productsList.count', {
    count: totalItems.value,
  }),
)

const paginationLabel = computed(() =>
  t('pages.ecommerce.productsList.pagination', {
    page: page.value,
    total: pageCount.value,
  }),
)

const refreshAll = () => {
  refreshProducts()
  refreshChannels()
}
</script>

<template>
  <v-container fluid class="products-page pa-0">
    <section class="products-hero">
      <div class="products-hero__content">
        <p class="products-hero__eyebrow text-overline text-uppercase">
          {{ t('pages.ecommerce.hero.brand') }}
        </p>
        <h1 class="products-hero__title text-h3 text-sm-h2 font-weight-bold">
          {{ t('pages.ecommerce.productsList.title') }}
        </h1>
        <p class="products-hero__subtitle text-body-1">
          {{ t('pages.ecommerce.productsList.subtitle') }}
        </p>
        <div class="products-hero__meta">
          <span class="products-hero__count">
            {{ productsCountLabel }}
          </span>
          <span v-if="pageCount > 1" class="products-hero__pagination">
            {{ paginationLabel }}
          </span>
        </div>
        <div class="products-hero__actions">
          <AppButton color="primary" variant="flat" @click="refreshAll">
            {{ t('pages.ecommerce.actions.refresh') }}
          </AppButton>
          <AppButton
            class="ml-3"
            color="secondary"
            variant="tonal"
            :to="localePath({ name: 'ecommerce' })"
          >
            {{ t('pages.ecommerce.productsList.backToShowcase') }}
          </AppButton>
        </div>
      </div>
    </section>

    <section v-if="anyError" class="products-status">
      <v-alert type="error" border="start" variant="tonal" prominent>
        <div
          class="d-flex flex-column flex-md-row align-md-center justify-space-between gap-3"
        >
          <div>
            <h2 class="text-h6 text-sm-h5 mb-1">
              {{ t('pages.ecommerce.productsList.errorTitle') }}
            </h2>
            <p class="text-body-2 mb-0">
              {{ t('pages.ecommerce.productsList.errorDescription') }}
            </p>
          </div>
          <div class="d-flex gap-2">
            <AppButton color="primary" variant="flat" @click="refreshProducts">
              {{ t('pages.ecommerce.actions.retry') }}
            </AppButton>
            <AppButton
              color="secondary"
              variant="tonal"
              @click="refreshChannels"
            >
              {{ t('pages.ecommerce.actions.refresh') }}
            </AppButton>
          </div>
        </div>
      </v-alert>
    </section>

    <section v-else-if="anyPending" class="products-status">
      <div class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="primary" size="56" />
      </div>
    </section>

    <section v-else class="products-grid py-10">
      <v-container class="py-0">
        <v-row v-if="catalogueItems.length" dense>
          <v-col
            v-for="item in catalogueItems"
            :key="item.name + item.route"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <AppCard class="product-card" hover>
              <div class="product-card__media">
                <v-img
                  :src="item.image"
                  :alt="item.name"
                  cover
                  height="220"
                  class="product-card__image"
                />
              </div>
              <div class="product-card__content">
                <h3 class="product-card__title text-h6 font-weight-bold">
                  {{ item.name }}
                </h3>
                <div class="product-card__pricing">
                  <span class="product-card__price">{{ item.price }}</span>
                  <span
                    v-if="item.originalPrice"
                    class="product-card__original"
                  >
                    {{ item.originalPrice }}
                  </span>
                </div>
              </div>
              <div class="product-card__actions">
                <AppButton
                  block
                  color="primary"
                  variant="flat"
                  :disabled="!item.route"
                  :to="item.route || undefined"
                >
                  {{ t('pages.ecommerce.productsList.viewDetails') }}
                </AppButton>
              </div>
            </AppCard>
          </v-col>
        </v-row>

        <div v-else class="products-empty text-center py-12">
          <h2 class="text-h6 text-sm-h5 mb-2">
            {{ t('pages.ecommerce.productsList.emptyTitle') }}
          </h2>
          <p class="text-body-2 mb-0">
            {{ t('pages.ecommerce.productsList.emptyDescription') }}
          </p>
        </div>

        <div v-if="pageCount > 1" class="products-pagination mt-8">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="5"
            rounded
            class="justify-center"
          />
        </div>
      </v-container>
    </section>
  </v-container>
</template>

<style scoped>
.products-page {
  background: linear-gradient(
    145deg,
    rgba(var(--v-theme-surface), 1) 0%,
    rgba(var(--v-theme-surface-variant), 0.6) 100%
  );
  min-height: 100vh;
}

.products-hero {
  position: relative;
  padding: clamp(48px, 12vw, 120px) 24px 32px;
  color: rgba(var(--v-theme-on-surface), 0.94);
}

.products-hero__content {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.products-hero__title {
  letter-spacing: -0.01em;
}

.products-hero__subtitle {
  max-width: 540px;
  margin: 12px auto 0;
  color: rgba(var(--v-theme-on-surface), 0.72);
}

.products-hero__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  margin-top: 18px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.products-hero__actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.products-status {
  padding: 0 24px;
}

.products-grid {
  background: rgba(var(--v-theme-background), 0.72);
}

.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card__media {
  border-radius: var(--app-rounded, 18px) var(--app-rounded, 18px) 0 0;
  overflow: hidden;
}

.product-card__content {
  padding: 18px;
}

.product-card__title {
  margin: 0 0 12px;
}

.product-card__pricing {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
  color: rgba(var(--v-theme-on-surface), 0.86);
}

.product-card__price {
  font-size: 1.05rem;
  font-weight: 600;
}

.product-card__original {
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-decoration: line-through;
}

.product-card__actions {
  padding: 0 18px 18px;
}

.products-empty {
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.products-pagination {
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  .products-hero__actions {
    flex-direction: column;
    gap: 12px;
  }

  .products-hero__actions .app-button {
    width: 100%;
  }
}
</style>
