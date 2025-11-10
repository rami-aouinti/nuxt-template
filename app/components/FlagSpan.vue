<template>
  <span
    :class="cls"
    :style="styleObj"
    :aria-label="label"
    :title="label"
    role="img"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  code: string;   // 'de', 'fr', 'us', 'gb', 'en' (-> gb), etc.
  square?: boolean;
  rounded?: boolean;
  size?: string;  // ex. '1rem', '20px'
  title?: string;
}>(), {
  square: false,
  rounded: true,
  size: '1.5rem'
});

// Normalisation : si on reçoit 'en', on affiche le drapeau 'gb'
const flagCode = computed(() => {
  const c = (props.code || '').trim().toLowerCase();
  if (c === 'en') return 'gb';    // <- la règle demandée
  return c;
});

const cls = computed(() => [
  props.square ? 'fis' : 'fi',
  `fi-${flagCode.value}`          // ex. 'fi-gb' si code='en'
]);

const styleObj = computed(() => ({
  fontSize: props.size,
  borderRadius: props.rounded ? '9999px' : undefined
}));

// Optionnel : on garde le label aligné avec l'icône
const label = computed(() => props.title || flagCode.value.toUpperCase());
</script>
