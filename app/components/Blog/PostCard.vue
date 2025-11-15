<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, ref, watch } from 'vue'
import type {
  BlogCommentViewModel,
  BlogPostViewModel,
  BlogReactionType,
} from '~/types/blog'
import {
  resolveReactionType,
  getReactionDefinition,
  type BlogReactionDefinition,
} from '~/utils/reactions'
import { useBlogAuthor } from '~/composables/useBlogAuthor'
import {
  useThemePreferences,
  radiusValues,
  shadowValues,
  shadowHoverValues,
} from '~/composables/useThemePreferences'
import AppCard from '~/components/ui/AppCard.vue'
import BlogSharedPostPreview from '~/components/Blog/SharedPostPreview.vue'
import { resolvePostTags } from '~/utils/blog/posts'

defineOptions({ name: 'BlogPostCard' })

const props = defineProps<{
  post: BlogPostViewModel
  loggedIn: boolean
  canEdit: boolean
  excerpt: string
  formatRelativePublishedAt: (value: string) => string
  formatPublishedAt: (value: string) => string
  currentUserId?: string | null
}>()

const emit = defineEmits<{
  'request-edit': [BlogPostViewModel]
  'submit-edit': [BlogPostViewModel]
  delete: [BlogPostViewModel]
  'select-reaction': [{ post: BlogPostViewModel; type: BlogReactionType }]
  'remove-reaction': [BlogPostViewModel]
  'show-reactions': [BlogPostViewModel]
  'toggle-comments': [BlogPostViewModel]
  share: [BlogPostViewModel]
  'submit-comment': [BlogPostViewModel]
  'select-comment-reaction': [
    {
      post: BlogPostViewModel
      comment: BlogCommentViewModel
      type: BlogReactionType
    },
  ]
  'remove-comment-reaction': [
    { post: BlogPostViewModel; comment: BlogCommentViewModel },
  ]
  'submit-comment-reply': [
    { post: BlogPostViewModel; comment: BlogCommentViewModel },
  ]
  'submit-comment-edit': [
    {
      post: BlogPostViewModel
      comment: BlogCommentViewModel
      content: string
    },
  ]
  'delete-comment': [{ post: BlogPostViewModel; comment: BlogCommentViewModel }]
  'select-tag': [{ post: BlogPostViewModel; tag: string; label: string }]
}>()

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { getAuthorName, getAuthorProfileLink, getAuthorAvatar } = useBlogAuthor()
const { radius, shadow } = useThemePreferences()

interface NormalizedMediaItem {
  id: string
  src: string
  alt: string
  kind: 'image' | 'video' | 'unknown'
}

type UrlPreview =
  | {
      kind: 'image'
      src: string
      href: string
      display: string
      alt: string
    }
  | {
      kind: 'video'
      src: string
      href: string
      display: string
    }
  | {
      kind: 'embed'
      provider: 'youtube'
      embed: string
      href: string
      display: string
    }
  | {
      kind: 'link'
      href: string
      display: string
    }

const imageExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.avif',
  '.svg',
]
const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mkv']

const postCardStyle = computed(() => {
  const radiusValue = radiusValues[radius.value] ?? radiusValues.md
  const shadowValue = shadowValues[shadow.value] ?? shadowValues.regular
  const hoverShadowValue =
    shadowHoverValues[shadow.value] ?? shadowHoverValues.regular

  return {
    '--blog-post-card-radius': radiusValue,
    '--blog-post-card-shadow': shadowValue,
    '--blog-post-card-hover-shadow': hoverShadowValue,
  }
})

const postLink = computed(() => localePath(`/post/${props.post.slug}`))
const authorName = computed(() => getAuthorName(props.post.user))
const authorLink = computed(() => getAuthorProfileLink(props.post.user))
const authorAvatar = computed(() => getAuthorAvatar(props.post.user))
const excerptState = computed(() => {
  const trimmedExcerpt = props.excerpt.trim()

  if (trimmedExcerpt.length > 0) {
    return {
      text: trimmedExcerpt,
      isMuted: false,
    }
  }

  return {
    text: '',
    isMuted: true,
  }
})

const tryParseUrl = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  try {
    return new URL(value)
  } catch {
    return null
  }
}

const isMatchingExtension = (value: string, extensions: string[]) => {
  const normalized = value.toLowerCase()
  return extensions.some(
    (extension) => normalized.includes('.') && normalized.endsWith(extension),
  )
}

