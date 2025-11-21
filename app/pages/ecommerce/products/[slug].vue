<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import {
  buildProductImageUrl,
  extractCollectionItems,
  getString,
  normalizeAmount,
  resolveProductImagePaths,
  resolveProductImagePath,
  resolveProductPricing,
  resolveProductVariants,
  resolveProductTranslation,
  resolveTranslation,
  toRecord,
  type UnknownRecord,
} from '~/utils/ecommerce/product'
import type {
  ProductJsonldSyliusShopProductIndex,
  ProductJsonldSyliusShopProductShow,
} from '~/types/product'
import { resolveVariantPricings } from '~/utils/ecommerce/product'
import type { ChannelJsonLdSyliusShopChannelIndex } from '~/types/channel'
import { useEcommerceCartStore } from '~/stores/ecommerceCart'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'navigation.ecommerce',
})

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const cartStore = useEcommerceCartStore()

const slug = computed(() => String(route.params.slug ?? ''))

const quantity = ref(1)
const selectedImageIndex = ref(0)
const selectedOptions = ref<Record<string, string | null>>({})
const isAddingToCart = ref(false)
const addToCartError = ref<string | null>(null)

const increaseQuantity = () => {
  quantity.value = Math.min(99, Math.max(1, quantity.value + 1))
}

const decreaseQuantity = () => {
  quantity.value = Math.min(99, Math.max(1, quantity.value - 1))
}

type HydraCollection<T> = {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  data?: T[]
}

