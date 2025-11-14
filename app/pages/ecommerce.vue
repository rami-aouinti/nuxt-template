<script setup lang="ts">
import { computed, ref } from 'vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { truncateText } from '~/utils/formatters'
import type {
  ProductJsonldSyliusShopProductIndex,
  ProductVariantInterface,
  ProductVariantChannelPricing,
} from '~/types/product'
import type { TaxonJsonLdSyliusShopTaxonIndex } from '~/types/tax'
import type { ChannelJsonLdSyliusShopChannelIndex } from '~/types/channel'

definePageMeta({
  title: 'navigation.ecommerce',
})

const { t, locale } = useI18n()

type UnknownRecord = Record<string, unknown>

type HydraCollection<T> = {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  data?: T[]
}

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1468857006721-c3030f210054?auto=format&fit=crop&w=1600&q=80'
const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80'
const MAX_PRODUCT_SUMMARY_LENGTH = 110

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object')

const toRecord = (value: unknown): UnknownRecord | null =>
  (isRecord(value) ? (value as UnknownRecord) : null)

const getString = (value: UnknownRecord | null, key: string): string | null => {
  if (!value) {
    return null
  }

  const candidate = value[key]
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate
  }

  return null
}

const normalizeAmount = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function extractCollectionItems<T>(input: unknown): T[] {
  if (!input) {
    return []
  }

  if (Array.isArray(input)) {
    return input.filter((item): item is T => Boolean(item))
  }

  if (isRecord(input)) {
    const hydraMember = input['hydra:member']
    if (Array.isArray(hydraMember)) {
      return hydraMember.filter((item): item is T => Boolean(item))
    }

    const member = input.member
    if (Array.isArray(member)) {
      return member.filter((item): item is T => Boolean(item))
    }

    const items = input.items
    if (Array.isArray(items)) {
      return items.filter((item): item is T => Boolean(item))
    }

    const data = input.data
    if (Array.isArray(data)) {
      return data.filter((item): item is T => Boolean(item))
    }
  }

  return []
}

const resolveTranslation = (
  value: unknown,
  localeCode: string,
): UnknownRecord | null => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const record = toRecord(item)
      if (!record) {
        continue
      }

      const itemLocale = getString(record, 'locale')
      if (itemLocale && itemLocale === localeCode) {
        return record
      }
    }

    for (const item of value) {
      const record = toRecord(item)
      if (!record) {
        continue
      }

      if (getString(record, 'name')) {
        return record
      }
    }

    return null
  }

  if (isRecord(value)) {
    const direct = value[localeCode]
    if (isRecord(direct)) {
      return direct
    }

    for (const candidate of Object.values(value)) {
      if (isRecord(candidate) && getString(candidate, 'name')) {
        return candidate
      }
    }
  }

  return null
}

const resolveProductTranslation = (
  product: ProductJsonldSyliusShopProductIndex | null | undefined,
  localeCode: string,
): UnknownRecord | null => {
  if (!product) {
    return null
  }

  const productRecord = product as UnknownRecord
  const translations = productRecord.translations
  let translation = resolveTranslation(translations, localeCode)

  if (translation) {
    return translation
  }

  const translationArray = productRecord.translation
  translation = resolveTranslation(translationArray, localeCode)
  if (translation) {
    return translation
  }

  const fallbackLocale = getString(productRecord, 'fallbackLocale')
  if (fallbackLocale) {
    translation = resolveTranslation(translations, fallbackLocale)
    if (translation) {
      return translation
    }
  }

  const currentLocale = getString(productRecord, 'currentLocale')
  if (currentLocale) {
    translation = resolveTranslation(translations, currentLocale)
    if (translation) {
      return translation
    }
  }

  return null
}

const resolveTaxonTranslation = (
  taxon: TaxonJsonLdSyliusShopTaxonIndex | null | undefined,
  localeCode: string,
): UnknownRecord | null => {
  if (!taxon) {
    return null
  }

  const taxonRecord = taxon as UnknownRecord
  const translations = taxonRecord.translations
  let translation = resolveTranslation(translations, localeCode)
  if (translation) {
    return translation
  }

  const translationArray = taxonRecord.translation
  translation = resolveTranslation(translationArray, localeCode)
  if (translation) {
    return translation
  }

  const fallbackLocale = getString(taxonRecord, 'fallbackLocale')
  if (fallbackLocale) {
    translation = resolveTranslation(translations, fallbackLocale)
    if (translation) {
      return translation
    }
  }

  const currentLocale = getString(taxonRecord, 'currentLocale')
  if (currentLocale) {
    translation = resolveTranslation(translations, currentLocale)
    if (translation) {
      return translation
    }
  }

  return null
}

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

