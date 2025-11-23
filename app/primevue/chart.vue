<template>
  <v-sheet
    class="d-flex align-center justify-center"
    color="grey-lighten-4"
    min-height="240"
    v-bind="$attrs"
  >
    <slot>
      <div class="text-subtitle-2 text-medium-emphasis">Chart placeholder</div>
    </slot>
  </v-sheet>
</template>
