<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { createError, useHead } from 'nuxt/app'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import type { ChannelJsonLdSyliusShopChannelIndex } from '~/types/channel'
import type { ProductJsonldSyliusShopProductIndex } from '~/types/product'
import type { TaxonJsonLdSyliusShopTaxonIndex } from '~/types/tax'
import {
  buildImageUrl,
  extractCollectionItems,
  extractTaxonCodeFromIri,
  formatPriceWithCurrency,
  getNumber,
  getString,
  resolveDefaultCurrency,
  resolveProductIdentifier,
  resolveProductImagePath,
  resolveProductName,
  resolveProductPricing,
  resolveProductSummary,
  resolveTaxonDescription,
  resolveTaxonName,
  resolveTaxonTranslation,
  toRecord,
  type UnknownRecord,
} from '~/utils/ecommerce/catalog'

definePageMeta({
  title: 'navigation.ecommerce',
})

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80'
const MAX_PRODUCT_SUMMARY_LENGTH = 110

const route = useRoute()
const localePath = useLocalePath()
const { t, locale } = useI18n()

type HydraCollection<T> = {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  data?: T[]
}

const slugParam = computed(() => {
  const raw = route.params.slug
  if (Array.isArray(raw)) {
    return raw.join('/')
  }

  return typeof raw === 'string' ? raw : ''
})

