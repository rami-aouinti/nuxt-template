<template>
  <v-card v-bind="$attrs">
    <template v-if="$slots.header" #title>
      <slot name="header" />
    </template>
    <template v-if="$slots.subtitle" #subtitle>
      <slot name="subtitle" />
    </template>
    <template v-if="$slots.content">
      <slot name="content" />
    </template>
    <slot v-else />
    <template v-if="$slots.footer" #actions>
      <slot name="footer" />
    </template>
  </v-card>
</template>
