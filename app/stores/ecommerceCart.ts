import { defineStore } from 'pinia'
import { FetchError } from 'ofetch'
import { computed, ref, watch } from 'vue'

import { normalizeRequestHeaders } from '~/utils/headers'
import {
  getString,
  resolveProductVariants,
  toRecord,
  type UnknownRecord,
} from '~/utils/ecommerce/product'
import type { ChannelJsonLdSyliusShopChannelIndex } from '~/types/channel'
import type { OrderJsonLd } from '~/types/order'
import type {
  ProductJsonldSyliusShopProductIndex,
  ProductJsonldSyliusShopProductShow,
  ProductVariantInterface,
} from '~/types/product'

type ProductInput =
  | ProductJsonldSyliusShopProductIndex
  | ProductJsonldSyliusShopProductShow

type AddItemOptions = {
  product: ProductInput
  variant?: ProductVariantInterface | null
  quantity: number
  channel?: ChannelJsonLdSyliusShopChannelIndex | null
  channelCode?: string | null
  localeCode?: string | null
  options?: Record<string, string | null | undefined>
}

type CreateOrderOptions = {
  channel?: ChannelJsonLdSyliusShopChannelIndex | null
  channelCode?: string | null
  localeCode?: string | null
}

const CART_COOKIE_NAME = 'ecommerce_cart_token'
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export const useEcommerceCartStore = defineStore('ecommerce-cart', () => {
  const cookieRef = useCookie<string | null>(CART_COOKIE_NAME, {
    default: () => null,
    sameSite: 'lax',
    secure: false,
    maxAge: CART_COOKIE_MAX_AGE,
  })

  const order = ref<OrderJsonLd | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const restoring = ref(false)

  const requestHeaders = import.meta.server
    ? normalizeRequestHeaders(useRequestHeaders(['cookie', 'authorization']))
    : undefined

  const token = computed(() => {
    const value = cookieRef.value
    if (!value) {
      return null
    }

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  })

  const itemsCount = computed(() => order.value?.totalQuantity ?? 0)
  const hasItems = computed(() => itemsCount.value > 0)
  const isEmpty = computed(() => !hasItems.value)

  const fetchOptions = computed(() => ({
    headers: requestHeaders,
    credentials: 'include' as const,
  }))

  const setToken = (value: string | null) => {
    cookieRef.value = value ?? null
    if (!value) {
      order.value = null
    }
  }

  const formatError = (err: unknown) => {
    if (err instanceof FetchError) {
      if (typeof err.data === 'string' && err.data.trim().length > 0) {
        return err.data
      }

      if (err.data && typeof err.data === 'object' && 'message' in err.data) {
        const message = (err.data as Record<string, unknown>).message
        if (typeof message === 'string' && message.trim().length > 0) {
          return message
        }
      }

      if (typeof err.message === 'string' && err.message.trim().length > 0) {
        return err.message
      }
    }

    if (err instanceof Error) {
      return err.message
    }

    return 'Unexpected error'
  }

  const captureOrder = (value: OrderJsonLd | null) => {
    order.value = value
    if (!value) {
      return
    }

    const tokenValue = getString(value as UnknownRecord, 'tokenValue')
    if (tokenValue && tokenValue !== token.value) {
      cookieRef.value = tokenValue
    }
  }

  const createOrder = async (options: CreateOrderOptions = {}) => {
    const body: Record<string, unknown> = {}
    const channelCode = options.channelCode ?? resolveChannelCode(options.channel)
    if (channelCode) {
      body.channelCode = channelCode
    }

    if (options.localeCode) {
      body.localeCode = options.localeCode
    }

    const result = await $fetch<OrderJsonLd>('/api/ecommerce/v2/shop/orders', {
      ...fetchOptions.value,
      method: 'POST',
      body,
    })

    const tokenValue = getString(result as UnknownRecord, 'tokenValue')
    if (!tokenValue) {
      throw new Error('Missing order token')
    }

    cookieRef.value = tokenValue
    order.value = result
    return result
  }

  const fetchOrder = async (tokenValue: string) => {
    const result = await $fetch<OrderJsonLd>(
      `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue)}`,
      fetchOptions.value,
    )

    order.value = result
    return result
  }

  const ensureOrder = async (options: CreateOrderOptions = {}) => {
    if (token.value) {
      try {
        if (!order.value) {
          return await fetchOrder(token.value)
        }
        return order.value
      } catch (err) {
        if (err instanceof FetchError && err.statusCode === 404) {
          setToken(null)
        } else {
          throw err
        }
      }
    }

    return await createOrder(options)
  }

  const restore = async () => {
    if (restoring.value || !token.value) {
      return order.value
    }

    restoring.value = true
    try {
      return await fetchOrder(token.value)
    } catch (err) {
      if (err instanceof FetchError && err.statusCode === 404) {
        setToken(null)
      }
      throw err
    } finally {
      restoring.value = false
    }
  }

  const addItem = async (options: AddItemOptions) => {
    loading.value = true
    error.value = null

    try {
      const activeOrder = await ensureOrder(options)
      const tokenValue = token.value
      if (!activeOrder || !tokenValue) {
        throw new Error('Unable to resolve an active cart')
      }

      const payload = buildAddItemPayload(options)

      await $fetch(
        `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue)}/items`,
        {
          ...fetchOptions.value,
          method: 'POST',
          body: payload,
        },
      )

      const updated = await fetchOrder(tokenValue)
      return updated
    } catch (err) {
      const message = formatError(err)
      error.value = message
      throw err instanceof Error ? err : new Error(message)
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    cookieRef.value = null
    order.value = null
    error.value = null
  }

  if (import.meta.client) {
    watch(
      () => token.value,
      (value) => {
        if (value && !order.value && !restoring.value) {
          restore().catch(() => {})
        }

        if (!value) {
          order.value = null
        }
      },
      { immediate: true },
    )
  }

  function buildAddItemPayload({
    product,
    variant,
    quantity,
    options,
  }: AddItemOptions): Record<string, unknown> {
    const payload: Record<string, unknown> = {}

    const sanitizedQuantity = Number.isFinite(quantity)
      ? Math.max(1, Math.min(99, Math.round(quantity)))
      : 1
    payload.quantity = sanitizedQuantity

    const resolvedVariant = variant ?? matchVariant(product, options)
    const variantResource = resolveVariantResource(resolvedVariant)
    if (variantResource) {
      payload.productVariant = variantResource
    } else {
      const productCode = resolveProductCode(product)
      if (productCode) {
        payload.productCode = productCode
      }
    }

    const normalizedOptions = normalizeOptions(options)
    if (normalizedOptions) {
      payload.options = normalizedOptions
    }

    return payload
  }

  function resolveProductCode(product: ProductInput) {
    const record = toRecord(product)
    return getString(record, 'code')
  }

  function resolveChannelCode(
    channel: ChannelJsonLdSyliusShopChannelIndex | null | undefined,
  ) {
    const record = toRecord(channel)
    return getString(record, 'code')
  }

  function normalizeOptions(
    options: Record<string, string | null | undefined> | undefined,
  ) {
    if (!options) {
      return null
    }

    const entries: Record<string, string> = {}
    for (const [key, value] of Object.entries(options)) {
      if (!key || typeof value !== 'string') {
        continue
      }

      const normalizedKey = extractCode(key)
      const normalizedValue = extractCode(value)
      if (normalizedKey && normalizedValue) {
        entries[normalizedKey] = normalizedValue
      }
    }

    return Object.keys(entries).length ? entries : null
  }

  function matchVariant(
    product: ProductInput,
    options: Record<string, string | null | undefined> | undefined,
  ) {
    const variants = resolveProductVariants(product)
    if (!variants.length) {
      return null
    }

    const normalizedSelection = new Map<string, string>()
    if (options) {
      for (const [key, value] of Object.entries(options)) {
        if (typeof value !== 'string') {
          continue
        }

        const optionKey = normalizeKey(key)
        const optionValue = normalizeKey(value)
        if (optionKey && optionValue) {
          normalizedSelection.set(optionKey, optionValue)
        }
      }
    }

    if (!normalizedSelection.size) {
      return variants[0]
    }

    for (const variant of variants) {
      const variantOptions = buildVariantOptionMap(variant)
      let matches = true

      for (const [key, value] of normalizedSelection) {
        const variantValue = variantOptions.get(key)
        if (!variantValue || variantValue !== value) {
          matches = false
          break
        }
      }

      if (matches) {
        return variant
      }
    }

    return variants[0]
  }

  function buildVariantOptionMap(variant: ProductVariantInterface) {
    const map = new Map<string, string>()
    const record = toRecord(variant)
    if (!record) {
      return map
    }

    const sources: unknown[] = []

    if (Array.isArray((record as UnknownRecord).optionValuesCollection)) {
      sources.push(...((record as UnknownRecord).optionValuesCollection as unknown[]))
    }

    if (Array.isArray((record as UnknownRecord).optionValue)) {
      sources.push(...((record as UnknownRecord).optionValue as unknown[]))
    }

    if (Array.isArray((record as UnknownRecord).optionValues)) {
      sources.push(...((record as UnknownRecord).optionValues as unknown[]))
    }

    for (const source of sources) {
      if (typeof source === 'string') {
        const code = extractCode(source)
        const normalized = normalizeKey(code)
        if (normalized) {
          map.set(normalized, normalized)
        }
        continue
      }

      const sourceRecord = toRecord(source)
      if (!sourceRecord) {
        continue
      }

      const optionCode =
        getString(sourceRecord, 'optionCode') ||
        extractCode(getString(sourceRecord, 'option'))

      const valueCode =
        getString(sourceRecord, 'code') || getString(sourceRecord, 'value')

      const optionKey = normalizeKey(optionCode)
      const valueKey = normalizeKey(valueCode)

      if (optionKey && valueKey) {
        map.set(optionKey, valueKey)
      }
    }

    return map
  }

  function normalizeKey(value: string | null | undefined) {
    const code = extractCode(value)
    return code ? code.toLowerCase() : null
  }

  function extractCode(value: string | null | undefined) {
    if (!value) {
      return null
    }

    const trimmed = value.trim()
    if (!trimmed) {
      return null
    }

    const segments = trimmed.split('/')
    return segments.pop() || trimmed
  }

  function resolveVariantResource(variant: ProductVariantInterface | null | undefined) {
    const record = toRecord(variant)
    if (!record) {
      return null
    }

    const iri = getString(record, '@id')
    if (iri) {
      return iri
    }

    const code = getString(record, 'code')
    if (code) {
      return `/api/v2/shop/product-variants/${encodeURIComponent(code)}`
    }

    return null
  }

  return {
    token,
    order,
    loading,
    error,
    itemsCount,
    hasItems,
    isEmpty,
    restore,
    ensureOrder,
    createOrder,
    fetchOrder,
    addItem,
    clear,
    setToken,
    captureOrder,
  }
})