const resolveProductVariants = (
  product: ProductJsonldSyliusShopProductIndex,
): ProductVariantInterface[] => {
  const record = product as UnknownRecord
  const variants: ProductVariantInterface[] = []
  const possibleCollections: unknown[] = []

  if (Array.isArray(record.variant)) {
    possibleCollections.push(...record.variant)
  }

  if (Array.isArray(record.productVariants)) {
    possibleCollections.push(...record.productVariants)
  }

  const enabledVariants = toRecord(record.enabledVariants)
  if (enabledVariants?.productVariant && Array.isArray(enabledVariants.productVariant)) {
    possibleCollections.push(...enabledVariants.productVariant)
  }

  for (const candidate of possibleCollections) {
    if (isRecord(candidate)) {
      variants.push(candidate as ProductVariantInterface)
    }
  }

  return variants
}

const resolveVariantPricings = (
  variant: ProductVariantInterface | null | undefined,
): ProductVariantChannelPricing[] => {
  if (!variant) {
    return []
  }

  const record = variant as UnknownRecord
  const pricing = record.channelPricing
  const pricings: ProductVariantChannelPricing[] = []

  if (Array.isArray(pricing)) {
    for (const entry of pricing) {
      if (isRecord(entry)) {
        pricings.push(entry as ProductVariantChannelPricing)
      }
    }
  }

  return pricings
}

const resolveProductPricing = (
  product: ProductJsonldSyliusShopProductIndex,
): { price: number | null; originalPrice: number | null } | null => {
  const variants = resolveProductVariants(product)
  if (!variants.length) {
    return null
  }

  const variantWithPricing =
    variants.find((variant) => resolveVariantPricings(variant).length > 0) || variants[0]

  const pricings = resolveVariantPricings(variantWithPricing)
  if (!pricings.length) {
    return null
  }

  const primaryPricing = pricings.find((pricing) => normalizeAmount(pricing.price) != null)
  const pricing = primaryPricing || pricings[0]
  const price = normalizeAmount(pricing.price)
  const originalPrice = normalizeAmount(pricing.originalPrice)

  return {
    price,
    originalPrice,
  }
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

const resolveProductImagePath = (product: ProductJsonldSyliusShopProductIndex) => {
  const record = product as UnknownRecord
  const imageSources = [record.image, record.images, record.productImage]

  for (const source of imageSources) {
    if (!source) {
      continue
    }

    if (typeof source === 'string' && source.trim().length > 0) {
      return source
    }

    if (Array.isArray(source)) {
      for (const item of source) {
        if (typeof item === 'string' && item.trim().length > 0) {
          return item
        }

        const itemRecord = toRecord(item)
        const path = getString(itemRecord, 'path')
        if (path) {
          return path
        }

        const file = getString(itemRecord, 'file')
        if (file) {
          return file
        }
      }
    }
  }

  return null
}

const buildImageUrl = (path: string | null | undefined) => {
  if (!path || path.trim().length === 0) {
    return FALLBACK_PRODUCT_IMAGE
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `https://ecommerce.bro-world.org${path.startsWith('/') ? '' : '/'}${path}`
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

const latestProducts = computed(() => {
  const used = new Set(dealIdentifiers.value)

  return filteredProducts.value
    .filter((product) => !used.has(resolveProductIdentifier(product)))
    .slice(0, 3)
})

const collectionProducts = computed(() => {
  const used = new Set([
    ...dealIdentifiers.value,
    ...latestProducts.value.map((product) => resolveProductIdentifier(product)),
  ])

  return filteredProducts.value
    .filter((product) => !used.has(resolveProductIdentifier(product)))
    .slice(0, 4)
})

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
          v-for="product in deals"
          :key="resolveProductIdentifier(product)"
          cols="12"
          md="4"
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
              <p v-if="resolveProductSummary(product)" class="text-body-2 text-medium-emphasis mb-3">
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
          <div
            v-for="(product, index) in collectionProducts"
            :key="resolveProductIdentifier(product)"
            class="ecommerce-collection__item"
            :class="`ecommerce-collection__item--${index}`"
            :style="{ backgroundImage: `url(${collectionImages[index] ?? FALLBACK_PRODUCT_IMAGE})` }"
          >
            <div class="ecommerce-collection__overlay">
              <span class="ecommerce-collection__label">
                {{ resolveProductName(product) }}
              </span>
            </div>
          </div>
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
          v-for="product in latestProducts"
          :key="resolveProductIdentifier(product)"
          cols="12"
          md="4"
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
              <p v-if="resolveProductSummary(product)" class="text-body-2 text-medium-emphasis mb-3">
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
