<template>
  <div class="terms-layout">
    <header>
      <h1>{{ t('Terms and Conditions') }}</h1>
    </header>

    <main>
      <router-view />
    </main>

    <footer />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Terms Terms Layout',
})

const { t } = useI18n()
</script>
