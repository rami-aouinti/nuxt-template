<template>
  <div>
    <h2 class="text-h3 font-small text-gray-800 mb-4">
      <slot name="header" />
    </h2>
    <hr class="m-0 mb-4" />
    <slot />
  </div>
</template>

<script setup lang="ts"></script>