const fetchTaxon = async () => {
  const slug = slugParam.value
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  return await $fetch<TaxonJsonLdSyliusShopTaxonIndex>(
    `/api/ecommerce/v2/shop/taxons-by-slug/${encodeURIComponent(slug)}`,
    {
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )
}

const fetchProducts = async () => {
  const slug = slugParam.value
  if (!slug) {
    return {
      'hydra:member': [],
    } as HydraCollection<ProductJsonldSyliusShopProductIndex>
  }

  return await $fetch<HydraCollection<ProductJsonldSyliusShopProductIndex>>(
    '/api/ecommerce/v2/shop/products',
    {
      query: {
        itemsPerPage: 48,
        taxons: slug,
      },
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )
}

const fetchChannels = () =>
  $fetch<HydraCollection<ChannelJsonLdSyliusShopChannelIndex>>(
    '/api/ecommerce/v2/shop/channels',
    {
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )

const fetchParentTaxon = async () => {
  const taxonRecord = toRecord(taxon.value)
  const parentIri = getString(taxonRecord, 'parent')
  const parentCode = extractTaxonCodeFromIri(parentIri)

  if (!parentCode) {
    return null
  }

  return await $fetch<TaxonJsonLdSyliusShopTaxonIndex>(
    `/api/ecommerce/v2/shop/taxons/${encodeURIComponent(parentCode)}`,
    {
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )
}

const {
  data: taxonData,
  pending: taxonPending,
  error: taxonError,
  refresh: refreshTaxon,
} = await useAsyncData('ecommerce-category-taxon', fetchTaxon, {
  watch: [() => slugParam.value, () => locale.value],
})

const {
  data: productsResponse,
  pending: productsPending,
  error: productsError,
  refresh: refreshProducts,
} = await useAsyncData('ecommerce-category-products', fetchProducts, {
  watch: [() => slugParam.value, () => locale.value],
})

const {
  data: channelsResponse,
  pending: channelsPending,
  error: channelsError,
  refresh: refreshChannels,
} = await useAsyncData('ecommerce-category-channels', fetchChannels, {
  watch: [() => locale.value],
})

const {
  data: parentTaxonData,
  pending: parentPending,
  error: parentError,
  refresh: refreshParent,
} = await useAsyncData('ecommerce-category-parent', fetchParentTaxon, {
  watch: [() => taxonData.value, () => locale.value],
})

const taxon = computed(() => taxonData.value ?? null)
const parentTaxon = computed(() => parentTaxonData.value ?? null)

const channels = computed(() =>
  extractCollectionItems<ChannelJsonLdSyliusShopChannelIndex>(
    channelsResponse.value,
  ),
)

const currencyCode = computed(() =>
  resolveDefaultCurrency(channels.value, 'USD'),
)

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

const taxonName = computed(() => {
  if (!taxon.value) {
    return t('pages.ecommerce.fallbacks.categoryFallback')
  }

  return resolveTaxonName(
    taxon.value,
    locale.value,
    t('pages.ecommerce.fallbacks.categoryFallback'),
  )
})

const taxonDescription = computed(
  () =>
    resolveTaxonDescription(taxon.value, locale.value) ??
    t('pages.ecommerceCategory.fallbacks.description'),
)

const taxonCode = computed(() => getString(toRecord(taxon.value), 'code'))

const parentTranslation = computed(() =>
  resolveTaxonTranslation(parentTaxon.value, locale.value),
)

const parentName = computed(() => {
  if (!parentTaxon.value) {
    return null
  }

  return resolveTaxonName(
    parentTaxon.value,
    locale.value,
    t('pages.ecommerce.fallbacks.categoryFallback'),
  )
})

const parentSlug = computed(() => {
  if (!parentTaxon.value) {
    return null
  }

  const slug = getString(parentTranslation.value, 'slug')
  if (slug) {
    return slug
  }

  const parentRecord = toRecord(parentTaxon.value)
  const code = getString(parentRecord, 'code')
  return code ?? null
})

const goUpLink = computed(() => {
  if (parentSlug.value) {
    return localePath({
      name: 'ecommerce-category-slug',
      params: { slug: parentSlug.value },
    })
  }

  return localePath('ecommerce')
})

const breadcrumbItems = computed(() => {
  const items: { label: string; to: string | null }[] = [
    { label: t('navigation.home'), to: localePath('index') },
    {
      label: t('pages.ecommerceCategory.breadcrumbs.category'),
      to: localePath('ecommerce'),
    },
  ]

  if (parentName.value && parentSlug.value) {
    items.push({
      label: parentName.value,
      to: localePath({
        name: 'ecommerce-category-slug',
        params: { slug: parentSlug.value },
      }),
    })
  }

  items.push({ label: taxonName.value, to: null })
  return items
})

const products = computed(() =>
  extractCollectionItems<ProductJsonldSyliusShopProductIndex>(
    productsResponse.value,
  ),
)

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
      const taxonCode =
        getString(itemRecord, 'taxon') || getString(itemRecord, 'code')
      if (taxonCode === categoryCode) {
        return true
      }
    }
  }

  return false
}

const categoryProducts = computed(() => {
  if (!taxonCode.value) {
    return products.value
  }

  return products.value.filter((product) =>
    matchesCategory(product, taxonCode.value as string),
  )
})

const searchTerm = ref('')
const normalizedSearchTerm = computed(() =>
  searchTerm.value.trim().toLowerCase(),
)

const sortOption = ref<'position' | 'name' | 'price-asc' | 'price-desc'>(
  'position',
)

const sortItems = computed(() => [
  {
    title: t('pages.ecommerceCategory.sort.position'),
    value: 'position',
  },
  {
    title: t('pages.ecommerceCategory.sort.name'),
    value: 'name',
  },
  {
    title: t('pages.ecommerceCategory.sort.priceAsc'),
    value: 'price-asc',
  },
  {
    title: t('pages.ecommerceCategory.sort.priceDesc'),
    value: 'price-desc',
  },
])

type PreparedProduct = {
  product: ProductJsonldSyliusShopProductIndex
  identifier: string
  name: string
  summary: string | null
  imageUrl: string
  price: number | null
  originalPrice: number | null
  position: number | null
  createdAt: string | null
}

const preparedProducts = computed<PreparedProduct[]>(() =>
  categoryProducts.value.map((product) => {
    const name = resolveProductName(
      product,
      locale.value,
      t('pages.ecommerce.fallbacks.unknownProduct'),
    )

    const summary = resolveProductSummary(
      product,
      locale.value,
      MAX_PRODUCT_SUMMARY_LENGTH,
    )
    const record = toRecord(product)

    const pricing = resolveProductPricing(product)

    return {
      product,
      identifier: resolveProductIdentifier(product, name),
      name,
      summary,
      imageUrl: buildImageUrl(
        resolveProductImagePath(product),
        FALLBACK_PRODUCT_IMAGE,
      ),
      price: pricing?.price ?? null,
      originalPrice: pricing?.originalPrice ?? null,
      position: getNumber(record, 'position'),
      createdAt: getString(record, 'createdAt'),
    }
  }),
)

const searchedProducts = computed(() => {
  const term = normalizedSearchTerm.value
  if (!term) {
    return preparedProducts.value
  }

  return preparedProducts.value.filter((item) => {
    const fields = [item.name, item.summary ?? '']
    return fields.some((field) => field.toLowerCase().includes(term))
  })
})

const sortedProducts = computed(() => {
  const items = [...searchedProducts.value]
  const localeCode = locale.value

  switch (sortOption.value) {
    case 'name':
      items.sort((a, b) => a.name.localeCompare(b.name, localeCode))
      break
    case 'price-asc':
      items.sort((a, b) => {
        const aPrice = a.price ?? Number.POSITIVE_INFINITY
        const bPrice = b.price ?? Number.POSITIVE_INFINITY
        return aPrice - bPrice
      })
      break
    case 'price-desc':
      items.sort((a, b) => {
        const aPrice = a.price ?? Number.NEGATIVE_INFINITY
        const bPrice = b.price ?? Number.NEGATIVE_INFINITY
        return bPrice - aPrice
      })
      break
    default:
      items.sort((a, b) => {
        const aPosition = a.position ?? Number.POSITIVE_INFINITY
        const bPosition = b.position ?? Number.POSITIVE_INFINITY
        if (aPosition !== bPosition) {
          return aPosition - bPosition
        }

        const aDate = a.createdAt ?? ''
        const bDate = b.createdAt ?? ''
        return bDate.localeCompare(aDate)
      })
      break
  }

  return items
})

const displayedProducts = computed(() =>
  sortedProducts.value.map((item) => {
    const priceLabel =
      formatPriceWithCurrency(
        item.price,
        priceFormatter.value,
        currencyCode.value,
      ) ?? t('pages.ecommerce.fallbacks.priceUnavailable')

    const originalPriceLabel = formatPriceWithCurrency(
      item.originalPrice,
      priceFormatter.value,
      currencyCode.value,
    )

    return {
      ...item,
      priceLabel,
      originalPriceLabel,
      hasDiscount:
        item.price != null &&
        item.originalPrice != null &&
        item.originalPrice > item.price,
    }
  }),
)

const productCount = computed(() => displayedProducts.value.length)

const itemsCountLabel = computed(() =>
  t('pages.ecommerceCategory.labels.itemsCount', { count: productCount.value }),
)

const isLoading = computed(
  () =>
    taxonPending.value ||
    productsPending.value ||
    channelsPending.value ||
    parentPending.value,
)

const hasError = computed(() =>
  Boolean(
    taxonError.value ||
      productsError.value ||
      channelsError.value ||
      parentError.value,
  ),
)

const refreshAll = () => {
  refreshTaxon()
  refreshProducts()
  refreshChannels()
  refreshParent()
}

watch(
  () => slugParam.value,
  () => {
    searchTerm.value = ''
    sortOption.value = 'position'
  },
)

useHead(() => ({
  title: `${taxonName.value} · ${t('navigation.ecommerce')}`,
}))
</script>

<template>
  <div class="ecommerce-category-page">
    <v-container fluid class="pa-0">
      <section class="category-hero">
        <nav class="category-breadcrumbs" aria-label="Breadcrumb">
          <template
            v-for="(item, index) in breadcrumbItems"
            :key="`${item.label}-${index}`"
          >
            <NuxtLink
              v-if="item.to"
              :to="item.to"
              class="category-breadcrumbs__link"
            >
              {{ item.label }}
            </NuxtLink>
            <span v-else class="category-breadcrumbs__current">{{
              item.label
            }}</span>
            <span
              v-if="index < breadcrumbItems.length - 1"
              class="category-breadcrumbs__separator"
            >
              /
            </span>
          </template>
        </nav>

        <div class="category-hero__header">
          <AppButton
            class="category-hero__up"
            variant="text"
            color="secondary"
            :to="goUpLink"
            :disabled="!taxon"
            prepend-icon="mdi-arrow-left"
          >
            {{ t('pages.ecommerceCategory.actions.goUp') }}
          </AppButton>

          <h1 class="category-hero__title">{{ taxonName }}</h1>
          <p class="category-hero__description">{{ taxonDescription }}</p>
        </div>
      </section>

      <section class="category-toolbar">
        <div class="category-toolbar__left">
          <v-text-field
            v-model="searchTerm"
            :label="t('pages.ecommerceCategory.labels.search')"
            :placeholder="t('pages.ecommerceCategory.labels.searchPlaceholder')"
            density="comfortable"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            class="category-toolbar__search"
          />
        </div>
        <div class="category-toolbar__right">
          <span class="category-toolbar__count">{{ itemsCountLabel }}</span>
          <v-select
            v-model="sortOption"
            :items="sortItems"
            :label="t('pages.ecommerceCategory.labels.sort')"
            density="comfortable"
            variant="outlined"
            hide-details
            class="category-toolbar__sort"
          />
        </div>
      </section>

      <section v-if="hasError" class="category-status">
        <v-alert type="error" variant="tonal" class="mb-4">
          {{ t('pages.ecommerceCategory.status.failed') }}
        </v-alert>
        <AppButton color="primary" @click="refreshAll">
          {{ t('pages.ecommerceCategory.actions.refresh') }}
        </AppButton>
      </section>

      <section v-else class="category-products">
        <div v-if="isLoading" class="category-products__loading">
          <v-progress-circular
            indeterminate
            color="primary"
            size="42"
            class="mr-4"
          />
          <span>{{ t('pages.ecommerceCategory.status.loading') }}</span>
        </div>

        <div v-else>
          <div
            v-if="!displayedProducts.length"
            class="category-products__empty"
          >
            {{ t('pages.ecommerceCategory.fallbacks.empty') }}
          </div>

          <v-row v-else dense class="category-products__grid">
            <v-col
              v-for="item in displayedProducts"
              :key="item.identifier"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <AppCard class="category-product-card" elevation="2">
                <v-img
                  :src="item.imageUrl"
                  :alt="item.name"
                  height="260"
                  cover
                  class="category-product-card__image"
                />

                <div class="category-product-card__body">
                  <h3 class="category-product-card__title">{{ item.name }}</h3>
                  <p v-if="item.summary" class="category-product-card__summary">
                    {{ item.summary }}
                  </p>

                  <div class="category-product-card__pricing">
                    <span class="category-product-card__price">{{
                      item.priceLabel
                    }}</span>
                    <span
                      v-if="item.hasDiscount && item.originalPriceLabel"
                      class="category-product-card__price--original"
                    >
                      {{ item.originalPriceLabel }}
                    </span>
                  </div>
                </div>
              </AppCard>
            </v-col>
          </v-row>
        </div>
      </section>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.ecommerce-category-page {
  background-color: rgb(var(--v-theme-surface));
  min-height: 100vh;
}

.category-hero {
  padding: clamp(32px, 8vw, 72px) clamp(16px, 6vw, 72px);
  background: linear-gradient(
    135deg,
    rgba(38, 93, 214, 0.12),
    rgba(133, 193, 233, 0.08)
  );
}

.category-breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  gap: 8px;
  margin-bottom: 18px;
}

