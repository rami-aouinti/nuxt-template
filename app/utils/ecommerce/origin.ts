import { useRuntimeConfig } from '#imports'

const DEFAULT_ECOMMERCE_ORIGIN = 'https://ecommerce'

let cachedOrigin: string | null = null

const normalizeOrigin = (value: string) => value.replace(/\/+$/, '')

export function getEcommerceOrigin(): string {
  if (cachedOrigin) {
    return cachedOrigin
  }

  try {
    const runtimeConfig = useRuntimeConfig()
    const configuredOrigin =
      runtimeConfig.public?.ecommerce?.origin ||
      runtimeConfig.ecommerce?.origin ||
      DEFAULT_ECOMMERCE_ORIGIN

    cachedOrigin = normalizeOrigin(configuredOrigin || DEFAULT_ECOMMERCE_ORIGIN)
    return cachedOrigin
  } catch {
    cachedOrigin = DEFAULT_ECOMMERCE_ORIGIN
    return cachedOrigin
  }
}
