<template>
  <v-toolbar density="comfortable" flat>
    <slot />
    <template v-if="$slots.start" #prepend>
      <slot name="start" />
    </template>
    <template v-if="$slots.end" #append>
      <slot name="end" />
    </template>
  </v-toolbar>
</template>