.category-breadcrumbs__link {
  color: rgba(var(--v-theme-primary), 0.9);
  font-weight: 600;
  text-decoration: none;
}

.category-breadcrumbs__link:hover,
.category-breadcrumbs__link:focus-visible {
  text-decoration: underline;
}

.category-breadcrumbs__current {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.category-breadcrumbs__separator {
  color: rgba(var(--v-theme-on-surface), 0.4);
}

.category-hero__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-hero__up {
  align-self: flex-start;
  padding: 0;
}

.category-hero__title {
  font-size: clamp(2.2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

.category-hero__description {
  margin: 0;
  max-width: 720px;
  color: rgba(var(--v-theme-on-surface), 0.72);
  font-size: 1.05rem;
  line-height: 1.6;
}

.category-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px clamp(16px, 6vw, 72px);
}

.category-toolbar__left,
.category-toolbar__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-toolbar__search,
.category-toolbar__sort {
  min-width: 220px;
}

.category-toolbar__count {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.category-status {
  padding: 0 clamp(16px, 6vw, 72px) 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-products {
  padding: 0 clamp(16px, 6vw, 72px) clamp(40px, 8vw, 96px);
}

.category-products__loading {
  display: flex;
  align-items: center;
  gap: 16px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
}

.category-products__empty {
  padding: 48px 0;
  text-align: center;
  font-size: 1.05rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.category-product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-product-card__image {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.category-product-card__body {
  padding: 18px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-product-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.category-product-card__summary {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.66);
  font-size: 0.95rem;
  line-height: 1.5;
}

.category-product-card__pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.category-product-card__price {
  font-weight: 700;
  font-size: 1.05rem;
  color: rgb(var(--v-theme-primary));
}

.category-product-card__price--original {
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.45);
  text-decoration: line-through;
}

@media (max-width: 600px) {
  .category-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .category-toolbar__left,
  .category-toolbar__right {
    width: 100%;
    justify-content: space-between;
  }

  .category-toolbar__search,
  .category-toolbar__sort {
    flex: 1 1 auto;
  }
}
</style>
