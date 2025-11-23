<template>
  <div class="flex min-h-screen">
    <SessionAdminSidebar />
    <main class="flex-1 bg-white">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import SessionAdminSidebar from './SessionAdminSidebar.vue'
</script>
