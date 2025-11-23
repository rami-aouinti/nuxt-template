<template>
  <v-input
    id="search_filter"
    v-model="item.title"
    :placeholder="$t('Title')"
    type="text"
  />
</template>

<script setup lang="ts">
export default {
  name: 'DocumentsFilter',
  props: {
    values: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    item() {
      return this.initialValues || this.values
    },
  },
  mounted() {},
  methods: {},
}
</script>