const resolveYoutubeEmbed = (url: URL) => {
  const host = url.hostname.replace('www.', '')
  let videoId: string | null = null

  if (host === 'youtu.be') {
    videoId = url.pathname.replace(/^\//, '') || null
  } else if (host.endsWith('youtube.com')) {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v')
    } else if (url.pathname.startsWith('/embed/')) {
      videoId = url.pathname.split('/')[2] ?? null
    } else if (url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/')[2] ?? null
    }
  }

  if (!videoId) {
    return null
  }

  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`)

  const playlist = url.searchParams.get('list')
  if (playlist) {
    embedUrl.searchParams.set('list', playlist)
  }

  const startTime = url.searchParams.get('start') ?? url.searchParams.get('t')
  if (startTime) {
    const sanitized = startTime.replace(/[^0-9]/g, '')
    if (sanitized) {
      embedUrl.searchParams.set('start', sanitized)
    }
  }

  return embedUrl.toString()
}

const resolveUrlPreview = (
  value: string | null | undefined,
): UrlPreview | null => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const parsedUrl = tryParseUrl(trimmed)

  if (isMatchingExtension(trimmed, imageExtensions)) {
    return {
      kind: 'image',
      src: trimmed,
      href: parsedUrl?.href ?? trimmed,
      display: parsedUrl?.hostname ?? trimmed,
      alt: props.post.title,
    }
  }

  if (isMatchingExtension(trimmed, videoExtensions)) {
    return {
      kind: 'video',
      src: trimmed,
      href: parsedUrl?.href ?? trimmed,
      display: parsedUrl?.hostname ?? trimmed,
    }
  }

  if (parsedUrl) {
    const youtubeEmbed = resolveYoutubeEmbed(parsedUrl)
    if (youtubeEmbed) {
      return {
        kind: 'embed',
        provider: 'youtube',
        embed: youtubeEmbed,
        href: parsedUrl.href,
        display: parsedUrl.hostname,
      }
    }

    return {
      kind: 'link',
      href: parsedUrl.href,
      display: parsedUrl.hostname,
    }
  }

  return null
}

const candidateUrl = computed(() => {
  const rawUrl = props.post.url?.trim()
  if (rawUrl) {
    return rawUrl
  }

  const titleValue = props.post.title?.trim()
  if (titleValue && /^https?:\/\//i.test(titleValue)) {
    return titleValue
  }

  return null
})

const urlPreview = computed(() => resolveUrlPreview(candidateUrl.value))

const mediaGallery = computed<NormalizedMediaItem[]>(() => {
  if (!Array.isArray(props.post.medias) || props.post.medias.length === 0) {
    return []
  }

  return props.post.medias
    .map((media, index) => {
      const src =
        media.url ?? (media as unknown as { path?: string }).path ?? ''
      const trimmedSrc = src.trim()

      if (!trimmedSrc) {
        return null
      }

      const type = media.type?.toLowerCase() ?? ''
      let kind: NormalizedMediaItem['kind'] = 'unknown'

      if (
        type.startsWith('image/') ||
        isMatchingExtension(trimmedSrc, imageExtensions)
      ) {
        kind = 'image'
      } else if (
        type.startsWith('video/') ||
        isMatchingExtension(trimmedSrc, videoExtensions)
      ) {
        kind = 'video'
      }

      return {
        id: media.id ?? `${props.post.id}-media-${index}`,
        src: trimmedSrc,
        alt: media.alt ?? props.post.title ?? 'Post media',
        kind,
      }
    })
    .filter((media): media is NormalizedMediaItem => Boolean(media))
})

const postTags = computed(() =>
  resolvePostTags(props.post).map((tag) => ({
    value: tag,
    label: tag.startsWith('#') ? tag : `#${tag}`,
  })),
)
const sharedPost = computed(() => props.post.sharedFrom ?? null)

