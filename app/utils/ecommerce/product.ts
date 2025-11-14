import type {
  ProductJsonldSyliusShopProductIndex,
  ProductJsonldSyliusShopProductShow,
  ProductVariantChannelPricing,
  ProductVariantInterface,
} from '~/types/product'
import type { TaxonJsonLdSyliusShopTaxonIndex } from '~/types/tax'

export type UnknownRecord = Record<string, unknown>

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80'

export const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object')

export const toRecord = (value: unknown): UnknownRecord | null =>
  (isRecord(value) ? (value as UnknownRecord) : null)

export const getString = (
  value: UnknownRecord | null | undefined,
  key: string,
): string | null => {
  if (!value) {
    return null
  }

  const candidate = value[key]
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate
  }

  return null
}

export const normalizeAmount = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export function extractCollectionItems<T>(input: unknown): T[] {
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

export const resolveTranslation = (
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

export const resolveProductTranslation = (
  product:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow
    | null
    | undefined,
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

export const resolveTaxonTranslation = (
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

export const resolveProductVariants = (
  product:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
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

export const resolveVariantPricings = (
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

export const resolveProductPricing = (
  product:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
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

export const resolveProductImagePath = (
  product:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
): string | null => {
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

export const resolveProductImagePaths = (
  product:
    | ProductJsonldSyliusShopProductIndex
    | ProductJsonldSyliusShopProductShow,
): string[] => {
  const record = product as UnknownRecord
  const imageSources = [record.image, record.images, record.productImage]
  const paths = new Set<string>()

  for (const source of imageSources) {
    if (!source) {
      continue
    }

    if (typeof source === 'string' && source.trim().length > 0) {
      paths.add(source)
      continue
    }

    if (Array.isArray(source)) {
      for (const item of source) {
        if (typeof item === 'string' && item.trim().length > 0) {
          paths.add(item)
          continue
        }

        const itemRecord = toRecord(item)
        const path = getString(itemRecord, 'path')
        if (path) {
          paths.add(path)
        }

        const file = getString(itemRecord, 'file')
        if (file) {
          paths.add(file)
        }
      }
    }
  }

  if (!paths.size) {
    return [FALLBACK_PRODUCT_IMAGE]
  }

  return [...paths]
}

export const buildProductImageUrl = (path: string | null | undefined) => {
  if (!path || path.trim().length === 0) {
    return FALLBACK_PRODUCT_IMAGE
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `https://ecommerce.bro-world.org${path.startsWith('/') ? '' : '/'}${path}`
}
