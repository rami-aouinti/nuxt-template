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

const normalizedSrc = computed(() => {
  if (typeof props.src !== 'string') {
    return null
  }

  const trimmed = props.src.trim()
  return trimmed.length ? trimmed : null
})

watch(normalizedSrc, () => {
  imageError.value = false
})

const shouldShowImage = computed(() => Boolean(normalizedSrc.value) && !imageError.value)

const avatarSize = computed(() => props.size)

const fallbackAriaLabel = computed(() => {
  const label = typeof props.alt === 'string' ? props.alt.trim() : ''
  return label.length ? label : undefined
})

const altText = computed(() => (typeof props.alt === 'string' ? props.alt : ''))

const onImageError = () => {
  imageError.value = true
}
</script>

<template>
  <v-avatar :size="avatarSize" class="app-avatar">
    <img
      v-if="shouldShowImage && normalizedSrc"
      :src="normalizedSrc"
      :alt="altText"
      class="app-avatar__img"
      loading="lazy"
      decoding="async"
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