const hasVisualPreview = computed(() =>
  Boolean(urlPreview.value && urlPreview.value.kind !== 'link'),
)
const reactionType = computed(() =>
  resolveReactionType(props.post.isReacted ?? null),
)
const reactionCount = computed(() => props.post.reactions_count ?? 0)
const reactionPreviewIcons = computed<BlogReactionDefinition[]>(() => {
  const previews = props.post.reactions_preview ?? []
  const seen = new Set<BlogReactionType>()
  const unique: BlogReactionDefinition[] = []

  for (const preview of previews) {
    const definition = getReactionDefinition(preview.type)
    if (!definition || seen.has(definition.type)) {
      continue
    }

    unique.push(definition)
    seen.add(definition.type)

    if (unique.length >= 4) {
      break
    }
  }

  return unique
})
const commentCount = computed(() => props.post.totalComments ?? 0)
const shareCount = computed(() => props.post.sharedFrom?.length ?? 0)
const currentUserId = computed(() => props.currentUserId ?? null)

const formatCount = (value: number) => {
  try {
    return new Intl.NumberFormat(locale.value).format(value)
  } catch {
    return String(value)
  }
}

const formattedReactionCount = computed(() => formatCount(reactionCount.value))
const formattedCommentCount = computed(() => formatCount(commentCount.value))
const formattedShareCount = computed(() => formatCount(shareCount.value))

const commentsToggleLabel = computed(() => {
  const baseKey = props.post.ui?.commentsVisible
    ? 'blog.actions.hideComments'
    : 'blog.actions.showComments'
  const base = t(baseKey)
  if (commentCount.value <= 0) {
    return base
  }

  return `${base} (${t('blog.stats.comments', { count: commentCount.value })})`
})

const reactionsButtonLabel = computed(() => {
  const base = t('blog.actions.viewReactions')
  if (reactionCount.value <= 0) {
    return base
  }

  return `${base} (${t('blog.stats.reactions', { count: reactionCount.value })})`
})

const shareButtonLabel = computed(() => {
  const base = t('blog.actions.sharePost')
  if (shareCount.value <= 0) {
    return base
  }

  return `${base} (${t('blog.stats.shares', { count: shareCount.value })})`
})

const isMenuOpen = ref(false)
const isDeleteLoading = computed(() => props.post.ui?.deleteLoading ?? false)
const isMediaPreviewOpen = ref(false)
const activeMedia = ref<NormalizedMediaItem | null>(null)

const openMediaPreview = (media: NormalizedMediaItem) => {
  if (media.kind !== 'image') {
    return
  }

  activeMedia.value = media
  isMediaPreviewOpen.value = true
}

const closeMediaPreview = () => {
  isMediaPreviewOpen.value = false
}

watch(isMediaPreviewOpen, (value) => {
  if (!value) {
    activeMedia.value = null
  }
})

const onSelectReaction = (type: BlogReactionType) =>
  emit('select-reaction', { post: props.post, type })
const onRemoveReaction = () => emit('remove-reaction', props.post)
const onSubmitComment = () => emit('submit-comment', props.post)
const onSelectCommentReaction = (payload: {
  comment: BlogCommentViewModel
  type: BlogReactionType
}) => emit('select-comment-reaction', { post: props.post, ...payload })
const onRemoveCommentReaction = (comment: BlogCommentViewModel) =>
  emit('remove-comment-reaction', { post: props.post, comment })
const onSubmitCommentReply = (comment: BlogCommentViewModel) =>
  emit('submit-comment-reply', { post: props.post, comment })
const onSubmitCommentEdit = (payload: {
  comment: BlogCommentViewModel
  content: string
}) => emit('submit-comment-edit', { post: props.post, ...payload })
const onDeleteComment = (comment: BlogCommentViewModel) =>
  emit('delete-comment', { post: props.post, comment })
const onRequestEdit = () => {
  emit('request-edit', props.post)
  isMenuOpen.value = false
}
const onDeletePost = () => {
  emit('delete', props.post)
  isMenuOpen.value = false
}

const onSelectTag = (tag: { value: string; label: string }) => {
  emit('select-tag', { post: props.post, tag: tag.value, label: tag.label })
}
</script>

