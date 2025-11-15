<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { truncateText } from '~/utils/formatters'
import type { ProductJsonldSyliusShopProductIndex } from '~/types/product'
import type { TaxonJsonLdSyliusShopTaxonIndex } from '~/types/tax'
import type { ChannelJsonLdSyliusShopChannelIndex } from '~/types/channel'
import { useEcommerceCartStore } from '~/stores/ecommerceCart'
import {
  FALLBACK_PRODUCT_IMAGE,
  buildProductImageUrl as buildImageUrl,
  extractCollectionItems,
  getString,
  resolveProductImagePath,
  resolveProductPricing,
  resolveProductTranslation,
  resolveTaxonTranslation,
  toRecord,
  type UnknownRecord,
} from '~/utils/ecommerce/product'

definePageMeta({
  title: 'navigation.ecommerce',
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const cartStore = useEcommerceCartStore()

type HydraCollection<T> = {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  data?: T[]
}

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1468857006721-c3030f210054?auto=format&fit=crop&w=1600&q=80'
const MAX_PRODUCT_SUMMARY_LENGTH = 110

const resolveProductName = (product: ProductJsonldSyliusShopProductIndex) => {
  const translation = resolveProductTranslation(product, locale.value)
  const translatedName = getString(translation, 'name')
  if (translatedName) {
    return translatedName
  }

  const altName = getString(translation, 'label') || getString(translation, 'title')
  if (altName) {
    return altName
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

const resolveProductSummary = (product: ProductJsonldSyliusShopProductIndex) => {
  const translation = resolveProductTranslation(product, locale.value)
  const summary =
    getString(translation, 'shortDescription') ||
    getString(translation, 'description') ||
    getString(translation, 'metaDescription')

  if (summary) {
    return truncateText(summary, MAX_PRODUCT_SUMMARY_LENGTH)
  }

  return null
}

const resolveTaxonName = (taxon: TaxonJsonLdSyliusShopTaxonIndex) => {
  const translation = resolveTaxonTranslation(taxon, locale.value)
  const translatedName = getString(translation, 'name')
  if (translatedName) {
    return translatedName
  }

  const taxonRecord = taxon as UnknownRecord
  const fullname = getString(taxonRecord, 'fullname')
  if (fullname) {
    return fullname
  }

  const code = getString(taxonRecord, 'code')
  if (code) {
    return code
  }

  return t('pages.ecommerce.fallbacks.categoryFallback')
}

const resolveProductIdentifier = (product: ProductJsonldSyliusShopProductIndex) => {
  const record = product as UnknownRecord
  const code = getString(record, 'code')
  if (code) {
    return code
  }

  const id = getString(record, '@id') || getString(record, 'id')
  if (id) {
    return id
  }

  return resolveProductName(product)
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

  const productRecord = product as UnknownRecord
  const directSlug =
    getString(productRecord, 'slug') ||
    getString(productRecord, 'code') ||
    getString(productRecord, 'id')
  if (directSlug) {
    return directSlug
  }

  return null
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

const fetchProducts = () =>
  $fetch<HydraCollection<ProductJsonldSyliusShopProductIndex>>(
    '/api/ecommerce/v2/shop/products',
    {
      query: {
        itemsPerPage: 12,
        'order[createdAt]': 'desc',
      },
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )

const fetchTaxons = () =>
  $fetch<HydraCollection<TaxonJsonLdSyliusShopTaxonIndex>>(
    '/api/ecommerce/v2/shop/taxons',
    {
      query: {
        itemsPerPage: 8,
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
} = await useAsyncData('ecommerce-products', fetchProducts, {
  watch: [() => locale.value],
})

const {
  data: taxonsResponse,
  pending: taxonsPending,
  error: taxonsError,
  refresh: refreshTaxons,
} = await useAsyncData('ecommerce-taxons', fetchTaxons, {
  watch: [() => locale.value],
})

const {
  data: channelsResponse,
  pending: channelsPending,
  error: channelsError,
  refresh: refreshChannels,
} = await useAsyncData('ecommerce-channels', fetchChannels, {
  watch: [() => locale.value],
})

const products = computed(() =>
  extractCollectionItems<ProductJsonldSyliusShopProductIndex>(productsResponse.value),
)

const taxons = computed(() =>
  extractCollectionItems<TaxonJsonLdSyliusShopTaxonIndex>(taxonsResponse.value),
)

const channels = computed(() =>
  extractCollectionItems<ChannelJsonLdSyliusShopChannelIndex>(channelsResponse.value),
)

const activeCategory = ref<string | null>(null)

const categories = computed(() => {
  const uniqueCodes = new Set<string>()
  const items = taxons.value
    .map((taxon) => {
      const code = typeof taxon.code === 'string' ? taxon.code : null
      return {
        code,
        label: resolveTaxonName(taxon),
      }
    })
    .filter((item) => {
      const label = item.label.trim()
      if (!label) {
        return false
      }

      if (!item.code) {
        return true
      }

      if (uniqueCodes.has(item.code)) {
        return false
      }

      uniqueCodes.add(item.code)
      return true
    })

  return [
    {
      code: null,
      label: t('pages.ecommerce.categories.all'),
    },
    ...items,
  ]
})

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

const matchesCategory = (
  product: ProductJsonldSyliusShopProductIndex,
  categoryCode: string,
) => {
  if (!categoryCode) {
    return true
  }

  const record = product as UnknownRecord
  if (getString(record, 'mainTaxon') === categoryCode) {
    return true
  }

  const productTaxon = record.productTaxon
  if (Array.isArray(productTaxon)) {
    for (const item of productTaxon) {
      const itemRecord = toRecord(item)
      const taxonCode = getString(itemRecord, 'taxon') || getString(itemRecord, 'code')
      if (taxonCode === categoryCode) {
        return true
      }
    }
  }

  return false
}

const filteredProducts = computed(() => {
  if (!activeCategory.value) {
    return products.value
  }

  return products.value.filter((product) =>
    matchesCategory(product, activeCategory.value as string),
  )
})

const discountedProducts = computed(() =>
  filteredProducts.value.filter((product) => {
    const pricing = resolveProductPricing(product)
    if (!pricing) {
      return false
    }

    const { price, originalPrice } = pricing
    return price != null && originalPrice != null && originalPrice > price
  }),
)

const deals = computed(() => {
  const source = discountedProducts.value.length
    ? discountedProducts.value
    : filteredProducts.value

  return source.slice(0, 3)
})

const dealIdentifiers = computed(() =>
  new Set(deals.value.map((product) => resolveProductIdentifier(product))),
)

const dealsWithRoutes = computed(() =>
  deals.value.map((product) => ({
    product,
    route: getProductDetailRoute(product),
  })),
)

const latestProducts = computed(() => {
  const used = new Set(dealIdentifiers.value)

  return filteredProducts.value
    .filter((product) => !used.has(resolveProductIdentifier(product)))
    .slice(0, 3)
})

const latestProductsWithRoutes = computed(() =>
  latestProducts.value.map((product) => ({
    product,
    route: getProductDetailRoute(product),
  })),
)

const collectionProducts = computed(() => {
  const used = new Set([
    ...dealIdentifiers.value,
    ...latestProducts.value.map((product) => resolveProductIdentifier(product)),
  ])

  return filteredProducts.value
    .filter((product) => !used.has(resolveProductIdentifier(product)))
    .slice(0, 4)
})

const collectionProductsWithRoutes = computed(() =>
  collectionProducts.value.map((product) => ({
    product,
    route: getProductDetailRoute(product),
  })),
)

const collectionImages = computed(() =>
  collectionProducts.value.map((product) =>
    buildImageUrl(resolveProductImagePath(product)),
  ),
)

const hasAnyProducts = computed(() => filteredProducts.value.length > 0)

const anyError = computed(
  () => Boolean(productsError.value || taxonsError.value || channelsError.value),
)

const anyPending = computed(
  () => productsPending.value || taxonsPending.value || channelsPending.value,
)

const dealsSectionRef = ref<HTMLElement | null>(null)
const collectionSectionRef = ref<HTMLElement | null>(null)

const scrollToSection = (element: typeof dealsSectionRef) => {
  if (import.meta.client && element.value) {
    element.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleShopNow = () => {
  scrollToSection(dealsSectionRef)
}

const handleExploreCollection = () => {
  scrollToSection(collectionSectionRef)
}

const checkoutRoute = computed(() => {
  const token = cartStore.token
  if (!token) {
    return null
  }

  return localePath({
    name: 'ecommerce-checkout-address',
    query: { order: token },
  })
})

onMounted(() => {
  cartStore.restore().catch(() => {})
})

const refreshAll = async () => {
  await Promise.all([refreshProducts(), refreshTaxons(), refreshChannels()])
}

const resolveProductPricingDisplay = (
  product: ProductJsonldSyliusShopProductIndex,
) => {
  const pricing = resolveProductPricing(product)
  if (!pricing || pricing.price == null) {
    return null
  }

  const formatter = priceFormatter.value
  const currency = currencyCode.value
  const priceText = formatPriceWithCurrency(pricing.price, formatter, currency)
  const originalText =
    pricing.originalPrice != null &&
    pricing.originalPrice > pricing.price
      ? formatPriceWithCurrency(pricing.originalPrice, formatter, currency)
      : null

  if (!priceText) {
    return null
  }

  return {
    priceText,
    originalText,
  }
}

const resolveProductImageUrl = (product: ProductJsonldSyliusShopProductIndex) =>
  buildImageUrl(resolveProductImagePath(product))
</script>

<template>
  <v-container fluid class="ecommerce-page pa-0">
    <client-only>
      <teleport to="#app-drawer">
        <div class="ecommerce-drawer">
          <h2 class="text-h4 font-weight-bold mb-2">
            {{ t('pages.ecommerce.drawer.title') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-4">
            {{ t('pages.ecommerce.drawer.subtitle') }}
          </p>
          <div class="d-flex align-center gap-2 flex-wrap">
            <v-chip color="primary" variant="tonal" class="mr-2" size="large">
              {{
                t('pages.ecommerce.drawer.metrics.products', {
                  count: filteredProducts.length,
                })
              }}
            </v-chip>
            <v-chip color="secondary" variant="tonal" size="large">
              {{
                t('pages.ecommerce.drawer.metrics.categories', {
                  count: Math.max(categories.length - 1, 0),
                })
              }}
            </v-chip>
          </div>
          <AppButton
            class="mt-4"
            color="primary"
            variant="tonal"
            size="large"
            :loading="anyPending"
            @click="refreshAll"
          >
            {{ t('pages.ecommerce.actions.refresh') }}
          </AppButton>
        </div>
      </teleport>
    </client-only>

    <section class="ecommerce-hero">
      <div
        class="ecommerce-hero__background"
        :style="{ backgroundImage: `url(${HERO_IMAGE_URL})` }"
      />
      <div class="ecommerce-hero__overlay" />
      <div class="ecommerce-hero__content">
        <nav
          class="ecommerce-hero__categories"
          :aria-label="t('pages.ecommerce.categories.title')"
        >
          <button
            v-for="category in categories"
            :key="category.code ?? 'all'"
            type="button"
            class="ecommerce-hero__category"
            :class="{
              'ecommerce-hero__category--active':
                activeCategory === category.code || (!category.code && !activeCategory),
            }"
            @click="activeCategory = category.code"
          >
            {{ category.label }}
          </button>
        </nav>
        <div class="ecommerce-hero__headline">
          <p class="ecommerce-hero__tagline text-body-1 text-uppercase">
            {{ t('pages.ecommerce.hero.tagline') }}
          </p>
          <h1 class="ecommerce-hero__title">
            {{ t('pages.ecommerce.hero.brand') }}
          </h1>
          <p class="ecommerce-hero__description text-body-1">
            {{ t('pages.ecommerce.hero.description') }}
          </p>
          <div class="ecommerce-hero__actions">
            <AppButton color="primary" size="large" @click="handleShopNow">
              {{ t('pages.ecommerce.actions.shopNow') }}
            </AppButton>
            <AppButton
              class="ml-3"
              color="secondary"
              size="large"
              variant="tonal"
              @click="handleExploreCollection"
            >
              {{ t('pages.ecommerce.actions.exploreCollection') }}
            </AppButton>
            <AppButton
              v-if="checkoutRoute"
              class="ml-3"
              color="primary"
              size="large"
              variant="flat"
              :to="checkoutRoute"
            >
              {{ t('pages.ecommerce.actions.goToCheckout') }}
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <section v-if="anyError" class="ecommerce-status">
      <v-alert
        type="error"
        border="start"
        prominent
        variant="tonal"
        class="mb-6"
      >
        <div class="d-flex flex-column flex-md-row align-md-center justify-space-between gap-3">
          <span>{{ t('pages.ecommerce.errors.failedToLoad') }}</span>
          <AppButton color="primary" variant="flat" @click="refreshAll">
            {{ t('pages.ecommerce.actions.retry') }}
          </AppButton>
        </div>
      </v-alert>
    </section>

    <section ref="dealsSectionRef" class="ecommerce-section">
      <div class="ecommerce-section__header">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ t('pages.ecommerce.sections.latestDeals.title') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-0">
            {{ t('pages.ecommerce.sections.latestDeals.subtitle') }}
          </p>
        </div>
      </div>
      <div v-if="anyPending" class="d-flex justify-center my-10">
        <v-progress-circular indeterminate color="primary" size="48" />
      </div>
      <v-row v-else-if="deals.length" class="mt-2" dense>
        <v-col
          v-for="{ product, route } in dealsWithRoutes"
          :key="resolveProductIdentifier(product)"
          cols="12"
          md="4"
        >
          <component
            :is="route ? 'NuxtLink' : 'div'"
            class="ecommerce-product-card__link"
            v-bind="route ? { to: route } : {}"
          >
            <AppCard class="ecommerce-product-card" elevation="3">
              <v-img
                :src="resolveProductImageUrl(product)"
                class="ecommerce-product-card__image"
                height="240"
                cover
                rounded
              >
                <template #placeholder>
                  <v-skeleton-loader type="image" class="h-100" />
                </template>
              </v-img>
              <div class="ecommerce-product-card__body">
                <span class="text-caption text-uppercase text-medium-emphasis">
                  {{ t('pages.ecommerce.labels.deal') }}
                </span>
                <h3 class="text-h5 font-weight-bold mt-1 mb-2">
                  {{ resolveProductName(product) }}
                </h3>
                <p
                  v-if="resolveProductSummary(product)"
                  class="text-body-2 text-medium-emphasis mb-3"
                >
                  {{ resolveProductSummary(product) }}
                </p>
                <div class="ecommerce-product-card__pricing">
                  <template v-if="resolveProductPricingDisplay(product)">
                    <span class="ecommerce-product-card__price">
                      {{ resolveProductPricingDisplay(product)?.priceText }}
                    </span>
                    <span
                      v-if="resolveProductPricingDisplay(product)?.originalText"
                      class="ecommerce-product-card__price--original"
                    >
                      {{ resolveProductPricingDisplay(product)?.originalText }}
                    </span>
                  </template>
                  <span v-else class="text-body-2 text-medium-emphasis">
                    {{ t('pages.ecommerce.fallbacks.priceUnavailable') }}
                  </span>
                </div>
              </div>
            </AppCard>
          </component>
        </v-col>
      </v-row>
      <div v-else class="text-center py-10">
        <p class="text-body-1 text-medium-emphasis mb-0">
          {{ t('pages.ecommerce.fallbacks.noProducts') }}
        </p>
      </div>
    </section>

    <section ref="collectionSectionRef" class="ecommerce-section">
      <div class="ecommerce-section__header">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ t('pages.ecommerce.sections.newCollection.title') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-0">
            {{ t('pages.ecommerce.sections.newCollection.subtitle') }}
          </p>
        </div>
      </div>
      <div class="ecommerce-collection" :class="{ 'ecommerce-collection--empty': !collectionProducts.length }">
        <div v-if="collectionProducts.length" class="ecommerce-collection__grid">
          <component
            :is="route ? 'NuxtLink' : 'div'"
            v-for="({ product, route }, index) in collectionProductsWithRoutes"
            :key="resolveProductIdentifier(product)"
            class="ecommerce-collection__item"
            :class="`ecommerce-collection__item--${index}`"
            :style="{ backgroundImage: `url(${collectionImages[index] ?? FALLBACK_PRODUCT_IMAGE})` }"
            v-bind="route ? { to: route } : {}"
          >
            <div class="ecommerce-collection__overlay">
              <span class="ecommerce-collection__label">
                {{ resolveProductName(product) }}
              </span>
            </div>
          </component>
        </div>
        <div v-else class="text-center py-10">
          <p class="text-body-1 text-medium-emphasis mb-0">
            {{ t('pages.ecommerce.fallbacks.noProducts') }}
          </p>
        </div>
      </div>
    </section>

    <section class="ecommerce-section">
      <div class="ecommerce-section__header">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ t('pages.ecommerce.sections.latestProducts.title') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-0">
            {{ t('pages.ecommerce.sections.latestProducts.subtitle') }}
          </p>
        </div>
      </div>
      <div v-if="anyPending" class="d-flex justify-center my-10">
        <v-progress-circular indeterminate color="primary" size="48" />
      </div>
      <v-row v-else-if="latestProducts.length" class="mt-2" dense>
        <v-col
          v-for="{ product, route } in latestProductsWithRoutes"
          :key="resolveProductIdentifier(product)"
          cols="12"
          md="4"
        >
          <component
            :is="route ? 'NuxtLink' : 'div'"
            class="ecommerce-product-card__link"
            v-bind="route ? { to: route } : {}"
          >
            <AppCard class="ecommerce-product-card" elevation="2">
              <v-img
                :src="resolveProductImageUrl(product)"
                class="ecommerce-product-card__image"
                height="220"
                cover
                rounded
              >
                <template #placeholder>
                  <v-skeleton-loader type="image" class="h-100" />
                </template>
              </v-img>
              <div class="ecommerce-product-card__body">
                <h3 class="text-h5 font-weight-bold mt-1 mb-2">
                  {{ resolveProductName(product) }}
                </h3>
                <p
                  v-if="resolveProductSummary(product)"
                  class="text-body-2 text-medium-emphasis mb-3"
                >
                  {{ resolveProductSummary(product) }}
                </p>
                <div class="ecommerce-product-card__pricing">
                  <template v-if="resolveProductPricingDisplay(product)">
                    <span class="ecommerce-product-card__price">
                      {{ resolveProductPricingDisplay(product)?.priceText }}
                    </span>
                    <span
                      v-if="resolveProductPricingDisplay(product)?.originalText"
                      class="ecommerce-product-card__price--original"
                    >
                      {{ resolveProductPricingDisplay(product)?.originalText }}
                    </span>
                  </template>
                  <span v-else class="text-body-2 text-medium-emphasis">
                    {{ t('pages.ecommerce.fallbacks.priceUnavailable') }}
                  </span>
                </div>
              </div>
            </AppCard>
          </component>
        </v-col>
      </v-row>
      <div v-else class="text-center py-10">
        <p class="text-body-1 text-medium-emphasis mb-0">
          {{
            hasAnyProducts
              ? t('pages.ecommerce.sections.latestProducts.emptyFiltered')
              : t('pages.ecommerce.fallbacks.noProducts')
          }}
        </p>
      </div>
    </section>
  </v-container>
</template>

<style scoped>
.ecommerce-page {
  background: linear-gradient(180deg, rgba(248, 248, 255, 0.9), rgba(238, 241, 255, 0.9));
}

.ecommerce-drawer {
  display: flex;
  flex-direction: column;
}

.ecommerce-hero {
  position: relative;
  border-radius: var(--app-rounded, 18px);
  margin: 0 16px 32px;
  overflow: hidden;
  min-height: 420px;
  box-shadow: var(--app-shadow, 0 32px 60px rgba(15, 23, 42, 0.25));
}

.ecommerce-hero__background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.85);
}

.ecommerce-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(12, 26, 75, 0.7), rgba(12, 26, 75, 0.2));
}

.ecommerce-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px clamp(24px, 6vw, 64px) clamp(40px, 8vw, 80px);
  color: #fff;
}

.ecommerce-hero__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ecommerce-hero__category {
  border: none;
  padding: 10px 18px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.22);
  color: inherit;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.ecommerce-hero__category:hover,
.ecommerce-hero__category:focus-visible {
  background-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.ecommerce-hero__category--active {
  background-color: rgba(255, 255, 255, 0.85);
  color: #0f172a;
}

.ecommerce-hero__headline {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ecommerce-hero__tagline {
  letter-spacing: 0.32em;
  font-weight: 700;
  opacity: 0.8;
}

.ecommerce-hero__title {
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-family: 'Playfair Display', 'Segoe UI', serif;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0;
}

.ecommerce-hero__description {
  max-width: 520px;
  line-height: 1.6;
  opacity: 0.92;
}

.ecommerce-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ecommerce-section {
  margin: 0 16px 40px;
}

.ecommerce-section__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.ecommerce-product-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
}

.ecommerce-product-card__link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.ecommerce-product-card__image {
  border-radius: var(--app-rounded, 18px);
}

.ecommerce-product-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ecommerce-product-card__pricing {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.ecommerce-product-card__price {
  font-size: 1.25rem;
  font-weight: 700;
}

.ecommerce-product-card__price--original {
  font-size: 1rem;
  text-decoration: line-through;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.ecommerce-collection {
  position: relative;
  min-height: 320px;
}

.ecommerce-collection__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, 80px);
  gap: 16px;
}

.ecommerce-collection__item {
  position: relative;
  border-radius: var(--app-rounded, 18px);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  box-shadow: var(--app-shadow, 0 16px 35px rgba(15, 23, 42, 0.22));
}

.ecommerce-collection__item--0 {
  grid-column: 1 / span 3;
  grid-row: 1 / span 4;
}

.ecommerce-collection__item--1 {
  grid-column: 4 / span 3;
  grid-row: 1 / span 2;
}

.ecommerce-collection__item--2 {
  grid-column: 4 / span 3;
  grid-row: 3 / span 2;
}

.ecommerce-collection__item--3 {
  display: none;
}

.ecommerce-collection__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.25));
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.ecommerce-collection__label {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

@media (min-width: 1280px) {
  .ecommerce-collection__item--3 {
    display: block;
    grid-column: 4 / span 3;
    grid-row: 3 / span 2;
  }

  .ecommerce-collection__item--2 {
    grid-column: 4 / span 3;
    grid-row: 2 / span 2;
  }
}

@media (max-width: 960px) {
  .ecommerce-hero {
    margin: 0 12px 28px;
  }

  .ecommerce-section {
    margin: 0 12px 32px;
  }

  .ecommerce-collection__grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 120px);
  }

  .ecommerce-collection__item--0 {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
  }

  .ecommerce-collection__item--1 {
    grid-column: 1 / span 2;
    grid-row: 3 / span 1;
  }

  .ecommerce-collection__item--2 {
    grid-column: 1 / span 1;
    grid-row: 4 / span 1;
  }

  .ecommerce-collection__item--3 {
    grid-column: 2 / span 1;
    grid-row: 4 / span 1;
    display: block;
  }
}

@media (max-width: 600px) {
  .ecommerce-hero__content {
    padding: 24px;
  }

  .ecommerce-hero__title {
    font-size: clamp(2.5rem, 9vw, 3.2rem);
  }

  .ecommerce-collection__grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 160px);
  }

  .ecommerce-collection__item--0,
  .ecommerce-collection__item--1,
  .ecommerce-collection__item--2,
  .ecommerce-collection__item--3 {
    grid-column: 1 / span 1;
    grid-row: auto;
  }
}
</style>