const fetchProduct = () =>
  $fetch<ProductJsonldSyliusShopProductShow>(
    `/api/ecommerce/v2/shop/products-by-slug/${encodeURIComponent(slug.value)}`,
    {
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

const fetchLatestProducts = () =>
  $fetch<HydraCollection<ProductJsonldSyliusShopProductIndex>>(
    '/api/ecommerce/v2/shop/products',
    {
      query: {
        itemsPerPage: 6,
        'order[createdAt]': 'desc',
      },
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )

const {
  data: productResponse,
  pending: productPending,
  error: productError,
  refresh: refreshProduct,
} = await useAsyncData(
  () => `ecommerce-product-detail-${slug.value}-${locale.value}`,
  fetchProduct,
  {
    watch: [() => slug.value, () => locale.value],
  },
)

const {
  data: channelsResponse,
  pending: channelsPending,
  error: channelsError,
  refresh: refreshChannels,
} = await useAsyncData(
  () => `ecommerce-product-channels-${locale.value}`,
  fetchChannels,
  {
    watch: [() => locale.value],
  },
)

const {
  data: latestProductsResponse,
  pending: latestProductsPending,
  error: latestProductsError,
  refresh: refreshLatestProducts,
} = await useAsyncData(
  () => `ecommerce-product-latest-${locale.value}`,
  fetchLatestProducts,
  {
    watch: [() => locale.value],
  },
)

const product = computed(() => productResponse.value ?? null)
const channels = computed(() =>
  extractCollectionItems<ChannelJsonLdSyliusShopChannelIndex>(
    channelsResponse.value,
  ),
)
const latestProducts = computed(() =>
  extractCollectionItems<ProductJsonldSyliusShopProductIndex>(
    latestProductsResponse.value,
  ),
)

const defaultChannel = computed(() => channels.value[0] ?? null)

const defaultChannelCode = computed(() => {
  const channelRecord = toRecord(defaultChannel.value)
  return getString(channelRecord, 'code')
})

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

const resolveProductName = (
  item:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
) => {
  const translation = resolveProductTranslation(item, locale.value)
  const translatedName =
    getString(translation, 'name') ||
    getString(translation, 'label') ||
    getString(translation, 'title')
  if (translatedName) {
    return translatedName
  }

  const record = item as UnknownRecord
  const directName = getString(record, 'name')
  if (directName) {
    return directName
  }

  const code = getString(record, 'code')
  if (code) {
    return code
  }

  return t('pages.ecommerce.fallbacks.unknownProduct')
}

const resolveProductSummary = (
  item:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
) => {
  const translation = resolveProductTranslation(item, locale.value)
  const summary =
    getString(translation, 'shortDescription') ||
    getString(translation, 'description') ||
    getString(translation, 'metaDescription')

  return summary || null
}

const resolveProductDescription = (
  item:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
) => {
  const translation = resolveProductTranslation(item, locale.value)
  const description =
    getString(translation, 'description') ||
    getString(translation, 'shortDescription') ||
    getString(translation, 'metaDescription')

  return description || null
}

const resolveProductIdentifier = (
  item:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
) => {
  const record = item as UnknownRecord
  const code = getString(record, 'code')
  if (code) {
    return code
  }

  const id = getString(record, '@id') || getString(record, 'id')
  if (id) {
    return id
  }

  return resolveProductName(item)
}

const resolveProductSlug = (
  item:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
) => {
  const translation = resolveProductTranslation(item, locale.value)
  const translatedSlug =
    getString(translation, 'slug') ||
    getString(translation, 'code') ||
    getString(translation, 'identifier')
  if (translatedSlug) {
    return translatedSlug
  }

  const record = item as UnknownRecord
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
  currency: string,
) => {
  if (amount == null) {
    return null
  }

  const normalizedAmount = amount / 100
  try {
    return formatter.format(normalizedAmount)
  } catch {
    return `${currency} ${normalizedAmount.toFixed(2)}`
  }
}

const resolveProductPricingDisplay = (
  item:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
) => {
  const pricing = resolveProductPricing(item)
  if (!pricing) {
    return null
  }

  const formatter = priceFormatter.value
  const currency = currencyCode.value
  const priceText = formatPriceWithCurrency(pricing.price, formatter, currency)
  const originalText =
    pricing.originalPrice != null && pricing.originalPrice > pricing.price
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

const resolveProductImageUrl = (
  product:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow
    | null,
) => buildProductImageUrl(resolveProductImagePath(product))

const productName = computed(() =>
  product.value
    ? resolveProductName(product.value)
    : t('pages.ecommerce.fallbacks.unknownProduct'),
)

const productShortDescription = computed(() =>
  product.value ? resolveProductSummary(product.value) : null,
)

const productDescription = computed(() =>
  product.value ? resolveProductDescription(product.value) : null,
)

const productPricingDisplay = computed(() =>
  product.value ? resolveProductPricingDisplay(product.value) : null,
)

const canAddToCart = computed(() => Boolean(product.value))

const extractVariantPricing = (
  variant: unknown,
): { price: number | null; originalPrice: number | null } | null => {
  const pricings = resolveVariantPricings(variant)

  if (pricings.length) {
    const primaryPricing = pricings.find(
      (pricing) => normalizeAmount(pricing.price) != null,
    )
    const pricing = primaryPricing || pricings[0]

    return {
      price: normalizeAmount(pricing.price),
      originalPrice: normalizeAmount(pricing.originalPrice),
    }
  }

  const record = toRecord(variant)
  const price = normalizeAmount(record?.price)
  const originalPrice = normalizeAmount(record?.originalPrice)
  const lowestPriceBeforeDiscount = normalizeAmount(
    record?.lowestPriceBeforeDiscount,
  )
  const effectivePrice = price ?? lowestPriceBeforeDiscount ?? originalPrice

  if (effectivePrice == null && originalPrice == null) {
    return null
  }

  return {
    price: effectivePrice,
    originalPrice,
  }
}

const resolveVariantPricingDisplay = (
  variant: unknown,
): { priceText: string; originalText: string | null } | null => {
  const pricing = extractVariantPricing(variant)
  if (!pricing) {
    return null
  }

  const formatter = priceFormatter.value
  const currency = currencyCode.value
  const priceText = formatPriceWithCurrency(pricing.price, formatter, currency)
  const originalText =
    pricing.originalPrice != null && pricing.originalPrice > pricing.price
      ? formatPriceWithCurrency(pricing.originalPrice, formatter, currency)
      : null

  if (!priceText) {
    return null
  }

  return { priceText, originalText }
}

const resolveVariantName = (
  variant: unknown,
  index: number,
): string => {
  const record = toRecord(variant)
  const translation = resolveTranslation(record?.translations, locale.value)
  const name = getString(record, 'name') || getString(translation, 'name')

  if (name) {
    return name
  }

  const descriptor = getString(record, 'descriptor')
  if (descriptor) {
    return descriptor
  }

  const code = getString(record, 'code')
  if (code) {
    return code
  }

  return t('pages.ecommerce.product.variants.defaultName', {
    index: index + 1,
  })
}

const resolveVariantOptions = (variant: unknown): string[] => {
  const record = toRecord(variant)
  if (!record) {
    return []
  }

  const candidates: unknown[] = []

  if (Array.isArray(record.optionValue)) {
    candidates.push(...record.optionValue)
  }

  if (Array.isArray(record.optionValuesCollection)) {
    candidates.push(...record.optionValuesCollection)
  }

  if (Array.isArray(record.optionValues)) {
    candidates.push(...record.optionValues)
  }

  return candidates
    .map((candidate) => {
      const valueRecord = toRecord(candidate)
      if (!valueRecord) {
        if (typeof candidate === 'string') {
          return candidate
        }

        return null
      }

      const translation = resolveTranslation(valueRecord.translations, locale.value)
      return (
        getString(valueRecord, 'value') ||
        getString(valueRecord, 'descriptor') ||
        getString(translation, 'value') ||
        getString(valueRecord, 'code')
      )
    })
    .filter((value): value is string => Boolean(value))
}

const variantSummaries = computed(() => {
  const item = product.value
  if (!item) {
    return []
  }

  const variants = resolveProductVariants(item)

  return variants.map((variant, index) => {
    const record = toRecord(variant)
    const identifier =
      getString(record, '@id') ||
      getString(record, 'id') ||
      getString(record, 'code') ||
      `${index}`

    return {
      identifier,
      name: resolveVariantName(variant, index),
      code: getString(record, 'code') || null,
      pricing: resolveVariantPricingDisplay(variant),
      inStock: record?.inStock ?? null,
      options: resolveVariantOptions(variant),
      apiPath:
        getString(record, '@id') || getString(record, 'productVariant') || null,
    }
  })
})

const productApiReferences = computed(() => {
  const record = toRecord(product.value)
  if (!record) {
    return []
  }

  const references: { label: string; value: string }[] = []
  const productPath = getString(record, '@id') || getString(record, 'id')
  const defaultVariantPath =
    getString(toRecord(record.defaultVariant), '@id') ||
    getString(record, 'defaultVariant')
  const imagePath = (() => {
    const images = record.images
    if (Array.isArray(images) && images.length > 0) {
      const imageRecord = toRecord(images[0])
      return (
        getString(imageRecord, '@id') ||
        getString(imageRecord, 'path') ||
        getString(imageRecord, 'id')
      )
    }

    return null
  })()

  if (productPath) {
    references.push({
      label: t('pages.ecommerce.product.api.productPath'),
      value: productPath,
    })
  }

  if (defaultVariantPath) {
    references.push({
      label: t('pages.ecommerce.product.api.defaultVariantPath'),
      value: defaultVariantPath,
    })
  }

  if (imagePath) {
    references.push({
      label: t('pages.ecommerce.product.api.imagePath'),
      value: imagePath,
    })
  }

  const slugValue = resolveProductSlug(record)
  if (slugValue) {
    references.push({
      label: t('pages.ecommerce.product.api.slug'),
      value: slugValue,
    })
  }

  const code = getString(record, 'code')
  if (code) {
    references.push({
      label: t('pages.ecommerce.product.api.code'),
      value: code,
    })
  }

  return references
})

const productImages = computed(() =>
  product.value
    ? resolveProductImagePaths(product.value).map((path) =>
        buildProductImageUrl(path),
      )
    : [],
)

watch(productImages, (images) => {
  if (!images.length) {
    selectedImageIndex.value = 0
    return
  }

  if (selectedImageIndex.value >= images.length) {
    selectedImageIndex.value = 0
  }
})

watch(quantity, (value) => {
  if (!Number.isFinite(value)) {
    quantity.value = 1
    return
  }

  quantity.value = Math.min(99, Math.max(1, Math.round(value)))
})

onMounted(() => {
  if (cartStore.token && !cartStore.order) {
    cartStore.restore().catch(() => {})
  }
})

const productBreadcrumbs = computed(() => [
  {
    label: t('navigation.home'),
    to: localePath('index'),
  },
  {
    label: t('navigation.ecommerce'),
    to: localePath('ecommerce'),
  },
  {
    label: productName.value,
    to: null,
  },
])

const productRating = computed(() => {
  const record = toRecord(product.value)
  if (!record) {
    return 0
  }

  const ratingValue = record.averageRating ?? record.rating
  const numericValue = normalizeAmount(ratingValue)
  if (numericValue != null) {
    return Math.max(0, Math.min(5, numericValue))
  }

  const floatValue = Number.parseFloat(String(ratingValue ?? ''))
  if (Number.isFinite(floatValue)) {
    return Math.max(0, Math.min(5, floatValue))
  }

  return 0
})

const productReviewCount = computed(() => {
  const record = toRecord(product.value)
  if (!record) {
    return 0
  }

  const directCount =
    record.reviewCount ?? record.reviewsCount ?? record.acceptedReviewsCount
  const numericCount = Number.parseInt(String(directCount ?? ''), 10)
  if (Number.isFinite(numericCount)) {
    return Math.max(0, numericCount)
  }

  const reviews = record.reviews
  if (Array.isArray(reviews)) {
    return reviews.filter(Boolean).length
  }

  return 0
})

const productOptions = computed(() => {
  const item = product.value
  if (!item) {
    return []
  }

  const record = item as UnknownRecord
  const sourceCollections: unknown[] = []

  if (Array.isArray(record.option)) {
    sourceCollections.push(...record.option)
  }

  if (Array.isArray(record.options)) {
    sourceCollections.push(...record.options)
  }

  return sourceCollections
    .map((optionCandidate) => {
      const optionRecord = toRecord(optionCandidate)
      if (!optionRecord) {
        return null
      }

      const translation = resolveTranslation(
        optionRecord.translations,
        locale.value,
      )
      const optionName =
        getString(optionRecord, 'name') ||
        getString(translation, 'name') ||
        getString(optionRecord, 'code') ||
        t('pages.ecommerce.product.fallbacks.option')

      const code =
        getString(optionRecord, 'code') ||
        getString(optionRecord, 'name') ||
        getString(optionRecord, 'id') ||
        optionName

      const valuesSource: unknown[] = []
      if (Array.isArray(optionRecord.value)) {
        valuesSource.push(...optionRecord.value)
      }
      if (Array.isArray(optionRecord.values)) {
        valuesSource.push(...optionRecord.values)
      }

      const values = valuesSource
        .map((valueCandidate) => {
          const valueRecord = toRecord(valueCandidate)
          if (!valueRecord) {
            return null
          }

          const valueTranslation = resolveTranslation(
            valueRecord.translations,
            locale.value,
          )
          const rawValue =
            getString(valueRecord, 'value') ||
            getString(valueRecord, 'code') ||
            getString(valueRecord, 'descriptor') ||
            getString(valueRecord, 'id')

          const label =
            getString(valueRecord, 'value') ||
            getString(valueTranslation, 'value') ||
            getString(valueTranslation, 'name') ||
            rawValue ||
            t('pages.ecommerce.product.fallbacks.optionValue')

          const normalizedCode = rawValue || label

          return normalizedCode ? { code: normalizedCode, label } : null
        })
        .filter((value): value is { code: string; label: string } =>
          Boolean(value),
        )

      if (!values.length) {
        return null
      }

      return {
        code: code ?? optionName,
        name: optionName,
        values,
      }
    })
    .filter(
      (
        option,
      ): option is {
        code: string
        name: string
        values: { code: string; label: string }[]
      } => Boolean(option),
    )
})

watch(
  productOptions,
  (options) => {
    const next: Record<string, string | null> = {}

    for (const option of options) {
      const currentValue = selectedOptions.value[option.code]
      const hasCurrent = option.values.some(
        (value) => value.code === currentValue,
      )
      next[option.code] = hasCurrent
        ? currentValue
        : (option.values[0]?.code ?? null)
    }

    const currentKeys = Object.keys(selectedOptions.value)
    const nextKeys = Object.keys(next)
    const sameLength = currentKeys.length === nextKeys.length
    const sameValues =
      sameLength &&
      nextKeys.every((key) => selectedOptions.value[key] === next[key])

    if (!sameValues) {
      selectedOptions.value = next
    }
  },
  { immediate: true },
)

const normalizedAttributes = computed(() => {
  const item = product.value
  if (!item) {
    return []
  }

  const record = item as UnknownRecord
  const sources: unknown[] = []

  if (Array.isArray(record.attributeValues)) {
    sources.push(...record.attributeValues)
  }
  if (Array.isArray(record.attributes)) {
    sources.push(...record.attributes)
  }
  if (Array.isArray(record.attribute)) {
    sources.push(...record.attribute)
  }

  const entries: { name: string; value: string }[] = []
  const seen = new Set<string>()

  for (const candidate of sources) {
    const attributeRecord = toRecord(candidate)
    if (!attributeRecord) {
      continue
    }

    const translation = resolveTranslation(
      attributeRecord.translation,
      locale.value,
    )
    const rawName =
      getString(attributeRecord, 'name') ||
      getString(translation, 'name') ||
      getString(attributeRecord, 'code')

    const name = rawName || t('pages.ecommerce.product.fallbacks.option')

    const valueCandidates = [
      attributeRecord.value,
      attributeRecord.text,
      attributeRecord.string,
      attributeRecord.integer,
      attributeRecord.float,
      attributeRecord.boolean,
    ]

    let resolvedValue: string | null = null

    for (const candidateValue of valueCandidates) {
      if (
        typeof candidateValue === 'string' &&
        candidateValue.trim().length > 0
      ) {
        resolvedValue = candidateValue
        break
      }

      if (
        typeof candidateValue === 'number' &&
        Number.isFinite(candidateValue)
      ) {
        resolvedValue = candidateValue.toString()
        break
      }

      if (typeof candidateValue === 'boolean') {
        resolvedValue = candidateValue
          ? t('pages.ecommerce.product.boolean.true')
          : t('pages.ecommerce.product.boolean.false')
        break
      }

      if (Array.isArray(candidateValue)) {
        const filtered = candidateValue.filter(
          (item): item is string => typeof item === 'string',
        )
        if (filtered.length) {
          resolvedValue = filtered.join(', ')
          break
        }
      }
    }

    if (!resolvedValue) {
      const translationValue = getString(translation, 'value')
      if (translationValue) {
        resolvedValue = translationValue
      }
    }

    if (!resolvedValue) {
      continue
    }

    const key = `${name}:${resolvedValue}`
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    entries.push({ name, value: resolvedValue })
  }

  return entries
})

const productImagesWithIndex = computed(() =>
  productImages.value.map((url, index) => ({ url, index })),
)

const latestProductsWithRoutes = computed(() =>
  latestProducts.value
    .filter((item) => {
      const slugValue = resolveProductSlug(item)
      const currentSlug = product.value
        ? resolveProductSlug(product.value)
        : null
      return slugValue && slugValue !== currentSlug
    })
    .slice(0, 3)
    .map((item) => ({
      product: item,
      route: resolveProductSlug(item)
        ? localePath({
            name: 'ecommerce-products-slug',
            params: { slug: resolveProductSlug(item) as string },
          })
        : null,
    })),
)

const anyPending = computed(() => productPending.value || channelsPending.value)

const anyError = computed(() =>
  Boolean(productError.value || channelsError.value),
)

const latestProductsErrorState = computed(() =>
  Boolean(latestProductsError.value),
)

useHead(() => {
  const name = productName.value
  const description = productShortDescription.value || productDescription.value

  return {
    title: name
      ? `${name} · ${t('pages.ecommerce.product.meta.brand')}`
      : t('navigation.ecommerce'),
    meta: description
      ? [
          {
            name: 'description',
            content: description,
          },
        ]
      : [],
  }
})

const resolveCartErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  if (
    typeof cartStore.error === 'string' &&
    cartStore.error.trim().length > 0
  ) {
    return cartStore.error
  }

  return t('pages.ecommerce.product.notifications.failedToAdd')
}

const handleAddToCart = async () => {
  if (!product.value || isAddingToCart.value) {
    return
  }

  isAddingToCart.value = true
  addToCartError.value = null

  try {
    const options = { ...selectedOptions.value }
    await cartStore.addItem({
      product: product.value,
      quantity: quantity.value,
      options,
      channel: defaultChannel.value,
      channelCode: defaultChannelCode.value,
      localeCode: locale.value,
    })

    Notify.success(t('pages.ecommerce.product.notifications.addedToCart'))

    const token = cartStore.token
    if (token) {
      const target = localePath({
        name: 'ecommerce-checkout-address',
        query: { order: token },
      })
      await router.push(target)
    }
  } catch (error) {
    const message = resolveCartErrorMessage(error)
    addToCartError.value = message
    Notify.error(message)
  } finally {
    isAddingToCart.value = false
  }
}
</script>

<template>
  <v-container fluid class="product-page pa-0">
    <client-only>
      <teleport to="#app-drawer">
        <div class="product-drawer">
          <div class="animated-badge mb-2">
            <span class="animated-badge__pulse" />
            {{ productName || t('pages.ecommerce.fallbacks.unknownProduct') }}
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ resolveProductSummary(product || {}) || t('pages.ecommerce.fallbacks.summary') }}
          </p>
          <div class="d-flex align-center gap-2 mb-4">
            <v-chip color="primary" variant="tonal">
              {{ productPricingDisplay?.priceText || t('pages.ecommerce.fallbacks.priceUnavailable') }}
            </v-chip>
            <v-chip color="secondary" variant="tonal">
              {{ t('pages.ecommerce.product.reviews.count', { count: productReviewCount }) }}
            </v-chip>
          </div>
          <AppButton
            block
            color="primary"
            variant="flat"
            size="large"
            :loading="isAddingToCart"
            @click="handleAddToCart"
          >
            {{ t('pages.ecommerce.product.actions.addToCart') }}
          </AppButton>
        </div>
      </teleport>
    </client-only>
    <client-only>
      <teleport to="#app-drawer-right">
        <div class="product-drawer__right">
          <div class="animated-badge mb-2">
            <span class="animated-badge__pulse" />
            {{ t('pages.ecommerce.sections.latestProducts.title') }}
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('pages.ecommerce.sections.latestProducts.subtitle') }}
          </p>
          <v-slide-group direction="vertical" show-arrows class="product-drawer__slider">
            <v-slide-group-item
              v-for="{ product: latestProduct, route: latestProductRoute } in latestProductsWithRoutes"
              :key="resolveProductIdentifier(latestProduct)"
              v-slot="{ toggle }"
            >
              <AppCard
                class="product-drawer__card mb-3"
                elevation="1"
                hover
                @click="() => (latestProductRoute ? router.push(latestProductRoute) : toggle())"
              >
                <div class="d-flex align-center gap-3">
                  <v-img
                    :src="resolveProductImageUrl(latestProduct) || FALLBACK_PRODUCT_IMAGE"
                    width="64"
                    height="64"
                    cover
                    class="rounded"
                  />
                  <div class="d-flex flex-column">
                    <h3 class="text-body-1 mb-1 font-weight-semibold">
                      {{ resolveProductName(latestProduct) }}
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-0">
                      {{ resolveProductSummary(latestProduct) || t('pages.ecommerce.fallbacks.summary') }}
                    </p>
                  </div>
                </div>
              </AppCard>
            </v-slide-group-item>
          </v-slide-group>
        </div>
      </teleport>
    </client-only>
    <section class="product-section">
      <div class="product-breadcrumbs">
        <NuxtLink
          v-for="item in productBreadcrumbs"
          :key="item.label"
          :to="item.to || undefined"
          class="product-breadcrumbs__item"
          :class="{ 'product-breadcrumbs__item--current': !item.to }"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div v-if="anyError" class="product-status">
        <v-alert color="error" variant="tonal" class="mb-4">
          <div
            class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4"
          >
            <div>
              <h2 class="text-h5 font-weight-bold mb-1">
                {{ t('pages.ecommerce.product.status.error') }}
              </h2>
              <p class="text-body-2 mb-0">
                {{ t('pages.ecommerce.errors.failedToLoad') }}
              </p>
            </div>
            <div class="d-flex gap-2">
              <AppButton color="primary" variant="flat" @click="refreshProduct">
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
      </div>

      <div
        v-else-if="anyPending"
        class="product-status d-flex justify-center py-12"
      >
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>

      <div v-else-if="product" class="product-layout">
        <div class="product-gallery">
          <AppCard elevation="3" class="product-gallery__card">
            <v-img
              :src="productImages[selectedImageIndex]"
              height="420"
              cover
              class="product-gallery__image"
            >
              <template #placeholder>
                <v-skeleton-loader type="image" class="h-100" />
              </template>
            </v-img>
          </AppCard>
          <div class="product-gallery__thumbnails">
            <AppCard
              v-for="{ url, index } in productImagesWithIndex"
              :key="url"
              :class="[
                'product-thumbnail',
                { 'product-thumbnail--active': index === selectedImageIndex },
              ]"
              elevation="1"
              hover
              @click="selectedImageIndex = index"
            >
              <v-img :src="url" height="96" cover rounded>
                <template #placeholder>
                  <v-skeleton-loader type="image" class="h-100" />
                </template>
              </v-img>
            </AppCard>
          </div>
        </div>

        <div class="product-info">
          <div class="d-flex align-center justify-space-between mb-2">
            <h1 class="text-h3 font-weight-bold mb-0">{{ productName }}</h1>
            <v-chip color="primary" variant="tonal">
              {{ quantity }} ×
              {{
                productPricingDisplay?.priceText ||
                t('pages.ecommerce.fallbacks.priceUnavailable')
              }}
            </v-chip>
          </div>

          <div class="product-rating">
            <v-rating
              :model-value="productRating"
              color="amber"
              readonly
              size="20"
              half-increments
            />
            <span class="text-body-2 text-medium-emphasis">
              {{
                t('pages.ecommerce.product.reviews.count', {
                  count: productReviewCount,
                })
              }}
            </span>
            <NuxtLink to="#reviews" class="product-rating__link">
              {{ t('pages.ecommerce.product.actions.addReview') }}
            </NuxtLink>
          </div>

          <div v-if="productPricingDisplay" class="product-price">
            <span class="product-price__current">
              {{ productPricingDisplay.priceText }}
            </span>
            <span
              v-if="productPricingDisplay.originalText"
              class="product-price__original"
            >
              {{ productPricingDisplay.originalText }}
            </span>
          </div>
          <div v-else class="text-body-2 text-medium-emphasis mb-4">
            {{ t('pages.ecommerce.fallbacks.priceUnavailable') }}
          </div>

          <p
            v-if="productShortDescription"
            class="text-body-1 text-medium-emphasis mb-6"
          >
            {{ productShortDescription }}
          </p>

          <div
            v-for="option in productOptions"
            :key="option.code"
            class="product-option"
          >
            <label
              :for="`option-${option.code}`"
              class="text-body-2 font-weight-medium"
            >
              {{
                t('pages.ecommerce.product.labels.option', {
                  name: option.name,
                })
              }}
            </label>
            <v-chip-group
              v-model="selectedOptions[option.code]"
              class="mt-2"
              filter
              mandatory
            >
              <v-chip
                v-for="value in option.values"
                :key="value.code"
                :value="value.code"
                color="primary"
                variant="tonal"
              >
                {{ value.label }}
              </v-chip>
            </v-chip-group>
          </div>

          <div class="product-quantity">
            <label
              for="product-quantity"
              class="text-body-2 font-weight-medium"
            >
              {{ t('pages.ecommerce.product.quantity.label') }}
            </label>
            <div class="product-quantity__controls">
              <v-btn
                icon="mdi-minus"
                variant="tonal"
                color="primary"
                :aria-label="t('pages.ecommerce.product.quantity.ariaDecrease')"
                @click="decreaseQuantity"
              />
              <v-text-field
                id="product-quantity"
                v-model.number="quantity"
                type="number"
                min="1"
                max="99"
                density="comfortable"
                hide-details
                class="product-quantity__input"
              />
              <v-btn
                icon="mdi-plus"
                variant="tonal"
                color="primary"
                :aria-label="t('pages.ecommerce.product.quantity.ariaIncrease')"
                @click="increaseQuantity"
              />
            </div>
          </div>

          <div class="product-actions">
            <AppButton
              color="primary"
              size="x-large"
              :loading="isAddingToCart"
              :disabled="!canAddToCart || isAddingToCart"
              @click="handleAddToCart"
            >
              {{ t('pages.ecommerce.product.actions.addToCart') }}
            </AppButton>
            <AppButton
              color="secondary"
              variant="tonal"
              size="x-large"
              :to="localePath('ecommerce')"
            >
              {{ t('pages.ecommerce.product.actions.backToShop') }}
            </AppButton>
          </div>

          <v-alert
            v-if="addToCartError"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mt-4"
          >
            {{ addToCartError }}
          </v-alert>

          <div v-if="productDescription" class="product-description">
            <h2 class="text-h6 font-weight-semibold mb-2">
              {{ t('pages.ecommerce.product.sections.details') }}
            </h2>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ productDescription }}
            </p>
          </div>

          <div class="product-variants">
            <div class="product-variants__header">
              <div>
                <h2 class="text-h6 font-weight-semibold mb-1">
                  {{ t('pages.ecommerce.product.sections.variants') }}
                </h2>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{
                    t('pages.ecommerce.product.variants.count', {
                      count: variantSummaries.length,
                    })
                  }}
                </p>
              </div>
              <v-chip color="primary" variant="tonal">
                {{ t('pages.ecommerce.product.sections.api') }}
              </v-chip>
            </div>

            <div
              v-if="variantSummaries.length"
              class="product-variant-grid"
            >
              <AppCard
                v-for="variant in variantSummaries"
                :key="variant.identifier"
                class="product-variant-card"
                elevation="2"
              >
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="d-flex flex-column">
                    <span class="text-subtitle-1 font-weight-semibold">
                      {{ variant.name }}
                    </span>
                    <span
                      v-if="variant.code"
                      class="text-caption text-medium-emphasis"
                    >
                      {{
                        t('pages.ecommerce.product.variants.code', {
                          code: variant.code,
                        })
                      }}
                    </span>
                  </div>
                  <v-chip
                    :color="variant.inStock ? 'success' : 'error'"
                    variant="tonal"
                    size="small"
                  >
                    {{
                      variant.inStock
                        ? t('pages.ecommerce.product.variants.inStock')
                        : t('pages.ecommerce.product.variants.outOfStock')
                    }}
                  </v-chip>
                </div>

                <div v-if="variant.pricing" class="product-variant-card__price">
                  <span class="product-price__current">
                    {{ variant.pricing.priceText }}
                  </span>
                  <span
                    v-if="variant.pricing.originalText"
                    class="product-price__original"
                  >
                    {{ variant.pricing.originalText }}
                  </span>
                </div>

                <p class="text-body-2 text-medium-emphasis mb-2">
                  {{
                    t('pages.ecommerce.product.variants.options', {
                      value: variant.options.length
                        ? variant.options.join(', ')
                        : t('pages.ecommerce.product.variants.noOptions'),
                    })
                  }}
                </p>

                <div
                  v-if="variant.apiPath"
                  class="d-flex align-center gap-2 text-caption text-medium-emphasis"
                >
                  <v-icon icon="mdi-link-variant" size="16" />
                  <span class="text-truncate">{{ variant.apiPath }}</span>
                </div>
              </AppCard>
            </div>
            <p
              v-else
              class="text-body-2 text-medium-emphasis product-variants__empty"
            >
              {{ t('pages.ecommerce.product.variants.empty') }}
            </p>
          </div>

          <div v-if="productApiReferences.length" class="product-api">
            <h2 class="text-h6 font-weight-semibold mb-3">
              {{ t('pages.ecommerce.product.sections.api') }}
            </h2>
            <div class="product-api__list">
              <div
                v-for="reference in productApiReferences"
                :key="reference.label"
                class="product-api__item"
              >
                <span class="text-body-2 font-weight-medium">
                  {{ reference.label }}
                </span>
                <div class="d-flex align-center gap-2 text-caption">
                  <v-icon icon="mdi-earth" size="16" />
                  <span class="text-truncate">{{ reference.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="product-section">
      <v-row dense>
        <v-col cols="12" md="6">
          <AppCard class="product-card" elevation="2">
            <h2 class="text-h5 font-weight-bold mb-3">
              {{ t('pages.ecommerce.product.sections.attributes') }}
            </h2>
            <div v-if="normalizedAttributes.length" class="product-attributes">
              <div
                v-for="attribute in normalizedAttributes"
                :key="`${attribute.name}-${attribute.value}`"
                class="product-attribute"
              >
                <span class="product-attribute__name">{{
                  attribute.name
                }}</span>
                <span class="product-attribute__value">{{
                  attribute.value
                }}</span>
              </div>
            </div>
            <p v-else class="text-body-2 text-medium-emphasis mb-0">
              {{ t('pages.ecommerce.product.empty.attributes') }}
            </p>
          </AppCard>
        </v-col>
        <v-col cols="12" md="6">
          <AppCard id="reviews" class="product-card" elevation="2">
            <h2 class="text-h5 font-weight-bold mb-3">
              {{ t('pages.ecommerce.product.sections.reviews') }}
            </h2>
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{
                t('pages.ecommerce.product.reviews.count', {
                  count: productReviewCount,
                })
              }}
            </p>
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ t('pages.ecommerce.product.empty.reviews') }}
            </p>
            <AppButton color="primary" variant="tonal">
              {{ t('pages.ecommerce.product.actions.addReview') }}
            </AppButton>
          </AppCard>
        </v-col>
      </v-row>
    </section>

    <section class="product-section">
      <div class="product-section__header">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ t('pages.ecommerce.product.sections.latest') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-0">
            {{ t('pages.ecommerce.sections.latestProducts.subtitle') }}
          </p>
        </div>
        <AppButton
          color="secondary"
          variant="tonal"
          :to="localePath('ecommerce')"
        >
          {{ t('pages.ecommerce.actions.exploreCollection') }}
        </AppButton>
      </div>
      <div v-if="latestProductsPending" class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="primary" size="48" />
      </div>
      <v-row v-else-if="latestProductsWithRoutes.length" dense class="mt-2">
        <v-col
          v-for="{
            product: latestProduct,
            route: productRoute,
          } in latestProductsWithRoutes"
          :key="resolveProductIdentifier(latestProduct)"
          cols="12"
          md="4"
        >
          <component
            :is="productRoute ? 'NuxtLink' : 'div'"
            class="product-related-card__link"
            v-bind="productRoute ? { to: productRoute } : {}"
          >
            <AppCard class="product-related-card" elevation="2">
              <v-img
                :src="
                  buildProductImageUrl(
                    resolveProductImagePaths(latestProduct)[0],
                  )
                "
                height="200"
                cover
                rounded
              >
                <template #placeholder>
                  <v-skeleton-loader type="image" class="h-100" />
                </template>
              </v-img>
              <div class="product-related-card__body">
                <h3 class="text-h6 font-weight-bold mb-2">
                  {{ resolveProductName(latestProduct) }}
                </h3>
                <p
                  v-if="resolveProductSummary(latestProduct)"
                  class="text-body-2 text-medium-emphasis mb-3"
                >
                  {{ resolveProductSummary(latestProduct) }}
                </p>
                <div
                  v-if="resolveProductPricingDisplay(latestProduct)"
                  class="product-related-card__price"
                >
                  {{ resolveProductPricingDisplay(latestProduct)?.priceText }}
                </div>
              </div>
            </AppCard>
          </component>
        </v-col>
      </v-row>
      <div v-else class="text-center py-10">
        <p class="text-body-1 text-medium-emphasis mb-0">
          {{
            latestProductsErrorState
              ? t('pages.ecommerce.errors.failedToLoad')
              : t('pages.ecommerce.fallbacks.noProducts')
          }}
        </p>
        <AppButton
          v-if="latestProductsErrorState"
          class="mt-4"
          color="primary"
          variant="flat"
          @click="refreshLatestProducts"
        >
          {{ t('pages.ecommerce.actions.retry') }}
        </AppButton>
      </div>
    </section>
  </v-container>