<template>
  <AppCard variant="text" class="facebook-post-card" :style="postCardStyle">
    <div class="facebook-post-card__header">
      <div class="facebook-post-card__avatar">
        <NuxtLink
          v-if="authorLink"
          :to="authorLink"
          class="facebook-post-card__avatar-link text-decoration-none"
          :aria-label="authorName"
        >
          <AppAvatar :src="authorAvatar" :alt="authorName" size="48" />
        </NuxtLink>
        <AppAvatar v-else :src="authorAvatar" :alt="authorName" size="48" />
      </div>
      <div class="facebook-post-card__header-info">
        <div class="facebook-post-card__author">
          <NuxtLink
            v-if="authorLink"
            :to="authorLink"
            class="facebook-post-card__author-link text-decoration-none"
            :aria-label="authorName"
          >
            {{ authorName }}
          </NuxtLink>
          <span v-else class="facebook-post-card__author-link">
            {{ authorName }}
          </span>
        </div>
        <div class="facebook-post-card__meta">
          <span>{{ formatRelativePublishedAt(post.publishedAt) }}</span>
          <span class="facebook-post-card__meta-separator">·</span>
          <v-icon
            icon="mdi-earth"
            size="14"
            class="facebook-post-card__meta-icon"
            aria-hidden="true"
          />
        </div>
      </div>
      <v-menu
        v-if="canEdit"
        v-model="isMenuOpen"
        location="bottom end"
        offset="8"
      >
        <template #activator="{ props: activatorProps }">
          <v-btn
            icon
            variant="text"
            size="sm"
            class="facebook-post-card__menu-btn"
            v-bind="activatorProps"
            :disabled="activatorProps.disabled || isDeleteLoading"
            :loading="isDeleteLoading"
          >
            <v-icon size="sm" icon="mdi-dots-vertical" />
          </v-btn>
        </template>

        <v-list density="compact" nav>
          <v-list-item @click="onRequestEdit">
            <template #prepend>
              <v-icon size="sm" icon="mdi-pencil" />
            </template>
            <v-list-item-title>{{
              t('common.actions.edit')
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item :disabled="isDeleteLoading" @click="onDeletePost">
            <template #prepend>
              <v-icon
                v-if="!isDeleteLoading"
                size="sm"
                icon="mdi-trash-can-outline"
              />
              <v-progress-circular v-else indeterminate size="16" width="2" />
            </template>
            <v-list-item-title>
              {{ t('common.actions.delete') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="facebook-post-card__body my-2">
      <NuxtLink
        :to="postLink"
        class="facebook-post-card__title text-decoration-none"
      >
        {{ post.title }}
      </NuxtLink>
      <p
        class="facebook-post-card__text"
        :class="{ 'facebook-post-card__text--muted': excerptState.isMuted }"
      >
        {{ excerptState.text }}
      </p>
      <div v-if="postTags.length" class="facebook-post-card__tags">
        <v-chip
          v-for="tag in postTags"
          :key="tag.value"
          class="facebook-post-card__tag"
          color="primary"
          variant="tonal"
          size="small"
          :ripple="false"
          @click="onSelectTag(tag)"
        >
          {{ tag.label }}
        </v-chip>
      </div>
      <div
        v-if="urlPreview"
        class="facebook-post-card__preview"
        :class="{
          'facebook-post-card__preview--media': hasVisualPreview,
        }"
      >
        <div
          v-if="urlPreview.kind === 'image'"
          class="facebook-post-card__preview-media"
        >
          <v-img
            :src="urlPreview.src"
            :alt="urlPreview.alt"
            cover
            class="facebook-post-card__preview-image"
          />
        </div>
        <div
          v-else-if="urlPreview.kind === 'video'"
          class="facebook-post-card__preview-media facebook-post-card__preview-media--video"
        >
          <video
            :src="urlPreview.src"
            controls
            playsinline
            preload="metadata"
            class="facebook-post-card__preview-video"
          />
        </div>
        <div
          v-else-if="
            urlPreview.kind === 'embed' && urlPreview.provider === 'youtube'
          "
          class="facebook-post-card__preview-media facebook-post-card__preview-media--video"
        >
          <div class="facebook-post-card__embed-wrapper">
            <iframe
              :src="urlPreview.embed"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
        <a
          :href="urlPreview.href"
          class="facebook-post-card__preview-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <v-icon
            :icon="
              urlPreview.kind === 'link'
                ? 'mdi-link-variant'
                : urlPreview.kind === 'video' || urlPreview.kind === 'embed'
                  ? 'mdi-play-circle'
                  : 'mdi-image-outline'
            "
            class="facebook-post-card__preview-icon"
            size="18"
          />
          <span class="facebook-post-card__preview-host">
            {{ urlPreview.display }}
          </span>
          <v-icon
            icon="mdi-open-in-new"
            class="facebook-post-card__preview-open"
            size="16"
          />
        </a>
      </div>
      <div v-if="sharedPost" class="facebook-post-card__shared-post">
        <BlogSharedPostPreview
          :post="sharedPost"
          :format-relative-published-at="formatRelativePublishedAt"
        />
      </div>
      <div v-if="mediaGallery.length" class="facebook-post-card__media-gallery">
        <div
          v-for="media in mediaGallery"
          :key="media.id"
          class="facebook-post-card__media-item"
        >
          <v-img
            v-if="media.kind === 'image'"
            :src="media.src"
            :alt="media.alt"
            cover
            class="facebook-post-card__media-image"
            role="button"
            tabindex="0"
            :aria-label="t('blog.actions.viewImage')"
            :title="t('blog.actions.viewImage')"
            @click="openMediaPreview(media)"
            @keyup.enter.prevent="openMediaPreview(media)"
            @keyup.space.prevent="openMediaPreview(media)"
          >
            <template #placeholder>
              <div class="facebook-post-card__media-placeholder">
                <v-progress-circular indeterminate size="24" width="3" />
              </div>
            </template>
          </v-img>
          <div
            v-else-if="media.kind === 'video'"
            class="facebook-post-card__media-video"
          >
            <video :src="media.src" controls playsinline preload="metadata" />
          </div>
          <div v-else class="facebook-post-card__media-fallback">
            <v-icon icon="mdi-file" size="24" />
            <span>{{ media.alt }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="facebook-post-card__stats">
      <div class="facebook-post-card__stats-left">
        <div
          v-if="reactionPreviewIcons.length || reactionCount > 0"
          class="facebook-post-card__reaction-summary"
        >
          <div
            v-if="reactionPreviewIcons.length"
            class="facebook-post-card__reaction-icons"
          >
            <span
              v-for="reaction in reactionPreviewIcons"
              :key="reaction.type"
              class="facebook-post-card__reaction-emoji"
            >
              {{ reaction.emoji }}
            </span>
          </div>
        </div>
        <BlogReactionPicker
          class="facebook-post-card__reaction-picker facebook-post-card__reaction-picker--icon"
          size="small"
          density="comfortable"
          :model-value="reactionType"
          :count="reactionCount"
          :loading="post.ui.likeLoading"
          :disabled="!loggedIn"
          :show-caret="loggedIn"
          :show-count="false"
          @select="onSelectReaction"
          @remove="onRemoveReaction"
        />
        <v-btn
          v-if="reactionCount > 0"
          variant="text"
          class="facebook-post-card__action-btn facebook-post-card__reaction-count"
          :aria-label="reactionsButtonLabel"
          @click="emit('show-reactions', post)"
        >
          {{ formattedReactionCount }}
        </v-btn>
      </div>
      <div class="facebook-post-card__stats-right">
        <v-btn
          variant="text"
          class="facebook-post-card__action-btn facebook-post-card__action-btn--stat"
          :loading="post.ui.commentsLoading"
          :aria-label="commentsToggleLabel"
          @click="emit('toggle-comments', post)"
        >
          <v-icon
            :icon="
              post.ui.commentsVisible
                ? 'mdi-comment-off-outline'
                : 'mdi-comment-text-outline'
            "
            class="facebook-post-card__action-icon"
          />
          <span
            v-if="formattedCommentCount > 0"
            class="facebook-post-card__action-count"
            >{{ formattedCommentCount }}</span
          >
        </v-btn>
        <v-btn
          variant="text"
          class="facebook-post-card__action-btn facebook-post-card__action-btn--stat"
          :aria-label="shareButtonLabel"
          @click="emit('share', post)"
        >
          <v-icon icon="mdi-share" class="facebook-post-card__action-icon" />
          <span
            v-if="formattedShareCount > 0"
            class="facebook-post-card__action-count"
            >{{ formattedShareCount }}</span
          >
        </v-btn>
      </div>
    </div>

    <v-expand-transition>
      <div
        v-if="post.ui.commentsVisible"
        class="facebook-post-card__comments-section"
      >
        <BlogPostComments
          :post="post"
          :logged-in="loggedIn"
          :format-date="formatPublishedAt"
          :format-relative-date="formatRelativePublishedAt"
          :current-user-id="currentUserId"
          @submit-comment="onSubmitComment"
          @select-reaction="onSelectCommentReaction"
          @remove-reaction="onRemoveCommentReaction"
          @submit-reply="onSubmitCommentReply"
          @submit-comment-edit="onSubmitCommentEdit"
          @delete-comment="onDeleteComment"
        />
      </div>
    </v-expand-transition>

    <v-dialog v-model="isMediaPreviewOpen" max-width="1024">
      <v-card class="facebook-post-card__media-dialog" elevation="0">
        <v-card-text class="facebook-post-card__media-dialog-body">
          <v-img
            v-if="activeMedia?.kind === 'image'"
            :src="activeMedia.src"
            :alt="activeMedia.alt"
            class="facebook-post-card__media-preview-image"
            contain
          />
        </v-card-text>
        <v-card-actions class="facebook-post-card__media-dialog-actions">
          <v-spacer />
          <v-btn variant="text" @click="closeMediaPreview">
            {{ t('common.actions.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="post.ui.editDialog" max-width="640" persistent>
      <v-card>
        <v-card-title>{{ t('blog.dialogs.editTitle') }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="post.ui.editForm.title"
            :label="t('blog.forms.edit.title')"
            :disabled="post.ui.editForm.loading"
            required
          />
          <v-text-field
            v-model="post.ui.editForm.summary"
            :label="t('blog.forms.edit.summary')"
            :disabled="post.ui.editForm.loading"
          />
          <v-textarea
            v-model="post.ui.editForm.content"
            :label="t('blog.forms.edit.content')"
            :disabled="post.ui.editForm.loading"
            rows="6"
            auto-grow
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="post.ui.editForm.loading"
            @click="post.ui.editDialog = false"
          >
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="post.ui.editForm.loading"
            :disabled="!post.ui.editForm.title.trim().length"
            @click="emit('submit-edit', post)"
          >
            {{ t('common.actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AppCard>
</template>

<style scoped>
.facebook-post-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.facebook-post-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 0;
}

.facebook-post-card__avatar {
  flex-shrink: 0;
}

.facebook-post-card__avatar-link {
  display: inline-flex;
}

.facebook-post-card__header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.facebook-post-card__author-link {
  color: inherit;
  text-decoration: none;
}

a.facebook-post-card__author-link:hover,
a.facebook-post-card__author-link:focus-visible {
  text-decoration: underline;
}

.facebook-post-card__meta {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.facebook-post-card__meta-icon {
  color: inherit;
}

.facebook-post-card__menu-btn {
  margin-left: auto;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.facebook-post-card__menu-btn:hover,
.facebook-post-card__menu-btn:focus-visible {
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.facebook-post-card__body {
  padding: 0 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.facebook-post-card__shared-post {
  margin-top: 12px;
}

.facebook-post-card__title {
  display: inline-block;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.92);
  text-decoration: none;
  font-size: 1.05rem;
  line-height: 1.4;
}

.facebook-post-card__title:hover,
.facebook-post-card__title:focus-visible {
  text-decoration: underline;
}

.facebook-post-card__text {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.87);
  line-height: 1.6;
  font-size: 1rem;
}

.facebook-post-card__text--muted {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.facebook-post-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.facebook-post-card__tag {
  font-weight: 600;
  cursor: pointer;
}

.facebook-post-card__preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-surface-variant), 0.22),
    rgba(var(--v-theme-surface-variant), 0.08)
  );
  border: 1px solid rgba(var(--v-theme-on-surface), 0.04);
}

.facebook-post-card__preview--media {
  padding: 12px;
}

.facebook-post-card__preview-media {
  overflow: hidden;
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  position: relative;
}

.facebook-post-card__preview-media--video {
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.facebook-post-card__preview-image,
.facebook-post-card__preview-video {
  width: 100%;
  height: 100%;
}

.facebook-post-card__preview-video {
  border: none;
  border-radius: 12px;
  object-fit: cover;
  background: #000;
}

.facebook-post-card__embed-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
}

.facebook-post-card__embed-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 12px;
}

.facebook-post-card__preview-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(var(--v-theme-on-surface), 0.85);
  font-weight: 600;
  text-decoration: none;
}

.facebook-post-card__preview-link:hover,
.facebook-post-card__preview-link:focus-visible {
  color: rgba(var(--v-theme-primary), 0.85);
  text-decoration: underline;
}

.facebook-post-card__preview-icon {
  color: rgba(var(--v-theme-primary), 0.7);
}

.facebook-post-card__preview-open {
  color: rgba(var(--v-theme-on-surface), 0.4);
}

.facebook-post-card__preview-host {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.facebook-post-card__media-gallery {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin-top: 6px;
}

.facebook-post-card__media-item {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(var(--v-theme-on-surface), 0.05);
  min-height: 180px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
}

.facebook-post-card__media-image {
  width: 100%;
  height: 100%;
}

.facebook-post-card__media-image[role='button'] {
  cursor: zoom-in;
}

.facebook-post-card__media-image[role='button']:focus-visible {
  outline: 2px solid rgba(var(--v-theme-primary));
  outline-offset: 2px;
}

.facebook-post-card__media-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.facebook-post-card__media-video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.facebook-post-card__media-video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.facebook-post-card__media-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  text-align: center;
}

.facebook-post-card__media-fallback span {
  font-size: 0.85rem;
  line-height: 1.4;
}

.facebook-post-card__media-dialog {
  background: rgba(var(--v-theme-surface), 0.98);
  border-radius: 18px;
}

.facebook-post-card__media-dialog-body {
  padding: 20px 20px 0;
}

.facebook-post-card__media-preview-image {
  border-radius: 12px;
  max-height: min(80vh, 760px);
  width: 100%;
}

.facebook-post-card__media-dialog-actions {
  padding: 12px 16px 16px;
}

.facebook-post-card__stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 12px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.facebook-post-card__stats-left,
.facebook-post-card__stats-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.facebook-post-card__reaction-summary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.facebook-post-card__reaction-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.facebook-post-card__reaction-emoji {
  font-size: 20px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.facebook-post-card__reaction-count {
  min-width: auto;
  padding-inline: 12px;
  border-radius: 999px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.facebook-post-card__reaction-count:hover,
.facebook-post-card__reaction-count:focus-visible {
  color: rgba(var(--v-theme-on-surface), 0.9);
  background: rgba(var(--v-theme-primary), 0.08);
}

.facebook-post-card__reaction-picker {
  display: inline-flex;
  align-items: center;
}

.facebook-post-card__reaction-picker--icon {
  order: 2;
}

.facebook-post-card__reaction-picker--icon
  :deep(.blog-reaction-picker__action) {
  min-width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 999px;
}

.facebook-post-card__reaction-picker--icon :deep(.blog-reaction-picker__label),
.facebook-post-card__reaction-picker--icon :deep(.blog-reaction-picker__count) {
  display: none;
}

.facebook-post-card__reaction-picker--icon :deep(.blog-reaction-picker__emoji) {
  margin-right: 0;
  font-size: 20px;
}

.facebook-post-card__reaction-picker--icon :deep(.v-icon) {
  margin-right: 0;
}

.facebook-post-card__reaction-picker--placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 72px;
  block-size: 32px;
  border-radius: 16px;
  background-color: rgba(var(--v-theme-surface-variant), 0.35);
}

.facebook-post-card__reaction-picker :deep(.blog-reaction-picker__action) {
  padding: 2px;
  min-width: 40px;
}

.facebook-post-card__reaction-picker :deep(.blog-reaction-picker__count) {
  font-weight: 600;
}

.facebook-post-card__reaction-picker :deep(.blog-reaction-picker__label) {
  font-size: 0.85rem;
}

.facebook-post-card__reaction-picker :deep(.blog-reaction-picker__caret) {
  margin-left: 4px;
}

.facebook-post-card__action-btn {
  text-transform: none;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
  letter-spacing: 0;
  border-radius: 999px;
}

.facebook-post-card__action-btn:hover,
.facebook-post-card__action-btn:focus-visible {
  color: rgba(var(--v-theme-on-surface), 0.9);
  background: rgba(var(--v-theme-primary), 0.08);
}

.facebook-post-card__action-btn--stat {
  gap: 8px;
  padding-inline: 16px;
}

.facebook-post-card__action-icon {
  margin-right: 0;
}

.facebook-post-card__action-text {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}

.facebook-post-card__action-count {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
}

.facebook-post-card__meta-separator {
  color: rgba(var(--v-theme-on-surface), 0.45);
}

.facebook-post-card__comments-section {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  padding-bottom: 20px;
}

@media (max-width: 960px) {
  .facebook-post-card__stats {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .facebook-post-card__stats-right {
    justify-content: flex-start;
  }
}
</style>
