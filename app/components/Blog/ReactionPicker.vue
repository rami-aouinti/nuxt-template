<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { BlogReactionType } from '~/types/blog'
import {
  BLOG_REACTIONS,
  DEFAULT_REACTION_TYPE,
  getReactionDefinition,
  resolveReactionType,
} from '~/utils/reactions'

const props = withDefaults(
  defineProps<{
    modelValue?: string | boolean | null
    count?: number | null
    loading?: boolean
    disabled?: boolean
    size?: 'default' | 'small'
    density?: 'default' | 'comfortable' | 'compact'
    showCount?: boolean
    showCaret?: boolean
  }>(),
  {
    count: null,
    loading: false,
    disabled: false,
    size: 'default',
    density: 'default',
    showCount: true,
    showCaret: true,
  },
)

const emit = defineEmits<{
  (event: 'select', type: BlogReactionType): void
  (event: 'remove'): void
}>()

const hoverActive = ref(false)
const menuPinned = ref(false)

const { t, locale } = useI18n()

const currentType = computed(() => resolveReactionType(props.modelValue ?? null))
const currentDefinition = computed(() => getReactionDefinition(currentType.value))

const buttonLabel = computed(() => {
  if (currentType.value) {
    const key = `blog.reactions.types.${currentType.value}` as const
    const translation = t(key)
    return translation && translation !== key
      ? translation
      : currentType.value.charAt(0).toUpperCase() + currentType.value.slice(1)
  }

  return t('blog.actions.like')
})

const formattedCount = computed(() => {
  if (typeof props.count !== 'number') {
    return '0'
  }

  try {
    return new Intl.NumberFormat(locale.value).format(props.count)
  } catch (error) {
    return String(props.count)
  }
})

const showCount = computed(
  () => props.showCount && typeof props.count === 'number' && props.count >= 0,
)

const buttonSize = computed(() => (props.size === 'small' ? 'small' : undefined))
const caretButtonSize = computed(() => (props.size === 'small' ? 'x-small' : 'small'))
const buttonDensity = computed(() =>
  props.density === 'default' ? undefined : props.density,
)

const menuVisible = computed(() => {
  if (props.disabled) {
    return false
  }

  return hoverActive.value || menuPinned.value
})

const handleMouseEnter = () => {
  if (props.disabled) {
    return
  }

  hoverActive.value = true
}

const handleMouseLeave = () => {
  hoverActive.value = false
}

const closeMenu = () => {
  hoverActive.value = false
  menuPinned.value = false
}

const handleSelect = (type: BlogReactionType) => {
  if (props.disabled || props.loading) {
    return
  }

  emit('select', type)
  closeMenu()
}

const handleButtonClick = () => {
  if (props.disabled || props.loading) {
    return
  }

  if (currentType.value) {
    emit('remove')
    closeMenu()
    return
  }

  emit('select', DEFAULT_REACTION_TYPE)
}

const toggleMenu = () => {
  if (props.disabled || props.loading) {
    return
  }

  menuPinned.value = !menuPinned.value
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      closeMenu()
    }
  },
)
</script>

<template>
  <div
    class="blog-reaction-picker"
    :class="[`blog-reaction-picker--${size}`]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <transition name="blog-reaction-picker-fade">
      <div
        v-if="menuVisible"
        class="blog-reaction-picker__menu"
        role="menu"
        :aria-label="t('blog.dialogs.reactionsTitle')"
      >
        <button
          v-for="reaction in BLOG_REACTIONS"
          :key="reaction.type"
          type="button"
          class="blog-reaction-picker__menu-item"
          @click="handleSelect(reaction.type)"
        >
          <span class="blog-reaction-picker__menu-emoji">{{ reaction.emoji }}</span>
        </button>
      </div>
    </transition>

    <v-btn
      class="blog-reaction-picker__action"
      :class="{ 'blog-reaction-picker__action--reacted': Boolean(currentType) }"
      variant="text"
      :density="buttonDensity"
      :size="buttonSize"
      :loading="loading"
      :disabled="disabled"
      :color="currentDefinition?.color"
      :aria-label="buttonLabel"
      @click="handleButtonClick"
    >
      <template v-if="currentDefinition">
        <span class="blog-reaction-picker__emoji">{{ currentDefinition.emoji }}</span>
      </template>
      <template v-else>
        <v-icon icon="mdi-thumb-up-outline" size="18" class="mr-2" />
      </template>
      <span class="blog-reaction-picker__label">{{ buttonLabel }}</span>
      <span v-if="showCount" class="blog-reaction-picker__count">{{ formattedCount }}</span>
    </v-btn>
  </div>
</template>

<style scoped>
.blog-reaction-picker {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.blog-reaction-picker__menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: rgba(var(--v-theme-surface), 0.95);
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  z-index: 2;
}

.blog-reaction-picker__menu-item {
  border: none;
  background: transparent;
  padding: 4px 8px;
  border-radius: 999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.blog-reaction-picker__menu-item:hover,
.blog-reaction-picker__menu-item:focus-visible {
  transform: translateY(-2px);
  background: rgba(var(--v-theme-primary), 0.08);
  outline: none;
}

.blog-reaction-picker__menu-emoji {
  font-size: 24px;
  line-height: 1;
}

.blog-reaction-picker__menu-label {
  font-size: 11px;
  margin-top: 2px;
}

.blog-reaction-picker__action {
  text-transform: none;
  letter-spacing: normal;
}

.blog-reaction-picker__action--reacted {
  font-weight: 600;
}

.blog-reaction-picker__emoji {
  font-size: 18px;
  margin-right: 6px;
}

.blog-reaction-picker__label {
  white-space: nowrap;
}

.blog-reaction-picker__count {
  margin-left: 6px;
  font-weight: 500;
}

.blog-reaction-picker__caret {
  margin-left: 4px;
}

.blog-reaction-picker--small .blog-reaction-picker__menu {
  padding: 6px 10px;
}

.blog-reaction-picker--small .blog-reaction-picker__menu-item {
  padding: 2px 6px;
}

.blog-reaction-picker--small .blog-reaction-picker__menu-emoji {
  font-size: 20px;
}

.blog-reaction-picker--small .blog-reaction-picker__menu-label {
  font-size: 10px;
}

.blog-reaction-picker-fade-enter-active,
.blog-reaction-picker-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.blog-reaction-picker-fade-enter-from,
.blog-reaction-picker-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
