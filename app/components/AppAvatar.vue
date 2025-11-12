<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt?: string
    size?: number | string
    icon?: string
  }>(),
  {
    src: undefined,
    alt: undefined,
    size: 48,
    icon: 'mdi-account-circle',
  },
)

const imageError = ref(false)
const optimizedImageError = ref(false)

const normalizedSrc = computed(() => {
  if (typeof props.src !== 'string') {
    return null
  }

  const trimmed = props.src.trim()
  return trimmed.length ? trimmed : null
})

const shouldShowImage = computed(
  () => Boolean(normalizedSrc.value) && !imageError.value,
)

const avatarSize = computed(() => props.size)

const numericAvatarSize = computed(() => {
  const size = avatarSize.value

  if (typeof size === 'number') {
    return Number.isFinite(size) ? Math.max(1, Math.round(size)) : undefined
  }

  const parsed = Number.parseInt(size, 10)
  return Number.isFinite(parsed) ? Math.max(1, parsed) : undefined

  return undefined
})

watch([normalizedSrc, numericAvatarSize], () => {
  imageError.value = false
  optimizedImageError.value = false
})

function createOptimizedImageUrl(size: number) {
  const source = normalizedSrc.value

  if (!source) {
    return null
  }

  try {
    const parsed = new URL(source)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }
  } catch {
    return null
  }

  const targetSize = Math.max(1, Math.round(size))
  const params = new URLSearchParams({
    url: source,
    w: String(targetSize),
    h: String(targetSize),
    fit: 'cover',
    output: 'webp',
  })

  return `https://wsrv.nl/?${params.toString()}`
}

const optimizedSources = computed(() => {
  const size = numericAvatarSize.value ?? 96
  const retinaSize = Math.min(size * 2, 512)

  return {
    base: createOptimizedImageUrl(size),
    retina: createOptimizedImageUrl(retinaSize),
  }
})

const imageSrc = computed(() => {
  if (!optimizedImageError.value) {
    const optimized = optimizedSources.value.base
    if (optimized) {
      return optimized
    }
  }

  return normalizedSrc.value
})

const imageSrcset = computed(() => {
  if (optimizedImageError.value) {
    return undefined
  }

  const entries: string[] = []
  const { base, retina } = optimizedSources.value

  if (base) {
    entries.push(`${base} 1x`)
  }

  if (retina) {
    entries.push(`${retina} 2x`)
  }

  return entries.length ? entries.join(', ') : undefined
})

const imageSizes = computed(() => {
  const size = numericAvatarSize.value
  return size ? `${size}px` : undefined
})

const fallbackAriaLabel = computed(() => {
  const label = props.alt.trim()
  return label.length ? label : undefined
})

const altText = computed(() => props.alt)

const onImageError = () => {
  if (!optimizedImageError.value && optimizedSources.value.base) {
    optimizedImageError.value = true
    return
  }

  imageError.value = true
}
</script>

<template>
  <v-avatar :size="avatarSize" class="app-avatar">
    <img
      v-if="shouldShowImage && normalizedSrc"
      :src="imageSrc"
      :alt="altText"
      class="app-avatar__img"
      loading="lazy"
      decoding="async"
      :srcset="imageSrcset"
      :sizes="imageSizes"
      :width="numericAvatarSize"
      :height="numericAvatarSize"
      @error="onImageError"
    />
    <template v-else>
      <slot name="fallback">
        <v-icon
          :icon="props.icon"
          :size="avatarSize"
          role="img"
          :aria-label="fallbackAriaLabel"
        />
      </slot>
    </template>
  </v-avatar>
</template>

<style scoped>
.app-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
