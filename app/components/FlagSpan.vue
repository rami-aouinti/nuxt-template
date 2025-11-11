<template>
  <span
    class="flag-span"
    :style="styleObj"
    :aria-label="label"
    :title="label"
    role="img"
  >
    {{ emoji }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    code?: string | null
    square?: boolean
    rounded?: boolean
    size?: string
    title?: string
  }>(),
  {
    code: undefined,
    square: false,
    rounded: true,
    size: '1.5rem',
    title: undefined,
  },
)

const normalizeFlagCode = (code: string | null | undefined) => {
  const trimmed = (code ?? '').trim().toLowerCase()
  if (!trimmed) return ''

  if (trimmed === 'en') return 'gb'

  const segments = trimmed.split(/[-_]/)
  const lastSegment = segments.at(-1) ?? trimmed

  if (/^[a-z]{2}$/i.test(lastSegment)) {
    return lastSegment
  }

  return trimmed
}

const toFlagEmoji = (code: string) =>
  Array.from(code.toUpperCase()).reduce((emoji, char) => {
    if (!/[A-Z]/.test(char)) {
      return emoji
    }

    const base = 0x1f1e6
    const offset = char.charCodeAt(0) - 65
    return `${emoji}${String.fromCodePoint(base + offset)}`
  }, '')

const flagCode = computed(() => normalizeFlagCode(props.code))

const emoji = computed(() => {
  const code = flagCode.value

  if (/^[a-z]{2}$/.test(code)) {
    const value = toFlagEmoji(code)
    if (value) {
      return value
    }
  }

  return '🏳️'
})

const styleObj = computed(() => {
  const size = props.size

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    fontSize: size,
    lineHeight: 1,
    borderRadius: props.square ? '0' : props.rounded ? '9999px' : '0.25rem',
  }
})

const label = computed(
  () => props.title || (flagCode.value ? flagCode.value.toUpperCase() : 'Flag'),
)
</script>

<style scoped>
.flag-span {
  min-width: 1em;
}
</style>