</template>

<style scoped>
.product-page {
  background: transparent;
  padding: 32px 0 80px;
}

.product-section {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

.product-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.product-breadcrumbs__item {
  color: rgba(var(--v-theme-primary), 1);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.product-breadcrumbs__item::after {
  content: '/';
  color: rgba(var(--v-theme-on-surface), 0.38);
}

.product-breadcrumbs__item:last-child::after,
.product-breadcrumbs__item--current::after {
  content: '';
}

.product-breadcrumbs__item--current {
  color: rgba(var(--v-theme-on-surface), 0.64);
  pointer-events: none;
}

.product-status {
  max-width: 720px;
  margin: 0 auto;
}

.product-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 32px;
  align-items: start;
}

.product-gallery {
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-gallery__card {
  padding: 12px;
}

.product-gallery__image {
  border-radius: var(--app-rounded, 18px);
}

.product-gallery__thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 12px;
}

.product-thumbnail {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-thumbnail:hover {
  transform: translateY(-2px);
}

.product-thumbnail--active {
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18) !important;
}

.product-info {
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.product-rating__link {
  color: rgba(var(--v-theme-primary), 1);
  text-decoration: none;
  font-weight: 500;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin: 12px 0;
}

.product-price__current {
  font-size: 2rem;
  font-weight: 700;
}

.product-price__original {
  font-size: 1.25rem;
  text-decoration: line-through;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.product-option {
  margin-bottom: 16px;
}

.product-quantity {
  margin-top: 8px;
}

.product-quantity__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.product-quantity__input {
  max-width: 120px;
}

.product-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
}

.product-drawer,
.product-drawer__right {
  display: flex;
  flex-direction: column;
}

.product-drawer__slider {
  max-height: 520px;
}

.product-drawer__card {
  cursor: pointer;
}

.product-description {
  margin-top: 16px;
  padding: 16px;
  border-radius: var(--app-rounded, 18px);
  background: rgba(var(--v-theme-surface), 0.9);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.product-variants {
  margin-top: 16px;
}

.product-variants__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.product-variant-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.product-variant-card {
  height: 100%;
  padding: 16px;
}

.product-variant-card__price {
  display: flex;
  gap: 12px;
  align-items: baseline;
  margin: 8px 0;
}

.product-variants__empty {
  margin: 8px 0;
}

.product-api {
  margin-top: 16px;
  padding: 16px;
  border-radius: var(--app-rounded, 18px);
  background: rgba(var(--v-theme-surface), 0.9);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.product-api__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-api__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid rgba(var(--v-theme-outline-variant), 0.6);
  border-radius: var(--app-rounded, 12px);
}

.product-card {
  padding: 24px;
  height: 100%;
}

.product-attributes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-attribute {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.product-attribute__name {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.74);
}

.product-attribute__value {
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.product-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.product-related-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.product-related-card__link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.product-related-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-related-card__price {
  font-weight: 600;
  color: rgba(var(--v-theme-primary), 1);
}

@media (max-width: 1024px) {
  .product-layout {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .product-gallery,
  .product-info {
    grid-column: span 1;
  }

  .product-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 640px) {
  .product-section {
    padding: 0 16px 40px;
  }

  .product-price__current {
    font-size: 1.75rem;
  }

  .product-gallery__image {
    height: 320px;
  }
}
</style>
