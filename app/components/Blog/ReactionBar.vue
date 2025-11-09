<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    reactionsCount: number
    commentsCount: number
    clickable?: boolean
  }>(),
  {
    clickable: false,
  },
)

const emit = defineEmits<{
  (event: 'click:reactions'): void
}>()

const { t } = useI18n()

function handleClick() {
  if (props.clickable) {
    emit('click:reactions')
  }
}
</script>

<template>
  <div class="blog-reaction-bar d-flex flex-wrap align-center">
    <v-btn
      v-if="clickable"
      variant="text"
      class="blog-reaction-bar__reactions blog-reaction-bar__reactions--button"
      @click="handleClick"
    >
      <v-icon icon="mdi-thumb-up-outline" class="mr-1" />
      <span class="text-body-2 font-weight-medium">
        {{ t('blog.stats.reactions', { count: reactionsCount }) }}
      </span>
    </v-btn>
    <div v-else class="blog-reaction-bar__reactions">
      <v-icon icon="mdi-thumb-up-outline" class="mr-1" />
      {{ t('blog.stats.reactions', { count: reactionsCount }) }}
    </div>

    <div class="blog-reaction-bar__comments">
      <v-icon icon="mdi-comment-text-outline" class="mr-1" />
      {{ t('blog.stats.comments', { count: commentsCount }) }}
    </div>
  </div>
</template>

<style scoped>
.blog-reaction-bar__reactions,
.blog-reaction-bar__comments {
  display: inline-flex;
  align-items: center;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-right: 1.5rem;
  margin-bottom: 0.5rem;
}

.blog-reaction-bar__reactions:last-child,
.blog-reaction-bar__comments:last-child {
  margin-right: 0;
}

.blog-reaction-bar__reactions--button {
  padding: 0;
  min-width: auto;
  color: rgb(var(--v-theme-on-surface-variant));
}

.blog-reaction-bar__reactions--button:hover,
.blog-reaction-bar__reactions--button:focus-visible {
  text-decoration: none;
}
</style>
